import * as d3 from 'd3'
import cloud from 'd3-cloud'

const createWordcloud = data => {

  var node = document.createElement('div')
  var fill = d3.scale.category20();

  var size = [1000, 1000]

  var nodeDom = d3.select(node).append("svg")
    .attr("width", size[0])
    .attr("height", size[1])
  .append("g")
    .attr("transform", "translate(" + size[0] / 2 + "," + size[1] / 2 + ")")

  updateWords()
  // nodeDom.on("mount", function(){
  //  updateWords()
  // });

  function updateWords(words) {
    var layout = cloud()
        .size(size)
        .words(data)
        .padding(5)
        //.rotate(function() { return ~~(Math.random() * 2) * 90; })
        .rotate(0)
        .font("Impact")
        .fontSize(function(d) { return d.size * 10; })
        .on("end", draw);
    layout.start();

    function draw(words) {
      nodeDom.selectAll("text")
        .data(words)
      .enter().append("text")
        .style("font-size", function(d) { return d.size + "px"; })
        .style("font-family", "Impact")
        .style("fill", function(d, i) { return fill(i); })
        .attr("text-anchor", "middle")
        .attr("transform", function(d) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function(d) { return d.text; });
    }
  }

  return node;
}

export default createWordcloud
