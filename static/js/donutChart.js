'use strict';
(function () {

    let data = [];

    d3.json('/load_data', (d) => {

        return d;
    }).then((d) => {

        data = d['users'];

        createVis();
    }).catch((err) => {

        console.error(err);
    });

    function createVis() {

        const svg = d3.select("#donutChart");

        const width =+ svg.attr('height');
        const height =+ svg.attr('width');
        const radius = Math.min(width, height) / 2.5;
        const thickness = 50;

        var g = svg.append('g')
            .attr('transform', 'translate(' + (width/2) + ', ' + (height/2) + ')');

        const langMap = data.map(function (d) {
            return d.prog_lang;
            });

        var languages = d3.nest()
           .key(function(d) {return d.prog_lang;})
           .rollup(function(v) {return v.length;})
           .entries(data);

        var prog_choices = []
        for(var i = 0; i < languages.length; i++){
            prog_choices.push(languages[i])
        }

        var color = d3.scaleOrdinal()
            .domain(prog_choices)
            .range(['#1b7688','#1b7676','#f9d057','#f29e2e','#9b0a0a', '#d7191c'])

        var arc = d3.arc()
            .innerRadius(radius - thickness - 7)
            .outerRadius(radius);

        var arc_hover = d3.arc()
            .innerRadius(radius - thickness - 7)
            .outerRadius(radius);

        var pie = d3.pie()
            .value(function(d) {return d.value;})
            .sort(null);

        var path = g.selectAll('path')
                .data(pie(prog_choices))
                .enter()
                .append("g")
                .on("mouseover", function(d) {

                    let g = d3.select(this)
                    .style("cursor", "pointer")
                    .attr('d', arc_hover)
                    .append("g")
                    .attr("class", "text-group");

                    g.append("text")
                    .attr("class", "name-text")
                    .text(`${d.data.key}`)
                    .attr('text-anchor', 'middle')
                    .attr('dy', '-1.2em');

                    g.append("text")
                    .attr("class", "value-text")
                    .text(`${d.data.value}`)
                    .attr('text-anchor', 'middle')
                    .attr('dy', '.6em');
                })
                .on("mouseout", function(d) {
                    d3.select(this)
                    .style("cursor", "none")
                    .attr('d', arc)
                    .select(".text-group").remove();
                })
                .append('path')
                .attr('d', arc)
                .attr('fill', (d, i) => color(i))
                .on("mouseover", function(d) {

                d3.select(this)
                    .style("cursor", "pointer")
                    .attr('d', arc_hover)
                })
                .on("mouseout", function(d) {
                    createVisBarChart(data);
                    createVisScatter(data);
                d3.select(this)
                    .style("cursor", "none")
                    .attr('d', arc)
                })
                .each(function(d, i) {this._current = i;})
}})();