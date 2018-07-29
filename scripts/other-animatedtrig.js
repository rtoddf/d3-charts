// http://www.jasondavies.com/animated-trig/
// http://www.jasondavies.com/animated-trig/animated-trig.js

var container_parent = $('.display') ,
		chart_container = $('#animated_trig'),
		width = container_parent.width(),
		height = (width * 0.66),
		vis, vis_group, aspect

var interval = Math.PI / 30

// precompute sin and tan waves
var d = d3.range(0, Math.OI / 2 + interval, interval),
	sinWave = d.map(Math.sin),
	tanWave = d.map(Math.tan)

// remove problematic 'infinite' point
tanWave.pop()

// append the svg and group, as well as set the aspect for responsiveness
vis = d3.select('#animated_trig').append('svg')
		.attr({
			'width': width,
			'height': height,
			'preserveAspectRatio': 'xMinYMid',
			'viewBox': '0 0 ' + width + ' ' + height

		})

vis_group = vis.append('g');

aspect = chart_container.width() / chart_container.height();

(function () {
	var x = d3.scale.linear().domain([ -5, 15 ]).range([ 0, width ]),
		y = x,
		r = (function(a, b){
				return Math.sqrt(a * a + b * b)
			})(x.invert(width), y.invert(height))

	vis_group.append('g')
		.attr({
			'id': 'sinwave',
			'width': width,
			'height': height,
			'transform': 'translate(' + x(1) + ')'
		})
		.selectAll('path')
			.data([ d3.range(0, 8 * Math.PI + interval, interval).map(Math.sin)] )
				.enter().append('path')
			.attr({
				'class': 'wave',
				'd': d3.svg.line()
						.x(function(d, i){
							return x(i * interval) - x(0)
						})
						.y(function(d){
							return y(d)
						})
			})
			.style({
				'stroke': 'rgba(174,0,0,.75)',
				'stroke-width': 1.5
			})

	vis_group.append('g')
		.attr({
			'id': 'tanwave',
			'width': width,
			'height': height,
			'transform': 'translate(' + x(1) + ')'
		})
		.selectAll('path')
			.data(d3.range(8).map(function(d, i){
				return d3.range(-Math.PI / 2 + interval, Math.PI / 2, interval).map(Math.tan)
			}))
				.enter().append('path')
			.attr({
				'class': 'line',
				'transform': function(d, i){
					return 'translate(' + (x((i - .5) * Math.PI + interval) - x(0)) + ', 0)'
				},
				'd': d3.svg.line()
					.x(function(d, i){
						return x(i * interval) - x(0)
					})
					.y(function(d){
						return y(d)
					})
			})

	var filler = function(width, height){
		return vis_group.append('rect')
			.attr({
				'class': 'filler',
				'width': width,
				'height': height
			})
	}

	filler(x(1), height)

	vis_group.append('g')
		.attr({
			'id': 'coswave',
			'width': width,
			'height': height
		})
		.selectAll('path')
			.data([ d3.range(0, 5 * Math.PI + interval, interval).map(Math.cos) ])
				.enter().append('path')
			.attr({
				'class': 'wave',
				'd': d3.svg.line()
					.x(function(d){
						return x(d)
					})
					.y(function(d, i){
						return y(i * interval) - y(0)
					})
			})

	filler(x(1), y(1))

	var line = function(e, x1, y1, x2, y2){
		return e.append('line')
			.attr({
				'class': 'line',
				'x1': x1,
				'y1': y1,
				'x2': x2,
				'y2': y2
			})
	}

	var axes = function(cx, cy, cls){
		cx = x(cx),
		cy = y(cy)
		line(vis_group, cx, 0, cx, height)
			.attr({
				'class': cls || 'line'
			})
		line(vis_group, 0, cy, width, cy)
			.attr({
				'class': cls || 'line'
			})
	}

	axes(0, 0, 'axis')
	axes(1, 1, 'edge')

	vis_group.append('circle')
		.attr({
			'class': 'circle',
			'cx': x(0),
			'cy': y(0),
			'r': y(1) - y(0)
		})
		.style({
			'stroke': 'rgba(174,174,174,.75)',
			'stroke-width': 1.5
		})

	line(vis_group, x(0), y(0), x(1), y(0))
		.attr({
			'id': 'line'
		})
		.style({
			'stroke': 'rgba(174,0,0,1)',
			'stroke-width': 1.5
		})

	line(vis_group, x(-x.invert(width)), y(0), width, y(0))
		.attr({
			'id': 'tanline'
		})
		.style({
			'stroke': 'rgba(174,174,174,.75)',
			'stroke-width': 1.5
		})

	line(vis_group, 0, y(0), width, y(0))
		.attr({
			'id': 'xline'
		})
		.style({
			'stroke': 'rgba(174,174,174,.75)',
			'stroke-dasharray': '5,8',
			'stroke-width': 1.5
		})

	line(vis_group, x(0), 0, x(0), height)
		.attr({
			'id': 'yline'
		})
		.style({
			'stroke': 'rgba(174,174,174,.75)',
			'stroke-dasharray': '5,8',
			'stroke-width': 1.5
		})

	vis_group.append('circle')
		.attr({
			'class': 'circle',
			'id': 'dot',
			'cx': x(1),
			'cy': y(0),
			'r': 5
		})
		.style({
			'fill': 'rgba(174,174,174,.75)'
		})

	var offset = -4 * Math.PI,
		last = 0

	d3.timer(function(elapsed){
		offset += (elapsed - last) / 500
		last = elapsed

		if(offset > -2 * Math.PI) offset = -4 * Math.PI

		vis.selectAll('#sinwave, #tanwave')
			.attr({
				'transform': 'translate(' + x(offset + 5 * Math.PI / 4) + ', 0)'
			})

		vis.selectAll('#coswave')
			.attr({
				'transform': 'translate(0, ' + y(offset + 5 * Math.PI / 4) + ')'
			})

		vis.selectAll('#dot, #tanline')
			.attr({
				'transform': 'rotate(' + (180 - offset * 180 / Math.PI) + ', ' + x(0) + ', ' + y(0) + ')'
			})

		var xline = x(Math.sin(offset)) - x(0)
		var yline = y(-Math.cos(offset)) - y(0)

		vis_group.selectAll('#xline')
			.attr({
				'transform': 'translate(0, ' + xline + ')'
			})

		vis_group.selectAll('#yline')
			.attr({
				'transform': 'translate(' + yline + ', 0)'
			})
	})


	$(window).on('resize', function() {
		var targetWidth = container_parent.width()
		vis.attr({
			'width': targetWidth,
			'height': Math.round(targetWidth / aspect)
		})
	})
})()

// var isDateObject = function(obj){
//     return typeof(obj) === 'object' && obj === null ? obj : new Date(obj)
// }

// var date = "Mon Aug 19 2013 02:05:00 GMT-0400 (EDT)"
// var manny = d3.time.format('%X')
// var todd = manny(new Date(date))

// console.log(todd)