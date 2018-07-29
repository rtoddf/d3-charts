var container_parent = $('.display') ,
    chart_container = $('#chart'),
    width = container_parent.width(),
    height = width,
    vis, vis_group, aspect,
    radius = (width / 5) / 2,
    states_data

var color = d3.scale.category20c()
var format = d3.format(',.0f')

var defaults = {
    pad_angle: .02,
    animation: {
        duration: 500,
        easeType: 'back',
        scale: 1,
        scaleAmount: 1.1,
        diffFromCenter: radius / 20,
        delay_off: 0,
        delay_over: 150,
        strokeWidth_off: 0,
        strokeWidth_over: 1.5
    },
    colors: {
        fill_off: '#666',
        fill_over: '#003264',
        stroke_off: '#999',
        stroke_over: '#000'
    },
    opacity: {
        off: 1,
        over: 1,
        out: 0
    }
}

var arc = d3.svg.arc()
    .outerRadius(radius)
    .innerRadius(radius - 50)

var pie = d3.layout.pie()
    .padAngle(defaults.pad_angle)
    .value(function(d){
        return d.population
    })

var tooltip = d3.select('body').append('div')
    .attr({
        'class': 'tooltip',
        'opacity': 1e-6
    })

d3.json('data/states_by_age.json', function(error, data){
    var ageNames = d3.keys(data[0]).filter(function(key){
        return key!== 'State'
    })

    color.domain(d3.keys(data[0]).filter(function(key){
        return key !== 'State'
    }))

    data.forEach(function(d){
        d.ages = color.domain().map(function(name){
            return {
                name: name,
                population: +d[name]
            }
        }),
        d.state = d.State,
        d.total = function(){
            var total = 0
            d.ages.forEach(function(d){
                total += d.population
            })
            
            return total
        }()
    })

    states_data = data

    // legend
    var legend = d3.select('#chart').selectAll('.legend')
        .data(ageNames.slice().reverse())
            .enter().append('svg')
        .attr({
            'class': 'legend',
            'width': width / 7,
            'height': 25,
            'transform': function(d, i){
                return 'translate(0, ' + (i * 0) + ')'
            }
        })

    legend.append('rect')
        .attr({
            'width': 18,
            'height': 18,
            'fill': color
        })

    legend.append('text')
        .attr({
            'width': 180,
            'x': 24,
            'y': 9,
            'dy': '.35em',
        })
        .text(function(d){
            return d
        })

    vis = d3.select('#chart').selectAll('pie')
        .data(data)
            .enter().append('svg')
        .attr({
            'class': 'pie',
            'width': radius * 2,
            'height': radius * 2
        })
        
    vis_group = vis.append('g')
        .attr({
            'class': 'vis_group',
            'transform': 'translate(' + radius + ', ' + radius + ') scale(.9)'
        })

    aspect = chart_container.width() / chart_container.height()

    vis_group.selectAll('.arc')
        .data(function(d){
            return pie(d.ages)
        })
            .enter().append('path')
        .attr({
            'class': 'arc',
            'd': arc,
            'fill': function(d){
                return color(d.data.name)
            }
        })
        .on('mouseover', user_interaction)
        .on('mouseout', user_interaction)

    vis_group.append('text')
        .attr({
            'class': 'pie_label',
            'dy': '.35em',
            'text-anchor': 'middle'
        })
        .text(function(d){
            return d.State
        })

})

function user_interaction(d, i){
    var tooltip_opacity = d3.event.type == 'mouseover' ? defaults.opacity.over : defaults.opacity.off
    var stroke_width = d3.event.type == 'mouseover' ? defaults.animation.strokeWidth_over : defaults.animation.strokeWidth_off
    // var state_total = states_data[i].total

    function percentage(num, total){
        return (num/state_total * 100).toFixed(0) + '%'
    }

    d3.select(this)
        .attr({
            'stroke': defaults.colors.stroke_off
        })
        .transition()
            .duration(200)
            .attr({
                'stroke-width': stroke_width
            })
        .style({
            'cursor': 'pointer'
        })

    d3.select('.tooltip')
        .html(function(){
            return '<span>' + d.data.name + ': ' + format(d.data.population) + '</span>'
        })
        .style({
            'left': (d3.event.pageX) + 'px',
            'top': (d3.event.pageY - 28) + 'px'
        })
        .transition()
            .duration(200)
            .style({
                'opacity': tooltip_opacity
            })
}
