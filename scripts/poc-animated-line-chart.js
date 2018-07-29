// http://bl.ocks.org/Matthew-Weber/5645518

var container_parent = $('.display'),
    chart_container = $('#chart'),
    margins = {top: 20, right: 20, bottom: 20, left: 30},
    width = container_parent.width() - margins.left - margins.right,
    height = (width * 0.3) - margins.top - margins.bottom,
    vis, vis_group, aspect, tooltip

(function () {
    queue()
        .defer(d3.json, 'data/combined.json')
        .await(ready)

    vis = d3.select('#chart').append('svg')
        .attr({
            'width': width + margins.left + margins.right,
            'height': height + margins.top + margins.bottom,
            'preserveAspectRatio': 'xMinYMid',
            'viewBox': '0 0 ' + (width + margins.left + margins.right) + ' ' + (height + margins.top + margins.bottom)
        })

    vis_group = vis.append('g')
        .attr({
            'transform': 'translate(' + margins.left + ', ' + margins.top + ')',
            'class': 'bob'
        })

    aspect = chart_container.width() / chart_container.height()

    tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 1e-6)    
})()

function ready(error, data){
    var browse = data[0].browse
    var search = data[0].search
    var add = data[0].add
    var watch = data[0].watch

    // Parse the date / time
    var parseDate = d3.time.format('%d-%b-%y').parse

    browse.forEach(function(d) {
        d.date = parseDate(d.date);
        d.count = +d.count;
    })

    search.forEach(function(d) {
        d.date = parseDate(d.date);
        d.count = +d.count;
    })

    add.forEach(function(d) {
        d.date = parseDate(d.date);
        d.count = +d.count;
    })

    watch.forEach(function(d) {
        d.date = parseDate(d.date);
        d.count = +d.count;
    })

    var xScale = d3.time.scale()
        .domain(d3.extent(browse, function(d) {
            return d.date;
            
        }))
        .range([0, width])

    var yScale = d3.scale.linear()
        .domain([ 0, 
            d3.max([ 
                d3.max(browse, function(d){
                    return d.count
                }), d3.max(browse, function(d){ 
                    return d.count
                })
            ])
        ])
        .range([ height, 0 ])

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom')
        .ticks(browse.length)
        .tickFormat(d3.time.format('%m/%d'))
        .tickSize(-height, 0, 0)

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient('left')

    var xAxisGroup = vis_group.append('g')
        .attr({
            'class': 'x axis',
            'transform': 'translate(0, ' + height + ')'
        })
        .call(xAxis)

    var yAxisGroup = vis_group.append('g')
        .attr({
            'class': 'y axis',
            'transform': 'translate(0, 0)'
        })
        .call(yAxis)
        .append('text')
            .attr({
                'transform': 'rotate(-90)',
                'y': 6,
                'dy': '.71em',
                'fill': '#ccc'
            })
            .style({
                'text-anchor': 'end'
            })
            .text('Number of adds')

    var lineFunction = d3.svg.line()
        .x(function(d){ 
            return xScale(d.date)
        })
        .y(function(d){
            return yScale(d.count)
        })

    // append the line to the group
    vis_group.append('path')
        .attr({
            'class': 'line',
            'd': lineFunction(browse),
        })

    // append the circles to the group
    vis_group.selectAll('circle')
            .data(browse)
        .enter().append("circle")
            .attr({
                'class': 'dot',
                'r': 5,
                'fill': 'white',
                'cx': function(d) {
                    return xScale(d.date)
                },
                'cy': function(d) {
                    return yScale(d.count)
                }
            })
            .style('cursor', 'pointer')
            .on('mouseover', function(d) {
                tooltip
                    .html( '<span>' + d.count + ' browsed</span>' )
                    .style({
                        'left': (d3.event.pageX) + 'px',
                        'top': (d3.event.pageY - 28) + 'px'
                    })
                    .transition()
                        .duration(500)
                        .style('opacity', 1) 
            })                
            .on('mouseout', function(d) {
                tooltip.transition()
                    .duration(500)
                    .style('opacity', 0)
            })

    function animate(type){
        var duration = 750

        d3.selectAll('.line').transition()
            .duration(duration)
            .attr({
                'd': function(d){
                    return lineFunction(type)
                }
            })

        vis_group.selectAll('.dot')
            .data(type)
            .transition()
            .duration(duration)
            .attr({
                'cx': function(d) {
                    return xScale(d.date)
                },
                'cy': function(d) {
                    return yScale(d.count)
                }
            })
    }

    $('body').on('click', '[rel="program-share-modal"]', function( e ) {
        e.preventDefault()
        var dataType = $(this).data('type')

        switch (dataType) {
            case 'browse':
                the_data = browse
                break;
            case 'search':
                the_data = search
                break;
            case 'add':
                the_data = add
                break;
            case 'watch':
                the_data = watch
                break;
            default:
                the_data = browse
        }

        animate(the_data)
    })
}
