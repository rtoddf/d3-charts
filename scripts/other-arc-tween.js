(function () {
	var container_parent = $('.display') ,
		chart_container = $('#example'),
		margins = {top: 50, right: 20, bottom: 20, left: 20},
		width = container_parent.width() - margins.left - margins.right,
		height = width - margins.top - margins.bottom,
		π = 2 * Math.PI,
		radius = width / 3,
		duration = 750,
		arc_color = 'rgba(255,255,255,.5)',
		color = 'rgba(0,50,100,1)'

	var arc = d3.svg.arc()
			.innerRadius(radius)
			.outerRadius(120)
			.startAngle(0)

	vis = d3.select('#example').append('svg')
		.attr({
			'width': width + margins.left + margins.right,
			'height': height + margins.top + margins.bottom,
			'preserveAspectRatio': 'xMinYMid',
			'viewBox': '0 0 ' + (width + margins.left + margins.right) + ' ' + (height + margins.top + margins.bottom)
		})
		
	vis_group = vis.append('g')
		.attr({
			'transform': 'translate(' + width / 2 + ', ' + height / 2 + ')'
		})

	aspect = chart_container.width() / chart_container.height()

	var background = vis_group.append('path')
			.datum({
				endAngle: π
			})
			.style({
				'fill': color
			})
			.attr({
				'd': arc
			})

	var foreground = vis_group.append('path')
			.datum({
				endAngle: π * .127
			})
			.style({
				'fill': arc_color
			})
			.attr({
				'd': arc
			})

	setInterval(function(){
		foreground.transition()
			.duration(duration)
			.call(arcTween, Math.random() * π)
	}, 1500)

	function arcTween(transition, newAngle) {
		transition.attrTween('d', function(d){
			var interpolate = d3.interpolate(d.endAngle, newAngle)
			return function(t){
				d.endAngle = interpolate(t)
				return arc(d)
			}
		})
	}

	$(window).on('resize', function() {
		var targetWidth = container_parent.width()
		vis.attr({
			'width': targetWidth,
			'height': Math.round(targetWidth / aspect)
		})
	})

})()