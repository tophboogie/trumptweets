import React, {Component} from 'react'
import * as d3 from 'd3'
import cloud from 'd3-cloud'
const fill = d3.scaleOrdinal(d3.schemeCategory20)

class Wordcloud extends Component {
  componentDidMount () {
    this._runTheThing(this.props)
  }
  componentWillReceiveProps (nextProps) {
    // this._runTheThing(nextProps)
  }
  shouldComponentUpdate () {
    return false
  }
  render () {
    return <div className='fullscreen' ref='canvas' />
  }
  _runTheThing = ({words, width, height}) => {
    const draw = (words) => {
      const n = d3.select(this.refs.canvas)
                  .html('')
                  .append('svg')
                  .attr('width', width)
                  .attr('height', height)
                  .append('g')
                  .attr('transform', 'translate(' + width/2 + ',' + height/2 + ')')
                  .selectAll('text')
                  .data(words)

      n.enter().append('text')
        .attr('text-anchor', 'middle')
        .style('font-family', 'Impact')
        .merge(n)
        .transition()
        .attr('transform', (word) => 'translate(' + [word.x, word.y] + ')rotate(' + word.rotate + ')')
        .style('font-size', (word) => word.size + 'px')
        .style('fill', (word, i) => fill(i))
        .text((word) => word.text)
      n.exit().remove()
    }
    const layout = cloud()
      .timeInterval(10)
      .padding(5)
      .rotate(() => ~~(Math.random() * 2) * 90)
      .font('Impact').fontSize((d) => d.size * 40)
      .words(words)
      .size([width, height])
      .on('end', draw)
    layout.start()
  }
}

export default Wordcloud
