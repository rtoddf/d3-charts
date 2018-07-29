var container_parent = $('.display'),
    chart_container = $('#premiums_chart'),
    margins = {top: 20, right: 50, bottom: 40, left: 50},
    width = container_parent.width() - margins.left - margins.right,
    height = (width * 0.3) - margins.top - margins.bottom,
    vis, vis_group, aspect

var color = d3.scale.category10();

var maroon = d3.rgb('maroon')
var steelblue = d3.rgb('steelblue')

var fill = d3.scale.ordinal()
    .domain(d3.range(4))
    .range(['#000000', '#FFDD89', '#957244', '#003264']);

var names = {}

var formatPercent = d3.format('.0')

var x = d3.scale.ordinal()
    .rangeRoundBands([ 0, width ], .1)

var y = d3.scale.linear()
    .range([ height, 0 ])

var xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom')

var yAxis = d3.svg.axis()
    .scale(y)
    .orient('left')
    .tickSize(-width)
    .tickFormat(formatPercent)

vis = d3.select('#premiums_chart').append('svg')
    .attr({
        'width': width + margins.left + margins.right,
        'height': height + margins.top + margins.bottom,
        'class': 'chart',
        'preserveAspectRatio': 'xMinYMid',
        'viewBox': '0 0 ' + (width + margins.left + margins.right) + ' ' + (height + margins.top + margins.bottom)
    })

vis_group = vis.append('g')
    .attr({
        'transform': 'translate(' + margins.left + ', ' + margins.top + ')'
    })

aspect = chart_container.width() / chart_container.height()

var tooltip = d3.select('body').append('div')
    .attr({
        'class': 'tooltip',
        'opacity': 1e-6
    })
    .style({
        
    })

$(window).on('resize', function() {
    var targetWidth = container_parent.width()
    vis.attr({
        'width': targetWidth,
        'height': Math.round(targetWidth / aspect)
    })
})


var State = function(stats){
	this.stats = isDefined(stats)
	this.longName = isDefined(stats.state_name)
	this.shortName = isDefined(stats.short_name)
}

d3.json('data/state_labor_stats.json', function(error, response){
	console.log('response: ', response)

	var stats = []
	var year = 2014

	$.each(response, function(key, val){
		var lastestStats = val[year][val[year].length - 1]
		var state = new State(lastestStats)
		stats.push(state)
	})

	stats = _.sortBy(stats, function(a){
		return (a['longName']).split(' ')
	})

	d3.select('.month')
        .html(stats[0].stats.periodName)

	d3.select('.year')
        .html(stats[0].stats.year)

	x.domain(stats.sort(function(a, b) {
		return d3.ascending(a.shortName, b.shortName);
	})
	.map(function(d) {
		return d.shortName;
	}))

    var min_percentage = d3.min(stats, function(d){
        return d.stats.unemployment_percent
    })

    var max_percentage = d3.max(stats, function(d){
        return d.stats.unemployment_percent
    })

	y.domain([ 0, max_percentage ])

    // domain/range for colors
    var colorScale = d3.scale.linear()
        .domain([ 0, max_percentage ])
        .range([ d3.rgb(steelblue).brighter(), d3.rgb(steelblue).darker() ])

	vis_group.append('g')
		.attr({
			'class': 'x axis',
			'transform': 'translate(0,' + height + ')'
		})
		.call(xAxis)
			.append('text')
			.attr({
				'x': width/2,
				'y': margins.bottom,
                'class': 'chart-label'
			})
			.text('State')

	vis_group.append('g')
		.attr({
			'class': 'y axis'
		})
		.call(yAxis)
			.append('text')
			.attr({
                'class': 'chart-label',
				'transform': 'rotate(-90)',
				'x': -40,
				'y': -30
			})
			.text('Unemployment Rate %')

	var bars = vis_group.selectAll('.bar')
		.data(stats)
			.enter().append('rect')
		.attr({
            'x': function(d){
                return x(d.shortName)
            },
            'y': function(d){
                return height
            },
            'width': x.rangeBand(),
            'height': function(d){
                return 0
            },
			'fill': function(d){
				return colorScale(d.stats.unemployment_percent)
			},
            'class': 'bar',
            'opacity': .6
		})

		bars.transition()
    		.delay(function(d, i){
    			return i * 4
    		})
    		.ease('cubic')
    		.attr({
    			'y': function(d){
    				return y(d.stats.unemployment_percent)
    			},
    			'height': function(d){
	    			return height - y(d.stats.unemployment_percent)
	    		}
	    	})
		
		bars.on('mouseover', function(d) {
			d3.select(this)
				.transition()
				.duration(200)
				.attr({
					'opacity': 1,
				})
                .style({
                    'cursor': 'pointer'
                })

			d3.select('.tooltip')
                .html(function(){
                    return '<span>' + d.longName + ': ' + d.stats.unemployment_percent + '%</span>'
                })
    			.style({
                    'left': (d3.event.pageX + 15) + 'px',
                    'top': (d3.event.pageY) + 'px'
                })
                .transition()
                    .duration(200)
                    .style({
                        'opacity': 1
                    })
		})

		bars.on('mouseout', function(d) {
			d3.select(this)
				.transition()
				.duration(200)
				.attr({
					'fill': function(d){
						return colorScale(d.stats.unemployment_percent)
					},
					'opacity': .6,
				})

            d3.select('.tooltip')
                .transition()
                    .duration(100)
                    .style({
                        'opacity': 0
                    })
		})

		vis_group
			.on('mouseout', function(d){
				tooltip
					.attr({
						'opacity': 0
					})
			})

	$('button').on('click', function(){
		var sort = $(this).data('sort')
		d3.select(this)
			.property('sort', sort)
			.each(change)
	})

	function change() {
		// Copy-on-write since tweens are evaluated after a delay.
		if(this.sort == 'desc'){
			var x0 = x.domain(stats.sort(function(a, b) {
				return b.stats.unemployment_percent - a.stats.unemployment_percent;
			})
			.map(function(d) {
				return d.shortName;
			}))
			.copy()
		} else if(this.sort == 'asc'){
			var x0 = x.domain(stats.sort(function(a, b) {
				return a.stats.unemployment_percent - b.stats.unemployment_percent;
			})
			.map(function(d) {
				return d.shortName;
			}))
			.copy()
		} else if(this.sort == 'alpha_asc'){
			var x0 = x.domain(stats.sort(function(a, b) {
				return d3.ascending(a.shortName, b.shortName);
			})
			.map(function(d) {
				return d.shortName;
			}))
			.copy()
		} else{
			var x0 = x.domain(stats.sort(function(a, b) {
				return d3.descending(a.shortName, b.shortName);
			})
			.map(function(d) {
				return d.shortName;
			}))
			.copy()
		}

		var transition = vis_group.transition().duration(750),
			delay = function(d, i) {
				return i * 30;
			};

		transition.selectAll('.bar')
			.delay(delay)
			.ease('cubic')
			.attr('x', function(d) {
				return x0(d.shortName);
			});

		transition.select('.x.axis')
			.call(xAxis)
				.selectAll('g')
					.delay(delay);
	}
})
