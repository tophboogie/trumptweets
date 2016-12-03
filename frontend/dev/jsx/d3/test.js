import * as d3 from 'd3'
import cloud from 'd3-cloud'

var node = document.createElement('div')

var width = 960,
    height = 500;

var svg = d3.select(node).append("svg")
    .attr("width", width)
    .attr("height", height);

var g = svg.append("g");

 g.append("circle")
    .attr("cx", 350)
    .attr("cy", 200)
    .attr("r", 180)
    .style("fill", function(){return "red"});

g.append("circle")
    .attr("cx", 550)
    .attr("cy", 200)
    .attr("r", 180);

 module.exports = node
