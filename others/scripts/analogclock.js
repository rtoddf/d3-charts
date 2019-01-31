(function () {
	var container_parent = $('.display') ,
		chart_container = $('#example'),
		margins = {top: 50, right: 20, bottom: 20, left: 20},
		width = container_parent.width() - margins.left - margins.right,
		height = (width * 0.3) - margins.top - margins.bottom,
		vis, vis_group, aspect

	var offSetX = width / 2,
		offSetY = height / 2,
		secondHandStroke = 1,
		minuteHandStroke = 2,
		hourHandStroke = 3,
		clockStrokeColor = 'rgba(255,255,255,1)',
		clockBackgroundColor = 'rgba(255,255,255,.25)'

	var inner_radius = 0,
		clock_radius = (height / 2) - 10,
		clock_innerRadius = height * .02

	var pi = Math.PI
	var scaleSecs = d3.scale.linear()
		.domain([ 0, 59 + 999/1000 ])
		.range([ 0, 2 * pi ])

	var scaleMins = d3.scale.linear()
		.domain([ 0, 59 + 59/60 ])
		.range([ 0, 2 * pi ])

	var scaleHours = d3.scale.linear()
		.domain([ 0, 11 + 59/60 ])
		.range([ 0, 2 * pi ])

	var fields = function(){
		var currentTime, hour, minute, seconds

		currentTime = new Date()
		second = currentTime.getSeconds()
		minute = currentTime.getMinutes()
		// Add the fraction of seconds elapsed if you prefer a smooth-sweeping minute handfairy dust. 
		hour = currentTime.getHours() + minute / 60

		return data = [
			{
				'unit': 'seconds',
				'numeric': second
			}, {
				'unit': 'minutes',
				'numeric': minute
			}, {
				'unit': 'hours',
				'numeric': hour
			}
		]
	}

	var render = function(data){
		var hourArc, minuteArc, secondArc
		var innerRadius = inner_radius,
			outerRadiusLong = clock_radius * .85,
			outerRadiusShort = clock_radius * .5

		// clears the last position of the clockhand
		vis_group.selectAll('.clockhand').remove()

		secondArc = d3.svg.arc()
			.innerRadius(innerRadius)
			.outerRadius(outerRadiusLong)
			.startAngle(function(d){
				return scaleSecs(d.numeric)
			})
			.endAngle(function(d){
				return scaleSecs(d.numeric)
			})

		minuteArc = d3.svg.arc()
			.innerRadius(innerRadius)
			.outerRadius(outerRadiusLong)
			.startAngle(function(d){
				return scaleMins(d.numeric)
			})
			.endAngle(function(d){
				return scaleMins(d.numeric)
			})

		hourArc = d3.svg.arc()
			.innerRadius(innerRadius)
			.outerRadius(outerRadiusShort)
			.startAngle(function(d){
				return scaleHours(d.numeric)
			})
			.endAngle(function(d){
				return scaleHours(d.numeric)
			})

		vis_group.selectAll('.clockHand')
			.data(data).enter()
				.append('path')
				.attr({
					'd': function(d){
						if(d.unit === 'seconds'){
							return secondArc(d)
						} else if (d.unit === 'minutes'){
							return minuteArc(d)
						} else if (d.unit === 'hours'){
							return hourArc(d)
						}
					},
					'class': 'clockhand',
					'stroke': clockStrokeColor,
					'stroke-width': function(d){
						if(d.unit === 'seconds'){
							return secondHandStroke
						} else if (d.unit === 'minutes'){
							return minuteHandStroke
						} else if (d.unit === 'hours') {
							return hourHandStroke
						}
					}
				})
	}

	var vis = d3.select('#example').append('svg')
		.attr({
			'width': width + margins.left + margins.right,
			'height': height + margins.top + margins.bottom,
			'preserveAspectRatio': 'xMinYMid',
			'viewBox': '0 0 ' + (width + margins.left + margins.right) + ' ' + (height + margins.top + margins.bottom)
		})

	var vis_group = vis.append('g')
		.attr({
			'transform': 'translate(' + offSetX + ', ' + offSetY + ')'
		})

	aspect = chart_container.width() / chart_container.height()

	vis_group.append('circle')
		.attr({
			'r': clock_radius,
			'fill': clockBackgroundColor,
			'class': 'clock',
			'stroke': clockStrokeColor,
			'stroke-width': hourHandStroke
		})

	vis_group.append('circle')
		.attr({
			'r': clock_innerRadius,
			'fill': clockStrokeColor,
			'class': 'clock inner'
		})

	setInterval(function(){
		var data
		data = fields()
		return render(data)
	}, 1000)

	$(window).on('resize', function() {
		var targetWidth = container_parent.width()
		vis.attr({
			'width': targetWidth,
			'height': Math.round(targetWidth / aspect)
		})
	})

})()