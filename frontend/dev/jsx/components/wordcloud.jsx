import React, {Component} from 'react'
import cloud from 'd3-cloud'
import * as d3 from 'd3'
const fill = d3.scaleOrdinal(d3.schemeCategory20)
var layout

class Wordcloud extends Component {
  componentDidMount () {
    const {width, height} = this.props
    layout = this._createLayout()
    layout.words([{size:1, text:'loading...'}]).size([width, height])
    layout.start()
  }
  componentWillReceiveProps (nextProps) {
    const {words, width, height} = nextProps
    layout.stop()
    layout.words(words.slice()).size([width, height])
    layout.start()
  }
  render () {
    const {width, height, words} = this.props
    if (words.length) {  }
    return (
      <div className='fullscreen'>
        <svg width={width} height={height}>
          <g ref='g' transform={'translate(' + width / 2 + ',' + height / 2 + ')'} />
        </svg>
      </div>
    )
  }
  _createLayout = () => {
    return cloud()
      .timeInterval(10)
      .padding(5)
      .rotate(() => ~~(Math.random() * 2) * 90)
      .font('Impact')
      .fontSize((d) => d.size * 40)
      .on('end', this._draw)
      .on('word', this._progress)
  }
  _draw = (words) => {
    const n = d3.select(this.refs.g).html('').selectAll('text').data(words)
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
  // _progress = () => {
  //   // console.log(prog++)
  // }
}

export default Wordcloud
