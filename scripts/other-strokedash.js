// http://bl.ocks.org/mbostock/5649592

var container_parent = $('.display'),
	chart_container = $('#example'),
	margins = {top: 20, right: 20, bottom: 20, left: 20},
	width = container_parent.width() - margins.left - margins.right,
	height = (width * 0.5) - margins.top - margins.bottom,
	vis, vis_group, aspect

var points = [
	[ 480, 200 ],
	[ 580, 400 ],
	[ 680, 100 ],
	[ 780, 300 ],
	[ 180, 300 ],
	[ 280, 100 ],
	[ 380, 400 ]
];

(function () {
	var x = d3.scale.linear()
		.range([ 100, width-100 ])
		.domain(d3.extent(points, function(d) {
			return d[0]
		}))

	var y = d3.scale.linear()
		.range([ margins.top, height - margins.bottom ])
		.domain(d3.extent(points, function(d) {
			return d[1]
		}))

	var line = d3.svg.line()
		.x(function(d, i){
			return x(d[0])
		})
		.y(function(d, i){
			return y(d[1])
		})
		.tension(0)
		.interpolate('cardinal-closed')

	vis = d3.select('#example').append('svg')
		.attr({
			'width': width,
			'height': height,
			'preserveAspectRatio': 'xMinYMid',
			'viewBox': '0 0 ' + width + ' ' + height
		})

	vis_group = vis.append('g')
		// why datum?
		.datum(points)

	aspect = chart_container.width() / chart_container.height()

	vis_group.append('path')
		.attr({
			'd': line,
			'stroke-dasharray': '4,4'
		})
		.style({
			'fill': 'none',
			'stroke': 'rgba(0,50,100,.25)',
			'stroke-width': 3
		})

	vis_group.append('path')
		.attr({
			'd': line
		})
		.style({
			'fill': 'none',
			'stroke': 'rgba(0,50,100,1)',
			'stroke-width': 3
		})
		.call(transition)
})()

function transition(path){
	path.transition()
		.duration(7500)
		.attrTween('stroke-dasharray', tweenDash)
		.each('end', function(){
			d3.select(this).call(transition)
		})
}

function tweenDash(){
	// what does interpolate and interpolateString do?
	var l = this.getTotalLength(),
		i = d3.interpolateString('0, ' + l, l + ',' + l)
		
	return function(t){
		return i(t)
	}
}

$(window).on('resize', function() {
	var targetWidth = container_parent.width()
	vis.attr({
		'width': targetWidth,
		'height': Math.round(targetWidth / aspect)
	})
})