var container_parent = $('.display'),
    chart_container = $('#pollen-count'),
    margins = {top: 20, right: 20, bottom: 20, left: 20},
    width = $('#pollen-count').width(),
    height = $('#pollen-count').width(),
    vis, vis_group, aspect

var duration = 1500,
	transition = 200,
	percent = 45

var dataset = {
		lower: calcPercent(0),
		upper: calcPercent(percent)
	},
	radius = Math.min(width, height) / 3,
	pie = d3.layout.pie().sort(null),
	format = d3.format('.0%');

var arc = d3.svg.arc()
		.innerRadius(radius * .8)
		.outerRadius(radius);

var vis = d3.select('#pollen-count').append('svg')
	.attr({
        'width': width + margins.left + margins.right,
        'height': height + margins.top + margins.bottom,
        'class': 'chart',
        'preserveAspectRatio': 'xMinYMid',
        'viewBox': '0 0 ' + (width + margins.left + margins.right) + ' ' + (height + margins.top + margins.bottom)
    })

vis_group = vis.append('g')
    .attr({
        'transform': 'translate(' + width/2 + ', ' + 220 + ')'
    })

var path = vis_group.selectAll('path')
	.data(pie(dataset.lower))
	.enter().append('path')
	.attr({
		'class': function (d, i) {
			return 'color' + i
		},
		'd': arc
	})
	.each(function (d) {
		this._current = d;
	});

var text = vis_group.append('text')
	.attr({
		'text-anchor': 'middle',
		'dy': '.3em'
	})

var progress = 0;

var timeout = setTimeout(function () {
	clearTimeout(timeout);
	path = path.data(pie(dataset.upper));
	path.transition().duration(duration).attrTween('d', function (a) {
		var i = d3.interpolate(this._current, a);
		var i2 = d3.interpolate(progress, percent)
		this._current = i(0);
		return function (t) {
			text.text(format(i2(t) / 100));
			return arc(i(t));
		};
	});
}, 200);

function calcPercent(percent) {
	return [percent, 100 - percent];
};