(function () {
	var container_parent = $('.display') ,
		chart_container = $('#example'),
		margins = {top: 20, right: 20, bottom: 20, left: 20},
		width = container_parent.width() - margins.left - margins.right,
		height = (width * 0.3) - margins.top - margins.bottom,
		vis, vis_group, aspect

	var x = d3.scale.ordinal()
				.domain(d3.range(3))
				.rangePoints([0, width], 2)

	var fields = [
		{ name: 'hours', value: 0, size: 24 },
		{ name: 'minutes', value: 0, size: 60 },
		{ name: 'seconds', value: 0, size: 60 }
	]

	var arc = d3.svg.arc()
			.innerRadius(50)
			.outerRadius(90)
			.startAngle(0)
			.endAngle(function(d){
				return (d.value / d.size) * 2 * Math.PI
			})

	var vis = d3.select('#example').append('svg')
		.attr({
			'width': width + margins.left + margins.right,
			'height': height + margins.top + margins.bottom,
			'preserveAspectRatio': 'xMinYMid',
			'viewBox': '0 0 ' + (width + margins.left + margins.right) + ' ' + (height + margins.top + margins.bottom)
		})
		
	vis_group = vis.append('g')
		.attr({
			'transform': 'translate(0,' + (height/2) + ')'
		})

	aspect = chart_container.width() / chart_container.height()

	setInterval(function(){
		var now = new Date()

		fields[0].previous = fields[0].value
		fields[0].value = now.getHours()
		fields[1].previous = fields[1].value
		fields[1].value = now.getMinutes()
		fields[2].previous = fields[2].value
		fields[2].value = now.getSeconds()

		var path = vis_group.selectAll('path')
			.data(fields.filter(function(d, i){ return d.value }), function(d){ return d.name })

		path
			.enter().append('path')
				.attr({ 
					'transform': function(d, i){ 
						return 'translate(' + x(i) + ', 0)' }
				})
			.transition()
				.ease('elastic')
				.duration(750)
				.attrTween('d', arcTween)

		path.transition()
				.ease('elastic')
				.duration(750)
				.attrTween('d', arcTween)

		path.exit().transition()
				.ease('bounce')
				.duration(750)
				.attrTween('d', arcTween)
				.remove()

	}, 1000)

	function arcTween(b) {
		var i = d3.interpolate({ value: b.previous }, b)
		return function(t){
			return arc(i(t))
		}
	}

	$(window).on('resize', function() {
		var targetWidth = container_parent.width()
		vis.attr({
			'width': targetWidth,
			'height': Math.round(targetWidth / aspect)
		})
	})

	// http://bl.ocks.org/mbostock/1098617
})()