import * as d3 from 'd3'
import cloud from 'd3-cloud'
const fill = d3.scaleOrdinal(d3.schemeCategory20)

const createWordcloudNode = (width, height) => {
  console.log('create node')
  document.getElementById('dataview').innerHTML = ''
  const wtf = d3.select('#dataview')
           .append('svg')
           .attr('width', width)
           .attr('height', height)
           .append('g')
           .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')
  console.log(wtf)
  return wtf
}

export const drawWordCloud = (wordsObjArray, width, height) => {
  const node = createWordcloudNode(width, height)
  const layout = cloud()
    .size([width, height])
    .words(wordsObjArray)
    .padding(5)
    .rotate(function() { return ~~(Math.random() * 2) * 90; })
    .font('Impact')
    .fontSize(function(d) { return d.size * 10; })
    .on('end', (words) => {
      let n = node.selectAll('text').data(words)
      n.enter().append('text')
        .attr('text-anchor', 'middle')
        .style('font-family', 'Impact')
        .merge(n)
        .transition()
        .attr('transform', function(word) {
          return 'translate(' + [word.x, word.y] + ')rotate(' + word.rotate + ')';
        })
        .style('font-size', (word) => word.size + 'px')
        .style('fill', function(word, i) { return fill(i); })
        .text(function(word) { return word.text; })
      n.exit().remove()
    })
  layout.start()
}
