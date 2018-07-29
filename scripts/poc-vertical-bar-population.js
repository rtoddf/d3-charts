var container_parent = $('.display') ,
	chart_container = $('#chart'),
	margins = {top: 30, right: 90, bottom: 10, left: 90},
	width = container_parent.width() - margins.left - margins.right,
	height = (width) - margins.top - margins.bottom,
	color = d3.scale.category20c(),
	vis, vis_group, aspect

var rect_color = '#999'
var green = d3.rgb('teal')

// The comma (",") option enables the use of a comma for a thousands separator.
// The "0" option enables zero-padding.
// fixed ("f") - use Number.toFixed.
var format = d3.format(',.0f')

var x = d3.scale.linear()
	.range([ 0, width ])

var y = d3.scale.ordinal()
	.rangeRoundBands([ 0, height], .1)

var xAxis = d3.svg.axis()
	.scale(x)
	.orient('top')
	.tickSize(-height)

var yAxis = d3.svg.axis()
	.scale(y)
	.orient('left')
	.tickSize(0)

vis = d3.select('#chart').append('svg')
	.attr({
		'width': width + margins.left + margins.right,
		'height': height + margins.top + margins.bottom,
		'preserveAspectRatio': 'xMinYMid',
		'viewBox': '0 0 ' + (width + margins.left + margins.right) + ' ' + (height + margins.top + margins.bottom)
	})
	
vis_group = vis.append('g')
	.attr({
		'transform': 'translate(' + margins.left + ', ' + margins.top + ')'
	})

aspect = chart_container.width() / chart_container.height()

d3.json('data/us_census.json', function(error, data){
	data.forEach(function(d){
		d.pop = +d.pop
	})

	// set the scale domain
	x.domain([ 0, d3.max(data, function(d){
		return parseInt(d.pop)
	})])

    // use map for ordinal domains
    y.domain(data.sort(function(a, b) {
        return d3.descending(a.pop, b.pop);
    })
    .map(function(d) {
        return d.placename;
    }))

    // domain/range for colors
    var yMax = d3.max(data, function(d){
        return d.pop
    })
    var yMin = d3.min(data, function(d){
        return d.pop
    })
    var colorScale = d3.scale.linear()
        .domain([ 0, yMax ])
        .range([ d3.rgb(green).brighter(), d3.rgb(green).darker() ])

	var bar = vis_group.selectAll('rect')
			.data(data)
		.enter().append('rect')
		.attr({
            'class': 'bar',
            'x': 0,
            'y': function(d){
                return y(d.placename)
            },
			'width': function(d){
				return x(d.pop)
			},
			'height': function(d){
				return y.rangeBand()
			},
			'fill': function(d){
                return colorScale(d.pop)
            }
		})
		.style({
			'cursor': 'pointer'
		})
		.on('mouseover', function(d){
			d3.select(this)
				.transition()
					.duration(200)
					.attr({
						'fill': '#444'
					})

			d3.select('.tooltip')
				.html(function(){
					return '<span>' + d.placename + ': </span><span>' + format(d.pop) + '</span>'
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
		.on('mouseout', function(d){
			d3.select(this)
				.transition()
					.duration(200)
					.attr({
						'fill': function(d){
			                return colorScale(d.pop)
			            }
					})

			d3.select('.tooltip')
				.transition()
					.duration(200)
					.style({
						'opacity': 0
					})
		})

	vis_group.append('g')
		.attr({
			'class': 'x axis'
		})
		.call(xAxis)

	vis_group.append('g')
		.attr({
			'class': 'y axis'
		})
		.call(yAxis)


    $('button').on('click', function(){
        var sort = $(this).data('sort')
        d3.select(this)
            .property('sort', sort)
            .each(change)
    })

    function change() {
        // Copy-on-write since tweens are evaluated after a delay.
        if(this.sort == 'desc'){
            var y0 = y.domain(data.sort(function(a, b) {
                return d3.descending(a.pop, b.pop);
            })
            .map(function(d) {
                return d.placename;
            }))
            .copy()
        } else if(this.sort == 'asc'){
            var y0 = y.domain(data.sort(function(a, b) {
                return d3.ascending(a.pop, b.pop);
            })
            .map(function(d) {
                return d.placename;
            }))
            .copy()
        } else if(this.sort == 'alpha_asc'){
            var y0 = y.domain(data.sort(function(a, b) {
                return d3.ascending(a.placename, b.placename);
            })
            .map(function(d) {
                return d.placename;
            }))
            .copy()
        } else{
            var y0 = y.domain(data.sort(function(a, b) {
                return d3.descending(a.placename, b.placename);
            })
            .map(function(d) {
                return d.placename;
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
            .attr('y', function(d) {
                return y0(d.placename);
            });

        // this works
        transition.select('.y.axis')
            .call(yAxis)
                .selectAll('g')
                    .delay(delay);
    }
})

var tooltip = d3.select('body').append('div')
	.attr({
		'class': 'tooltip',
		'opacity': 1e-6
	})

$(window).on('resize', function() {
	var targetWidth = container_parent.width()
	vis.attr({
		'width': targetWidth,
		'height': Math.round(targetWidth / aspect)
	})
})
