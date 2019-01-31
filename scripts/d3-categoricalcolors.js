function colores_google(n) {
	var colores_g = ['#3366cc', '#dc3912', '#ff9900', '#109618', '#990099', '#0099c6', '#dd4477', '#66aa00', '#b82e2e', '#316395', '#994499', '#22aa99', '#aaaa11', '#6633cc', '#e67300', '#8b0707', '#651067', '#329262', '#5574a6', '#3b3eac'];
	return colores_g[n % colores_g.length];
}

var c10 = d3.scale.category10();
var c20 = d3.scale.category20();
var c20b = d3.scale.category20b();
var c20c = d3.scale.category20c();

var svg1 = d3.select('#c10')
	.append('svg')
	.attr({
		'width': 400,
		'height': 50
	})

var svg1b = d3.select('#g10c')
	.append('svg')
	.attr({
		'width': 400,
		'height': 50
	})

var svg2 = d3.select('#c20')
	.append('svg')
	.attr({
		'width': 400,
		'height': 20
	})

var svg3 = d3.select('#c20b')
	.append('svg')
	.attr({
		'width': 400,
		'height': 20
	})

svg1.selectAll('circle')
	.data( d3.range(10) )
		.enter().append('circle')
	.attr({
		'r': 18,
		'cx': d3.scale.linear().domain([-1, 10]).range([0, 400]),
		'cy': 25,
		'fill': c10
	})

var svg4 = d3.select('#c20c')
	.append('svg')
	.attr({
		'width': 400,
		'height': 20
	})

var svg5 = d3.select('#g20c')
	.append('svg')
	.attr({
		'width': 400,
		'height': 20
	})

svg1b.selectAll('circle')
    .data( d3.range(10) )
    	.enter().append('circle')
    .attr({
		'r': 18,
		'cx': d3.scale.linear().domain([-1, 10]).range([0, 400]),
		'cy': 25,
		'fill': function(d,i) { return colores_google(i); }
	})

svg2.selectAll('circle')
    .data( d3.range(20) )
    	.enter().append('circle')
    .attr({
		'r': 9,
		'cx': d3.scale.linear().domain([-1, 20]).range([0, 400]),
		'cy': 10,
		'fill': c20
	})

svg3.selectAll('circle')
    .data( d3.range(20) )
    	.enter().append('circle')
    .attr({
		'r': 9,
		'cx': d3.scale.linear().domain([-1, 20]).range([0, 400]),
		'cy': 10,
		'fill': c20b
	})

svg4.selectAll('circle')
	.data( d3.range(20) )
		.enter().append('circle')
	.attr({
		'r': 9,
		'cx': d3.scale.linear().domain([-1, 20]).range([0, 400]),
		'cy': 10,
		'fill': c20c
	})

svg5.selectAll('circle')
	.data( d3.range(20) )
		.enter().append('circle')
	.attr({
		'r': 9,
		'cx': d3.scale.linear().domain([-1, 20]).range([0, 400]),
		'cy': 10,
		'fill': function(d,i) { return colores_google(i); }
	})