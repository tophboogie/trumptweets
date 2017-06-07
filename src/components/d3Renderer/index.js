import React, {Component} from 'react'
import PropTypes from 'prop-types'
import * as d3 from 'd3'
const fill = d3.scaleOrdinal(['#1B326E','#20C3FF','#F6FFEB','#ED563C','#AD1211'])

import './styles.css'

export default class D3Renderer extends Component {
  static propTypes = {
    tooltip: PropTypes.bool,
    width: PropTypes.number,
    height: PropTypes.number,
    words: PropTypes.array
  }
  componentDidMount() {
    this._draw(this.props.words)
  }
  render() {
    const {width, height} = this.props
    return (
      <div className='d3__fullscreen'>
        <div className='d3__tooltip' ref='tooltip' />
        <svg width='100%' height='100%'>
          <g ref='canvas' transform={'translate(' + width/2 + ',' + height/2 + ')'} />
        </svg>
      </div>
    )
  }
  _draw = (words) => {
    const node = d3.select(this.refs.canvas)
    node.selectAll('text')
        .data(words)
        .enter()
        .append('text')
        .attr('text-anchor', 'middle')
        .style('font-family', 'Reenie Beanie')
        .style('cursor', 'help')
        .on('mouseover', (word) => this._drawTooltip(word))
        .on('mousemove', this._moveTooltip)
        .on('mouseout', this._removeTooltip)
        .merge(node)
        .transition()
        .attr('transform', (word) => 'translate(' + [word.x, word.y] + ')rotate(' + word.rotate + ')')
        .style('font-size', (word) => word.size + 'px')
        .style('fill', (word, i) => fill(i))
        .text((word) => word.text)
    node.exit().remove()
  }
  _drawTooltip = (word) => {
    const {tooltip} = this.props
    d3.select(this.refs.tooltip).style('visibility', tooltip ? 'visible' : 'hidden')
                                .style('cursor', 'help')
                                .text(word.tooltip)
  }
  _moveTooltip = () => {
    d3.select(this.refs.tooltip).style('top', d3.event.pageY - 15 + 'px')
                                .style('left', d3.event.pageX + 25 + 'px')
  }
  _removeTooltip = () => {
    d3.select(this.refs.tooltip).style('visibility', 'hidden')
  }
}
