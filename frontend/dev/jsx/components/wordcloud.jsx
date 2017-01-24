import React from 'react'

import * as d3 from 'd3'
import cloud from 'd3-cloud'

var nodeDom

class Wordcloud extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      size: [1000, 1000], // <-- get from window maybe? window.innerWidth
      nodeDom: null
    }
  }
  componentDidMount() {
    nodeDom = d3.select("#dataview").append("svg")
                .attr("width", this.state.size[0])
                .attr("height", this.state.size[1])
                .append("g")
                .attr("transform", "translate(" + this.state.size[0] / 2 + "," + this.state.size[1] / 2 + ")")
  }
  componentDidUpdate () {
    const {words} = this.props
    console.log(words.length)
    if (words.length > 0){ this.updateWordcloud(words) }
  }
  updateWordcloud(words) {
    var fill = d3.scaleOrdinal(d3.schemeCategory20)
    var layout = cloud()
      .size(this.state.size)
      .words(words)
      .padding(5)
      .rotate(function() { return ~~(Math.random() * 2) * 90; })
      //.rotate(0)
      .font("Impact")
      .fontSize(function(d) { return d.size * 10; })
      .on("end", draw)
    layout.start()

    function draw(words) {
      var n = nodeDom.selectAll("text").data(words)

      n.enter().append("text")
        .attr("text-anchor", "middle")
        .style("font-family", "Impact")
        .merge(n)
        .transition()
        .attr("transform", function(word) {
          return "translate(" + [word.x, word.y] + ")rotate(" + word.rotate + ")";
        })
        .style("font-size", function(word) {
            return word.size + "px"
        })
        .style("fill", function(word, i) { return fill(i); })
          .text(function(word) { return word.text; })

      n.exit().remove()
    }
  }
  render() {
    return (
      <div id='dataview'></div>
    )
  }
}

export default Wordcloud
