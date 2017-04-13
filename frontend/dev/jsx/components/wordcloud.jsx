import React, {Component} from 'react'
import * as d3 from 'd3'
import cloud from 'd3-cloud'
const fill = d3.scaleOrdinal(d3.schemeCategory20)

class Wordcloud extends Component {
  constructor (props) {
    super(props)
    this.layout = cloud().words(props.words)
                         .timeInterval(10)
                         .padding(5)
                         .rotate(() => ~~(Math.random() * 2) * 90)
                         .font('Impact').fontSize((d) => d.size * 40)
                         .size([props.width, props.height])
                         .on('end', this._draw)
    this.layout.start()
  }
  // componentDidMount () {
  //   this._runTheThing(this.props)
  // }
  componentWillReceiveProps (nextProps) {
    // this.layout.stop()
  }
  shouldComponentUpdate () {
    return false
  }
  render () {
    console.log('rendering')
    const {width, height} = this.props
    return (
      <div className='fullscreen'>
        <svg width='100%' height='100%'>
          <g transform={'translate(' + width/2 + ',' + height/2 + ')'} ref='canvas'>

          </g>
        </svg>
      </div>
    )
  }
  _draw = (words) => {
    const node = this._getNode()
    console.log(node)
    node.data(words)
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
  _getNode = () => d3.select(this.refs.canvas).selectAll('text')
}

export default Wordcloud
