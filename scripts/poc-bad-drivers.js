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

d3.tsv('data/us-state-names.tsv', function(tsv){
    tsv.forEach(function(d, i){
        names[d.name] = {
            'code': d.code,
            'id': d.id
        }
    })
})

d3.csv('data/bad-drivers.csv', function(error, data){
    console.log('data: ', data)

    color.domain(d3.keys(data[0])
        .filter(function(key) {
            return key == 'State'
        })
    )

    var states = color.domain().map(function(name) {
        return {
            name: name,
            values: data.map(function(d) {
                return {
                    state: d.State,
                    code: names[d.State].code,
                    premium: d['Car Insurance Premiums ($)']
                }
            })
        }
    })

    states = states[0].values

    x.domain(states.sort(function(a, b) {
        return d3.ascending(a.state, b.state);
    })
    .map(function(d) {
        return d.code;
    }))

    y.domain([0,
        d3.max(states, function(d) {
            return parseInt(d.premium)
        })
    ])

    // domain/range for colors
    var yMax = d3.max(states, function(d){
        return d.premium
    })
    var yMin = d3.min(states, function(d){
        return d.premium
    })
    var colorScale = d3.scale.linear()
        .domain([ 0, yMax ])
        .range([ d3.rgb(maroon).brighter(), d3.rgb(maroon).darker() ])

    vis_group.append('g')
        .attr({
            'class': 'x axis',
            'transform': 'translate(0,' + height + ')'
        })
        .call(xAxis)
            .append('text')
            .attr({
                'class': 'chart-label',
                'x': width/2,
                'y': margins.bottom
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
                'y': -40
            })
            .text('Insurance Premium ($)')

    var bars = vis_group.selectAll('.bar')
        .data(states)
            .enter().append('rect')
        .attr({
            'x': function(d){
                return x(d.code)
            },
            'y': function(d){
                return height
            },
            'width': x.rangeBand(),
            'height': function(d){
                return 0
            },
            'fill': function(d){
                console.log('d: ', d)
                return colorScale(d.premium)
            },
            'opacity': .8
        })

    bars.transition()
        .delay(function(d, i){
            return i * 4
        })
        .ease('cubic')
        .attr({
            'y': function(d){
                return y(d.premium)
            },
            'height': function(d){
                return height - y(d.premium)
            }
        })

})

$(window).on('resize', function() {
    var targetWidth = container_parent.width()
    vis.attr({
        'width': targetWidth,
        'height': Math.round(targetWidth / aspect)
    })
})

