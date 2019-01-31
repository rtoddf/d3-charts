// http://bl.ocks.org/nbremer/d3189be2788ad3ca825f665df36eed09
// https://www.visualcinnamon.com/2016/06/glow-filter-d3-visualization.html

var container_parent = $('.display') ,
	chart_container = $('#chart'),
	margins = {top: 0, right: 20, bottom: 20, left: 20},
	width = container_parent.width(),
	height = (width * .5),
	vis, vis_group, aspect,
	stdDeviation = 8.5

vis = d3.select('#chart').append('svg')
	.attrs({
		'width': width + margins.left + margins.right,
		'height': height + margins.top + margins.bottom,
		'preserveAspectRatio': 'xMinYMid',
		'viewBox': '0 0 ' + (width + margins.left + margins.right) + ' ' + (height + margins.top + margins.bottom)
	})

vis_group = vis.append('g')
aspect = chart_container.width() / chart_container.height()

var glowOn = true;
//Switch between glow filter and no filter on click
function switchGlow() {
	d3.selectAll('.exampleGlow')
		.style('filter', glowOn ? 'none' : 'url(#glow)');
	glowOn = glowOn ? false : true;
}

// Create the filter
var defs = vis_group.append('defs');

var filter = defs.append('filter')
	.attrs({
		'id': 'glow'
	});

filter.append('feGaussianBlur')
	.attrs({
		'class': 'blur',
		'stdDeviation': stdDeviation
	})

filter.append('feOffset')
	.attrs({
		'dx': 0,
		'dy': 0,
		'result': 'coloredBlur'
	})

var feMerge = filter.append('feMerge');

feMerge.append('feMergeNode')
	.attrs({
		'in': 'coloredBlur'
	});

// feMerge.append('feMergeNode')
// 	.attrs({
// 		'in': 'SourceGraphic'
// 	});

// Create the circle, path and rect
var defaults = {
	rect: {
		x: 400,
		y: 100,
		width: 200,
		height: 200,
		fill: '#fff'
	},
	circle: {
		cx: 200,
		cy: 200,
		radius: 100,
		fill: '#fff'
	},
	glow: {
		fill: '#ae0000'
	}
}

vis_group.append('rect')
	.attrs({
		'x': defaults.rect.x,
		'y': defaults.rect.y,
		'width': defaults.rect.width + 10,
		'height': defaults.rect.height + 10,
		'fill': defaults.glow.fill
	})
	.style('filter','url(#glow)')

vis_group.append('rect')
	.attrs({
		'x': defaults.rect.x,
		'y': defaults.rect.y,
		'width': defaults.rect.width,
		'height': defaults.rect.height,
		'fill': defaults.rect.fill
	})

vis_group.append('circle')
	.attrs({
		'class': defaults.circle.class,
		'cx': defaults.circle.cx,
		'cy': defaults.circle.cy,
		'r': defaults.circle.radius + 10,
		'fill': defaults.glow.fill
	})
	.style('filter','url(#glow)')

vis_group.append('circle')
	.attrs({
		'cx': defaults.circle.cx,
		'cy': defaults.circle.cy,
		'r': defaults.circle.radius,
		'fill': defaults.circle.fill
	})

// d3.selectAll('.exampleGlow')
// 	.style('filter','url(#glow)');


//Adjust the spread of the glow with the simple range slider
// d3.select('input[type=range]').on('change', function() {
//     d3.select('.blur').attr('stdDeviation',this.value);
// });
