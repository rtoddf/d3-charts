// http://www.webelements.com/

var defaults = {
	box: {
		width: 60,
		height: 60,
		stroke: '#fff'
	},
	symbol: {
		fill: '#000',
		anchor: 'middle'
	}
}

aspect = chart_container.width() / chart_container.height()

d3.json('data/periodic_table.json', function(error, data){
	var elements = data.elements

	var box = vis_group.selectAll('g')
		.data(elements)
			.enter().append('g')
		.attr({
			'transform': function(d){
				return 'translate(' + defaults.box.width * d.position[0] + ', ' + defaults.box.height * d.position[1] + ')'
			}
		})

	var rect = box.append('rect')	
		.attr({
			'class': 'box',
			'width': defaults.box.width,
			'height': defaults.box.height,
			'fill': function(d){
				// console.log(d.classification)
				var fill_color = 'url(#' + d.classification + ')'
				return fill_color
			},
			'stroke': defaults.box.stroke,
			// 'transform': function(d){
			// 	return 'translate(' + defaults.box.width * d.position[0] + ', ' + defaults.box.height * d.position[1] + ')'
			// }
		})
		.on('mouseover', function(d){
			// console.log(getCentroid(d3.select(this)))
			d3.select(this)
				// .moveToFront()	
				.transition()
					.duration(200)
					.attr({
						'transform': 'translate(-5, -5)',
						'width': defaults.box.width + 10,
						'height': defaults.box.height + 10
					})
				.style({
					'cursor': 'pointer'
				})

			d3.select(this.nextElementSibling)
				// .moveToFront()
                .transition()
                    .duration(200)
                    .attr({
                    	'font-size': '32px',
                        'transform': 'translate(0, 10)',
                        'fill': 'white'
                    })

            d3.select(this.nextElementSibling.nextElementSibling)
				// .moveToFront()
                .transition()
                    .duration(200)
                    .attr({
                    	'opacity': 0
                    })
		})
		.on('mouseout', function(d){
			d3.select(this)
				.transition()
					.duration(200)
					.attr({
						'transform': 'translate(0, 0)',
						'width': defaults.box.width,
						'height': defaults.box.height
					})

			d3.select(this.nextElementSibling)
                .transition()
                    .duration(200)
                    .attr({
                        'transform': 'translate(0, 0)',
                        'fill': 'black',
						'font-size': '14px'
                    })

            d3.select(this.nextElementSibling.nextElementSibling)
				// .moveToFront()
                .transition()
                    .duration(200)
                    .attr({
                    	'opacity': 1
                    })
		})

	var symbol = box.append('text')
		.attr({
			'class': 'symbol',
			'x': function(d){
				return defaults.box.width / 2
			},
			'y': function(d){
				return defaults.box.height / 2 - 10
			},
			'text-anchor': defaults.symbol.anchor,
			'fill': 'black'
		})
		.text(function(d){
			return d.symbol
		})

	var number = box.append('text')
		.attr({
			'class': 'symbol',
			'x': function(d){
				return 8
			},
			'y': function(d){
				return 10
			},
			'text-anchor': defaults.symbol.anchor,
			'fill': 'black',
			'font-size': '9px',
			'opacity': function(d){
				console.log(d)
			}
		})
		.text(function(d){
			return d.atomic_number
		})

	var name = box.append('text')
		.attr({
			'class': 'symbol',
			'x': function(d){
				return defaults.box.width / 2
			},
			'y': function(d){
				return defaults.box.height / 2 + 5
			},
			'text-anchor': defaults.symbol.anchor,
			'fill': 'black',
			'font-size': '10px'
		})
		.text(function(d){
			return d.name
		})

	var weight = box.append('text')
		.attr({
			'class': 'symbol',
			'x': function(d){
				return defaults.box.width / 2
			},
			'y': function(d){
				return defaults.box.height / 2 + 20
			},
			'text-anchor': defaults.symbol.anchor,
			'fill': 'black',
			'font-size': '10px'
		})
		.text(function(d){
			return d.atomic_weight
		})

})

d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};


function getCentroid(selection) {
	// get the DOM element from a D3 selection
	// you could also use "this" inside .each()
	var element = selection.node(),
		// use the native SVG interface to get the bounding box
		bbox = element.getBBox();
	// return the center of the bounding box
	return [bbox.x + bbox.width/2, bbox.y + bbox.height/2];
}
