// http://blog.pixelbreaker.com/polarclock
// http://mbostock.github.io/protovis/ex/clock.html

var container_parent = $('.display'),
	chart_container = $('#polar_clock'),
	width = container_parent.width(),
    height = width,
	vis, vis_group, aspect

var radius = (width / 2) / 2,
	s = .09,
	fsec = d3.time.format('%S s'),
	fmin = d3.time.format('%M m'),
	fhou = d3.time.format('%H h'),
	fwee = d3.time.format('%a'),
	fdat = d3.time.format('%d d'),
	fmon = d3.time.format('%b')

var fill = d3.scale.linear()
	.range([ 'hsl(252, 96%, 27%)', 'hsl(200, 96%, 34%)' ])
	.interpolate(interpolateHSL)

var arc = d3.svg.arc()
	.startAngle(0)
	.endAngle(function(d){
		return d.value * 2 * Math.PI
	})
	.innerRadius(function(d){
		return d.index * radius
	})
	.outerRadius(function(d){
		return (d.index + s) * radius
	})

vis = d3.select('#polar_clock').append('svg')
	.attr({
		'width': width,
		'height': height,
		'preserveAspectRatio': 'xMinYMid',
		'viewBox': '0 0 ' + width + ' ' + height
	})

vis_group = vis.append('g')
	.attr({
		'transform': 'translate(' + radius + ', ' + radius + ')'
	})

aspect = chart_container.width() / chart_container.height()

var g = vis_group.selectAll('g')
	.data(fields)
		.enter().append('g')

g.append('path')
	.attr({
		'd': arc
	})
	.style({
		'fill': function(d){
			return fill(d.value)
		}
	})

g.append('text')
	.attr({
		'text-anchor': 'middle',
		'dy': '1em'
	})
	.text(function(d){
		return d.text
	})

// update arcs
d3.timer(function(){
	var g = vis_group.selectAll('g')
		.data(fields)

	g.select('path')
		.attr({
			'd': arc
		})
		.style({
			'fill': function(d){
				return fill(d.value)
			}
		})

	g.select('text')
		.attr({
			'dy': function(d){
				return d.value < .5 ? '-.5em' : '1em'
			},
			'transform': function(d) {
				return 'rotate(' + 360 * d.value + ')'
					+ 'translate(0,' + -(d.index + s / 2) * radius + ')'
					+ 'rotate(' + (d.value < .5 ? -90 : 90) + ')'
			 },
			 'fill': '#fff',
			 'font-size': '10px'
		})
		.text(function(d){
			return d.text
		})

})

d3.select(self.frameElement).style('height', height + 'px')

function fields(){
	var d = new Date

	// var now = moment()
	// console.log('now: ', now)

	function days(){
		return 32 - new Date(d.getYear(), d.getMonth(), 32).getDate()
	}

	var second = (d.getSeconds() + d.getMilliseconds() / 1000) / 60,
		minute = (d.getMinutes() + second) / 60,
		hour = (d.getHours() + minute) / 24,
		weekday = (d.getDay() + hour) / 7,
		date = (d.getDate() - 1 + hour) / days(),
		month = (d.getMonth() + date) / 12

	return [
		{value: second,  index: .7, text: fsec(d)},
		{value: minute,  index: .6, text: fmin(d)},
		{value: hour,    index: .5, text: fhou(d)},
		{value: weekday, index: .4, text: fwee(d)},
		{value: date,    index: .3, text: fdat(d)},
		{value: month,   index: .2, text: fmon(d)},
	]
}

function interpolateHSL(a, b){
	var i = d3.interpolateString(a, b)
	return function(t){
		return d3.hsl(i(t))
	}
}