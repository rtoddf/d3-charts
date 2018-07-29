var outerRadius = radius,
	innerRadius = radius / 2

var arc = d3.svg.arc()
	.padRadius(outerRadius)
	.innerRadius(innerRadius)

var pie = d3.layout.pie()
	.padAngle(defaults.pad_angle)
	.value(function(d){
		return d.percentage
	})

var total

var Piechart = new function(){
	this.get = function(){
		d3.json('data/population.json', function(error, data){
			data.forEach(function(d){
				d.percentage = +d.percentage
			})

			total = d3.sum(pie(data), function(d){
				return d.value
			})

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
				.each(function(d) {
					d3.select(this).on('mouseover', user_interaction)
					d3.select(this).on('mouseout', user_interaction)
				})
		})
	}
}

Piechart.get()

function user_interaction(d){
	var rad = d3.event.type == 'mouseover' ? outerRadius + 20 : outerRadius
	var fill_color = d3.event.type == 'mouseover' ? defaults.colors.fill_over : defaults.colors.fill_off
	var delay = d3.event.type == 'mouseover' ? defaults.animation.delay_off : defaults.animation.delay_over
	var tooltip_opacity = d3.event.type == 'mouseover' ? defaults.opacity.over : defaults.opacity.out
	var text_opacity = d3.event.type == 'mouseover' ? defaults.opacity.over : defaults.opacity.out

	// animate the arc
	d3.select(this)
		.transition()
			.delay(delay)
			.attrTween('d', function(d) {
				percentage = d.data.percentage
				var i = d3.interpolate(d.outerRadius, rad)
				return function(t) {
					d.outerRadius = i(t)
					return arc(d)
				}
			})
			.style({
				'cursor': 'pointer',
				'fill': fill_color
			})

	// show the tooltip and set the text
	d3.select('.tooltip')
		.html(function(){
			return '<span>' + d.data.race + '</span>'
		})
		.style({
			'left': (d3.event.pageX) + 'px',
			'top': (d3.event.pageY - 28) + 'px'
		})
		.transition()
			.duration(defaults.animation.duration)
			.style({
				'opacity': tooltip_opacity
			})

	// remove the previous percentage from the center of the chart
	d3.select('.percentage')
		.remove()

	// append the percentage to the center of the chart
	vis_group.append('text')
		.attr({
			'class': 'percentage',
			'x': radius / 20,
			'y': radius / 20 + 10,
			'text-anchor': 'middle',
			'font-size': radius / 3,
			'opacity': defaults.opacity.out
		})
		.text(function(t){
			return ((d.data.percentage/total) * 100).toFixed(0) + '%'
		})
		.transition()
			.duration(defaults.animation.duration)
			.style({
				'opacity': text_opacity
			})

}
