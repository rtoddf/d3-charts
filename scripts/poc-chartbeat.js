// http://chartbeat.pbworks.com/w/page/15588429/toppages
// http://pages.chartbeat.com/support/implementation/api_docs.pdf


var container_parent = $('.display') ,
    chart_container = $('#chart'),
    margins = {top: 0, right: 0, bottom: 0, left: 0},
    width = container_parent.width() - margins.left - margins.right,
    height = (width) - margins.top - margins.bottom,
    color = d3.scale.category20c(),
    vis, vis_group, aspect

var prefix = 'http://api.chartbeat.com/live/toppages/v3/'
var options = '&limit=10&sortby=engaged_time'
var key = 'cfa46a3950a4f0cda65b530b5cf05bf5'

var news965_url = prefix + '?host=news965.com' + options + '&apikey=' + key
var wsbradio_url = prefix + '?host=wsbradio.com' + options + '&apikey=' + key
var wokv_url = prefix + '?host=wokv.com' + options + '&apikey=' + key
var krmg_url = prefix + '?host=krmg.com' + options + '&apikey=' + key
var whio_url = prefix + '?host=whio.com' + options + '&apikey=' + key

var data = []

var x = d3.scale.linear()
    .range([ 0, width ])

var y = d3.scale.ordinal()
    .rangeRoundBands([ 0, height], .1)

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

getData()

function getData(){
    queue()
        .defer(d3.json, news965_url)
        .defer(d3.json, wsbradio_url)
        .defer(d3.json, wokv_url)
        .defer(d3.json, krmg_url)
        .defer(d3.json, whio_url)
        .await(ready);
}

function ready(error, news965, wsbradio, wokv, krmg, whio) {
    console.log('whio: ', whio)

    news965.pages.forEach(function(d){
        d.site = 'news965'
        data.push(d)
    })

    wsbradio.pages.forEach(function(d){
        d.site = 'wsbradio'
        data.push(d)
    })

    wokv.pages.forEach(function(d){
        d.site = 'wokv'
        data.push(d)
    })

    krmg.pages.forEach(function(d){
        d.site = 'krmg'
        data.push(d)
    })

    whio.pages.forEach(function(d){
        d.site = 'whio'
        data.push(d)
    })

    y.domain(data.sort(function(a, b) {
        return d3.descending(a.stats.visits, b.stats.visits);
    })
    .map(function(d, i) {
        return d.site + d.path;
    }))

    chartIt(data)
}

function checkDomain(d){
    // console.log('d: ', d.indexOf('wsbradio') >= 0)

    var sites = ['news965', 'wsbradio', 'krmg', 'wokv', 'whio']

    var found = $.inArray(d, sites) > -1;

    // console.log('found: ', found)

    $.each(sites, function( i, site ) {

        // console.log('is there: ', d.indexOf(site) >= 0)

        // if (domain.indexOf(site) >= 0){
        //     return true
        // } else {
        //     return false
        // }

    });
}

function chartIt(data){
    var header = vis_group.append('g')
        .attr({
            'class': 'legend'
        })

    header.append('rect')
        .attr({
            'class': 'header',
            'height': 20,
            'width': width
        })

    header.append('text')
        .attr({
            'x': 10,
            'y': y.rangeBand() / 2,
            'dy': '.35em',
            'fill': 'white'
        })
        .text('Visits')

    header.append('text')
        .attr({
            'text-anchor': 'end',
            'x': width - 30,
            'y': y.rangeBand() / 2,
            'dy': '.35em',
            'fill': 'white'
        })
        .text('Avg Engaged Time (s)')

    header.append('text')
        .attr({
            'x': 50,
            'y': y.rangeBand() / 2,
            'dy': '.35em',
            'fill': 'white'
        })
        .text('Page')

    var bar = vis_group.selectAll('.bar')
            .data(data)
        .enter().append('g')
            .attr({
                'class': 'bar',
                'transform': function(d, i) {
                    return 'translate(0,' + y(d.site + d.path) + ')';
                }
            })

    bar.append('rect')
        .attr({
            'class': function(d){
                return d.site
            },
            'height': y.rangeBand(),
            'width': width
            // 'fill': function(d, i){
            //     console.log('color: ', color(i))
            //     return 'red'
            //     // return color(d.data.name)
            // }
        })

    bar.append('text')
        .attr({
            'x': 10,
            'y': y.rangeBand() / 2,
            'dy': '.35em',
            'fill': 'white'
        })
        .text(function(d){
            return d.stats.visits
        })

    bar.append('a')
        .attr('xlink:href', function(d){

            var isDomainPresent = checkDomain(d.path)
            // console.log('isDomainPresent: ', isDomainPresent)
            // console.log('link: ', 'http://' + d.site + '.com' + d.path)

            if(isDomainPresent){
                return 'http://www.' + d.path
            } else {
                return 'http://' + d.site + '.com' + d.path
            }

            
        })
        .append('text')
            .attr({
                'x': 50,
                'y': y.rangeBand() / 2,
                'dy': '.35em',
                'fill': 'white'
            })
            .text(function(d){
                return d.title
            })

    bar.append('text')
        .attr({
            'text-anchor': 'end',
            'x': width - 30,
            'y': y.rangeBand() / 2,
            'dy': '.35em',
            'fill': 'white'
        })
        .text(function(d){
            return d.stats.engaged_time.avg
        })
    

    $('button').on('click', function(){
        var sort = $(this).data('sort')
        d3.select(this)
            .property('sort', sort)
            .each(change)
    })

    function change() {
        if(this.sort == 'desc'){
            var y0 = y.domain(data.sort(function(a, b) {
                return d3.descending(a.stats.visits, b.stats.visits);
            })
            .map(function(d) {
                return d.site + d.path;
            }))
            .copy()
        } else if(this.sort == 'asc'){
            var y0 = y.domain(data.sort(function(a, b) {
                return d3.ascending(a.stats.visits, b.stats.visits);
            })
            .map(function(d) {
                return d.site + d.path;
            }))
            .copy()
        } else if(this.sort == 'alpha_asc'){
            var y0 = y.domain(data.sort(function(a, b) {
                return d3.ascending(a.site, b.site);
            })
            .map(function(d) {
                return d.site + d.path;
            }))
            .copy()
        } else if(this.sort == 'alpha_desc'){
            var y0 = y.domain(data.sort(function(a, b) {
                return d3.descending(a.site, b.site);
            })
            .map(function(d) {
                return d.site + d.path;
            }))
            .copy()
        } else if(this.sort == 'time_asc'){
            var y0 = y.domain(data.sort(function(a, b) {
                return d3.ascending(a.stats.engaged_time.avg, b.stats.engaged_time.avg);
            })
            .map(function(d) {
                return d.site + d.path;
            }))
            .copy()
        } else if(this.sort == 'time_desc'){
            var y0 = y.domain(data.sort(function(a, b) {
                return d3.descending(a.stats.engaged_time.avg, b.stats.engaged_time.avg);
            })
            .map(function(d) {
                return d.site + d.path;
            }))
            .copy()
        }

        var transition = vis_group
            .transition()
            .duration(750),
            delay = function(d, i) {
                return i * 30;
            };

        transition.selectAll('.bar')
            .delay(delay)
            .ease('cubic')
            .attr({
                'transform': function(d, i) {
                    return 'translate(0,' + y(d.site + d.path) + ')';
                }
            })
    }

}

$(window).on('resize', function() {
    console.log('change')
    var targetWidth = container_parent.width()
    vis.attr({
        'width': targetWidth,
        'height': Math.round(targetWidth / aspect)
    })
})
