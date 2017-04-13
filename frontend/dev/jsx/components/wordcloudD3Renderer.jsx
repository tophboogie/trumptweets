import React, {Component} from 'react'
import * as d3 from 'd3'
const fill = d3.scaleOrdinal(d3.schemeCategory20)

export default class WordcloudD3Renderer extends Component {
  componentDidMount () {
    this._draw(this.props.words)
  }
  componentWillUnmount () {
    const node = this._getNode()
    console.log('cleaning' + this.props.what)
    node.html('')
  }
  render () {
    console.log('rendering ' + this.props.what)
    const {width, height} = this.props
    return (
      <div className='fullscreen'>
        <svg width='100%' height='100%'>
          <g transform={'translate(' + width/2 + ',' + height/2 + ')'} ref='canvas' />
        </svg>
      </div>
    )
  }
  _draw = (words) => {
    const node = this._getNode()
    node.selectAll('text')
        .data(words)
        .enter()
        .append('text')
        .attr('text-anchor', 'middle')
        .style('font-family', 'Impact')
        .merge(node)
        .transition()
        .attr('transform', (word) => 'translate(' + [word.x, word.y] + ')rotate(' + word.rotate + ')')
        .style('font-size', (word) => word.size + 'px')
        .style('fill', (word, i) => fill(i))
        .text((word) => word.text)
    node.exit().remove()
  }
  _getNode = () => d3.select(this.refs.canvas)
}
