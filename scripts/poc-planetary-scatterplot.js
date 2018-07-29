var container_parent = $('.display') ,
	chart_container = $('#chart'),
	margins = {top: 20, right: 20, bottom: 40, left: 50},
	width = container_parent.width() - margins.left - margins.right,
	height = (width * 0.5) - margins.top - margins.bottom,
	vis, vis_group, aspect

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

vis_group.append('rect')
	.attr({
		'width': width,
		'height': height,
		'fill': 'rgba(13,19,45,1)'
	})

var tooltip = d3.select('body').append('div')
	.attr('class', 'tooltip')
	.style('opacity', 1e-6)

var x = d3.scale.linear()
	.range([ 0, width ])

var y = d3.scale.linear()
	.range([ height, 0 ])

var xAxis = d3.svg.axis()
	.scale(x)
	.orient('bottom')
	.tickFormat(d3.format('.3s'))
	
var yAxis = d3.svg.axis()
	.scale(y)
	.orient('left')
	.tickSize(-width)
	.tickFormat(d3.format('.2s'))

var defaults = {
	planet: {
		colors: [
			{
				'stop': 0,
				'color': 'rgba(253,173,0,1)'
			},
			{
				'stop': .75,
				'color': 'rgba(153,73,0,1)'
			}
		],
		gradientId: 'radial',
		fx: '5%',
		fy: '5%',
		r: '65%',
		spreadMethod: 'pad',
	},
	tool_tip: {
		stroke: 'rgba(0,0,0,1)',
		strokeWidth: 4,
		strokeOpacity: .5
	}
}

// begin defs
var defs = vis_group.append('defs')

var radialGradient = defs.append('radialGradient')
	.attr({
		'id': defaults.planet.gradientId,
		'fx': defaults.planet.fx,
		'fy': defaults.planet.fy,
		'r': defaults.planet.r,
		'spreadMethod': defaults.planet.spreadMethod
	})

radialGradient.selectAll('stop')
	.data(defaults.planet.colors)
		.enter().append('stop')
	.attr({
		'offset': function(d){
			return d.stop
		}
	})
	.style({
		'stop-color': function(d){
			return d.color
		}
	})

var filter = defs.append('filter')
		.attr({
			'id': 'dropshadow'
		})

filter.append('feGaussianBlur')
	.attr({
		'in': 'SourceAlpha',
		'stdDeviation': 2,
		'result': 'blur'
	})

filter.append('feOffset')
	.attr({
		'in': 'blur',
		'dx': 4,
		'dy': 4,
		'result': 'offsetblur'
	})

var feMerge = filter.append('feMerge')

feMerge.append('feMergeNode')
	.attr({
		'in': 'offsetblur'
	})

feMerge.append('feMergeNode')
	.attr({
		'in': 'SourceGraphic'
	})
// end defs

d3.json('data/planets.json', function(error, data){
	data = data.planets

	data.forEach(function(d) {
		d.distance = +d.distance
		d.diameter = +d.diameter
		d.density = +d.density
	})

	x.domain(d3.extent(data, function(d){
		return d.distance
	})).nice()

	y.domain(d3.extent(data, function(d){
		return d.density
	})).nice()

	vis_group.append('g')
		.attr({
			'class': 'x axis',
			'transform': 'translate(0,' + height + ')'
		})
		.call(xAxis)
			.append('text')
				.attr({
					'x': width,
					'dy': 30
				})
				.style({
					'text-anchor': 'end'
				})
				.text('Distance from the Sun (miles)')

	vis_group.append('g')
		.attr({
			'class': 'y axis'
		})
		.call(yAxis)
			.append('text')
				.attr({
					'transform': 'rotate(-90)',
					'x': '.17em',
					'y': -40
				})
				.style({
					'text-anchor': 'end'
				})
				.text('Density (kg pr. cubic meter)')

	planet = vis_group.selectAll('circle')
		.data(data)
			.enter().append('circle')
		.attr({
			'class': 'planet',
			'cx': function(d){
				return x(d.distance)
			},
			'cy': function(d){
				return y(d.density)
			},
			'r': function(d){
				if(d.diameter < 3000){
					return d.diameter / 350
				} else {
					return d.diameter / 1500
				}
			},
			'fill': 'url(#radial)',
			'stroke': defaults.tool_tip.stroke,
			'stoke-width': defaults.tool_tip.strokeWidth,
			'stroke-opacity': defaults.tool_tip.strokeOpacity
		})
		.style({
			'filter': 'url(#dropshadow)'
		})

	planet.on('mouseover', function(d) {
		d3.select(this)
			.style({
				'cursor': 'pointer'
			})

		tooltip.transition()
			.duration(200)
			.style('opacity', 1)

		tooltip
			.html(d.name)
			.style({
				'left': (d3.event.pageX + 10) + 'px',
				'top': (d3.event.pageY) + 'px'
			})
	})

	planet.on('mouseout', function(d) {
		tooltip.transition()
			.duration(200)
			.style('opacity', 0)
	})

	// var details = vis_group.append('g')
	// 	.attr({
	// 			'class': 'details',
	// 			'transform': 'translate(' + width/3 + ', ' + 30 + ')'
	// 		})

	// details
	// 	.append('rect')
	// 		.attr({
	// 			'width': width/3,
	// 			'height': 200,
	// 			'fill': 'white',
	// 			'opacity': .7
	// 		})

	// details
	// 	.append('text')
	// 		.attr({
	// 			'x': 15,
	// 			'y': 20
	// 		})
	// 		.text('bob')
})

$(window).on('resize', function() {
	var targetWidth = container_parent.width()
	vis.attr({
		'width': targetWidth,
		'height': Math.round(targetWidth / aspect)
	})
})