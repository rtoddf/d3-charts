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
