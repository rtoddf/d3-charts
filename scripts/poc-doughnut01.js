var container_parent = $('.display'),
    chart_container = $('#pollen-count'),
    margins = {top: 20, right: 20, bottom: 20, left: 20},
    width = $('#pollen-count').width(),
    height = 200,
    vis, vis_group, aspect

var duration = 1500,
	transition = 200,
	count = $('#pollen-count').attr('data-count')

var conditionsPercent = {
	'low': '25',
	'moderate': '50',
	'high': '75',
	'very-high': '100'
}

function conversionText(count){
	if(count > 1 && count <= 14){
		return 'Low'
	} else if(count >= 15 && count < 89){
		return 'Moderate'
	} else if(count >= 90 && count < 1499){
		return 'High'
	} else if(count > 1500){
		return 'Very High'
	} else {
		return 'No Data'
	}
}

function conversionClass(count){
	if(count > 1 && count <= 14){
		return 'low'
	} else if(count >= 15 && count < 89){
		return 'moderate'
	} else if(count >= 90 && count < 1499){
		return 'high'
	} else if(count > 1500){
		return 'very-high'
	} else {
		return 'no-data'
	}
}

var dataset = {
		lower: calcPercent(0),
		upper: calcPercent(conditionsPercent[conversionClass(count)])
	},
	radius = Math.min(width, height) / 2,
	pie = d3.layout.pie().sort(null),
	format = d3.format('.0%');

var arc = d3.svg.arc()
	.innerRadius(radius * .8)
	.outerRadius(radius);

vis = d3.select('#pollen-count').append('svg')
    .attr({
        'width': width + margins.left + margins.right,
        'height': height + margins.top + margins.bottom,
        'class': 'chart',
        'preserveAspectRatio': 'xMinYMid',
        'viewBox': '0 0 ' + (width + margins.left + margins.right) + ' ' + (height + margins.top + margins.bottom)
    })

vis_group = vis.append('g')
    .attr({
        'transform': 'translate(' + width/2 + ', ' + 120 + ')'
    })

var path = vis_group.selectAll('path')
	.data(pie(dataset.lower))
	.enter().append('path')
	.attr({
		'class': function (d, i) {
			if(i == 0){
				return conversionClass(count)
			} else {
				return 'transparent'
			}
		},
		'd': arc
	})
	.each(function (d) {
		this._current = d;
	});

vis_group.append('text')
	.attr({
		'text-anchor': 'middle',
		'dy': '.3em',
		'class': 'count'
	})
	.text(count)

vis_group.append('text')
	.attr({
		'text-anchor': 'middle',
		'dy': '3em',
		'class': 'conditions'
	})
	.text(conversionText(count))

var progress = 0;

var timeout = setTimeout(function () {
	clearTimeout(timeout);
	path = path.data(pie(dataset.upper));
	path.transition().duration(duration).attrTween('d', function (a) {
		var i = d3.interpolate(this._current, a);
		var i2 = d3.interpolate(progress, conditionsPercent[conversionClass(count)])
		this._current = i(0);
		return function (t) {
			return arc(i(t));
		};
	});
}, 200);

function calcPercent(percent) {
	return [percent, 100 - percent];
};