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

    var margin = {top: 20, right: 0, bottom: 50, left: 80},
            svg_dx = 450,
            svg_dy = 300,
            plot_dx = svg_dx - margin.right - margin.left,
            plot_dy = svg_dy - margin.top - margin.bottom;

    var x = d3.scaleLinear().range([margin.left, plot_dx]),
        y = d3.scaleLinear().range([plot_dy, margin.top]);

    var svg = d3.select("#scatter")
                .append("svg")
                .attr("width", svg_dx)
                .attr("height", svg_dy);

    var d_extent_x = d3.extent(data, data => +data.experience_yr),
        d_extent_y = d3.extent(data, data => +data.hw1_hrs);
    x.domain(d_extent_x);
    y.domain(d_extent_y);

    var axis_x = d3.axisBottom(x)
                   .ticks(8),
        axis_y = d3.axisLeft(y)
                   .ticks(8);

    svg.append("g")
       .attr("id", "axis_x")
       .attr("transform", "translate(0," + (plot_dy + margin.bottom / 2) + ")")
       .call(axis_x);

    svg.append("g")
       .attr("id", "axis_y")
       .attr("transform", "translate(" + (margin.left / 2) + ", 0)")
       .call(axis_y);

    d3.select("#axis_x")
      .append("text")
      .attr("transform", "translate(315, -10)")
      .text("Programming experience");

    d3.select("#axis_y")
      .append("text")
      .attr("transform", "rotate(-90) translate(-20, 15)")
      .text("Hours spent on HW1");

    var circles = svg.append("g")
         .selectAll("circle")
         .data(data)
         .enter()
         .append("circle")
         .attr("r", 5)
         .attr("cx", (data) => x(+data.experience_yr))
         .attr("cy", (data) => y(+data.hw1_hrs))
         .attr("class", "non_brushed");

    function populateTableRow(d_row) {
        d3.select("table").style("visibility", "visible");
        var d_row_filter = [d_row.experience_yr,d_row.hw1_hrs];
        d3.select("table")
          .append("tr")
          .attr("class", "row_data")
          .selectAll("td")
          .data(d_row_filter)
          .enter()
          .append("td")
          .attr("align", (d, i) => i == 0 ? "left" : "right")
          .text(data => data);
    }
}})();