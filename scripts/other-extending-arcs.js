var container_parent = $('.display'),
	chart_container = $('#chart'),
	margins = {top: 20, right: 20, bottom: 20, left: 20},
	width = container_parent.width() - margins.left - margins.right,
	height = (width * 0.8) - margins.top - margins.bottom,
	vis, vis_group, aspect,
	radius = Math.min(width, height) / 2 - margins.top

var outerRadius = radius,
	innerRadius = radius / 3

// set default color and animations
var defaults = {
	pad_angle: .02,
    colors: {
        fill_off: 'orange',
        fill_over: '#999',
        stroke_off: '#999',
        stroke_over: '#000'
    },
    animation: {
        delay_off: 0,
        delay_over: 150,
        strokeWidth_off: .5,
        strokeWidth_over: 1.5,
    }
}

var data = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89]

var pie = d3.layout.pie()
	.padAngle(defaults.pad_angle);

var arc = d3.svg.arc()
	.padRadius(outerRadius)
	.innerRadius(innerRadius)

var vis = d3.select('#chart').append('svg')
	.attr({
		'width': width + margins.left + margins.right,
		'height': height + margins.top + margins.bottom,
		'preserveAspectRatio': 'xMinYMid',
		'viewBox': '0 0 ' + (width + margins.left + margins.right) + ' ' + (height + margins.top + margins.bottom)
	})

vis_group = vis.append('g')
	.attr({
		'transform': 'translate(' + (width/2 + margins.left) + ', ' + (height/2 + margins.top) + ')'
	})

// helper for browser resizing
aspect = chart_container.width() / chart_container.height()

vis_group.selectAll('path')
		.data(pie(data))
	.enter().append('path')
		.each(function(d) {
			d.outerRadius = outerRadius
		})
		.attr({
			'd': arc,
			'fill': defaults.colors.fill_off,
			'stroke': defaults.colors.stroke_off,
			'stroke-width': defaults.animation.strokeWidth_off
		})
		.on('mouseover', user_interaction('over'))
		.on('mouseout', user_interaction('out'))

function user_interaction(event){
	var rad = event == 'over' ? outerRadius + 20 : outerRadius
	var delay = event == 'over' ? defaults.animation.delay_off : defaults.animation.delay_over
	var fill_color = event == 'over' ? defaults.colors.fill_over : defaults.colors.fill_off
	var stroke_color = event == 'over' ? defaults.colors.stroke_over : defaults.colors.stroke_off
	var stroke_width = event == 'over' ? defaults.animation.strokeWidth_over : defaults.animation.strokeWidth_off

	return function() {
		d3.select(this)
			.transition()
				.delay(delay)
				.attrTween('d', function(d) {
					var i = d3.interpolate(d.outerRadius, rad)
					return function(t) {
						d.outerRadius = i(t)
						return arc(d)
					}
				})
				.style({
					'fill': fill_color,
					'stroke': stroke_color,
					'stroke-width': stroke_width,
					'cursor': 'pointer'
				})
	}
}

// browser resizing
$(window).on('resize', function() {
	var targetWidth = container_parent.width()
	vis.attr({
		'width': targetWidth,
		'height': Math.round(targetWidth / aspect)
	})
})
