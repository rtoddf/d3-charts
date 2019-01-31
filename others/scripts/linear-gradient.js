var container_parent = $('.display'),
	chart_container = $('#periodic_table'),
	margins = {top: 20, right: 0, bottom: 20, left: 0},
	width = container_parent.width() - margins.left - margins.right,
	height = (width*.7) - margins.top - margins.bottom,
	vis, vis_group, aspect

vis = d3.select('#periodic_table').append('svg')
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

var defaults = {
	'non_metal': [
		{
			'stop': 0,
			'color': '#dcf1fd'
		},
		{
			'stop': .5,
			'color': '#45b2e5'
		},
		{
			'stop': 1,
			'color': '#66bcea'
		}
	],
	'alkali_metal': [
		{
			'stop': 0,
			'color': '#fbd3d4'
		},
		{
			'stop': .5,
			'color': '#ed2325'
		},
		{
			'stop': 1,
			'color': '#f04f3b'
		}
	],
    'alkaline_earth': [
        {
            'stop': 0,
            'color': '#ffdebf'
        },
        {
            'stop': .5,
            'color': '#f68822'
        },
        {
            'stop': 1,
            'color': '#f78f2c'
        }
    ],
    'noble_gas': [
        {
            'stop': 0,
            'color': '#d1bbda'
        },
        {
            'stop': .5,
            'color': '#6a53a3'
        },
        {
            'stop': 1,
            'color': '#6d54a3'
        }
    ],
    'halogen': [
        {
            'stop': 0,
            'color': '#dadff1'
        },
        {
            'stop': .5,
            'color': '#8887c1'
        },
        {
            'stop': 1,
            'color': '#8684c0'
        }
    ],
    'semimetal': [
        {
            'stop': 0,
            'color': '#c2e7e7'
        },
        {
            'stop': .5,
            'color': '#70c9c2'
        },
        {
            'stop': 1,
            'color': '#72cac2'
        }
    ],
    'actinide': [
        {
            'stop': 0,
            'color': '#9ccf77'
        },
        {
            'stop': .5,
            'color': '#49b848'
        },
        {
            'stop': 1,
            'color': '#4bb849'
        }
    ],
    'transition_metal': [
        {
            'stop': 0,
            'color': '#fcfad0'
        },
        {
            'stop': .5,
            'color': '#f9ea17'
        },
        {
            'stop': 1,
            'color': '#faed36'
        }
    ],
    'basic_metal': [
        {
            'stop': 0,
            'color': '#9ccf77'
        },
        {
            'stop': .5,
            'color': '#49b848'
        },
        {
            'stop': 1,
            'color': '#4bb849'
        }
    ],
    'lanthanide': [
        {
            'stop': 0,
            'color': '#e6f0c4'
        },
        {
            'stop': .5,
            'color': '#a2cd3a'
        },
        {
            'stop': 1,
            'color': '#b8d65f'
        }
    ]
}

var defs = vis_group.append('defs')

defs.append('linearGradient')
	.attr({
		'id': 'non_metal',
		'xlink:href': '#non_metal',
		'x1': 0,
		'y1': 0,
		'x2': 1,
		'y2': 1,
		'x3': 2,
		'y3': 2
	})
	.selectAll('stop')
		.data(defaults.non_metal)
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

defs.append('linearGradient')
	.attr({
		'id': 'alkali_metal',
		'xlink:href': '#alkali_metal',
		'x1': 0,
		'y1': 0,
		'x2': 1,
		'y2': 1,
		'x3': 2,
		'y3': 2
	})
	.selectAll('stop')
		.data(defaults.alkali_metal)
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

defs.append('linearGradient')
    .attr({
        'id': 'alkaline_earth',
        'xlink:href': '#alkaline_earth',
        'x1': 0,
        'y1': 0,
        'x2': 1,
        'y2': 1,
        'x3': 2,
        'y3': 2
    })
    .selectAll('stop')
        .data(defaults.alkaline_earth)
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

defs.append('linearGradient')
    .attr({
        'id': 'noble_gas',
        'xlink:href': '#noble_gas',
        'x1': 0,
        'y1': 0,
        'x2': 1,
        'y2': 1,
        'x3': 2,
        'y3': 2
    })
    .selectAll('stop')
        .data(defaults.noble_gas)
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

defs.append('linearGradient')
    .attr({
        'id': 'halogen',
        'xlink:href': '#halogen',
        'x1': 0,
        'y1': 0,
        'x2': 1,
        'y2': 1,
        'x3': 2,
        'y3': 2
    })
    .selectAll('stop')
        .data(defaults.halogen)
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

defs.append('linearGradient')
    .attr({
        'id': 'semimetal',
        'xlink:href': '#semimetal',
        'x1': 0,
        'y1': 0,
        'x2': 1,
        'y2': 1,
        'x3': 2,
        'y3': 2
    })
    .selectAll('stop')
        .data(defaults.semimetal)
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

defs.append('linearGradient')
    .attr({
        'id': 'actinide',
        'xlink:href': '#actinide',
        'x1': 0,
        'y1': 0,
        'x2': 1,
        'y2': 1,
        'x3': 2,
        'y3': 2
    })
    .selectAll('stop')
        .data(defaults.actinide)
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

defs.append('linearGradient')
    .attr({
        'id': 'transition_metal',
        'xlink:href': '#transition_metal',
        'x1': 0,
        'y1': 0,
        'x2': 1,
        'y2': 1,
        'x3': 2,
        'y3': 2
    })
    .selectAll('stop')
        .data(defaults.transition_metal)
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

defs.append('linearGradient')
    .attr({
        'id': 'basic_metal',
        'xlink:href': '#basic_metal',
        'x1': 0,
        'y1': 0,
        'x2': 1,
        'y2': 1,
        'x3': 2,
        'y3': 2
    })
    .selectAll('stop')
        .data(defaults.basic_metal)
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

defs.append('linearGradient')
    .attr({
        'id': 'lanthanide',
        'xlink:href': '#lanthanide',
        'x1': 0,
        'y1': 0,
        'x2': 1,
        'y2': 1,
        'x3': 2,
        'y3': 2
    })
    .selectAll('stop')
        .data(defaults.lanthanide)
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