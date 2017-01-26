import {observable, action, asMap, useStrict} from 'mobx'
// useStrict(true)
import {get, post} from 'axios'
import moment from 'moment'
import * as d3 from 'd3'
import cloud from 'd3-cloud'

import getWordArray from '../lib/getWordArray'

const tweetStore = observable({
  tweets: [],
  hasBeenFetched: false,
  getTweetsSuccess: action((tweets) => {
    tweetStore.tweets.replace(tweets)
    tweetStore.hasBeenFetched = true
    updateWordcloud()
  }),
  getTweetsFailure: action(() => tweetStore.error = 'something happened..'),
  startDate: moment().startOf('day').subtract(30, 'days'),
  endDate: moment().startOf('day'),
  dateRangeFocusedInput: null,
  onDateRangeFocusChange: action((newFocus) => tweetStore.dateRangeFocusedInput = newFocus),
  onDatesChange: action(({startDate, endDate}) => {
    tweetStore.startDate = startDate
    tweetStore.endDate = endDate
    if (startDate && endDate && moment(startDate).format() <= moment(endDate).format()) {
      tweetStore.getDateRange()
    }
  }),
  wordcloudWidth: window.innerWidth,
  wordcloudHeight: window.innerHeight,
  resizeWordcloud: action(() => {
    tweetStore.wordcloudWidth = window.innerWidth
    tweetStore.wordcloudHeight = window.innerHeight
    tweetStore.wordcloudNode = createWordcloudNode()
    updateWordcloud()
  }),
  wordcloudNode: null,
  initWordcloud: action(() => tweetStore.wordcloudNode = createWordcloudNode())
})

// d3 functions
const createWordcloudNode = () => {
  document.getElementById('dataview').innerHTML = ''
  return d3.select('#dataview').append('svg')
              .attr('width', '100%')
              .attr('height', '100%')
              .append('g')
              .attr('transform', 'translate(' + tweetStore.wordcloudWidth / 2 + ',' + tweetStore.wordcloudHeight / 2 + ')')
}

const updateWordcloud = () => {
  const words = getWordArray(tweetStore.tweets.slice())
  const fill = d3.scaleOrdinal(d3.schemeCategory20)
  const layout = cloud()
    .size([tweetStore.wordcloudWidth, tweetStore.wordcloudHeight])
    .words(words)
    .padding(5)
    .rotate(function() { return ~~(Math.random() * 2) * 90; })
    //.rotate(0)
    .font('Impact')
    .fontSize(function(d) { return d.size * 10; })
    .on('end', draw)
  layout.start()

  function draw(words) {
    let n = tweetStore.wordcloudNode.selectAll('text').data(words)

    n.enter().append('text')
      .attr('text-anchor', 'middle')
      .style('font-family', 'Impact')
      .merge(n)
      .transition()
      .attr('transform', function(word) {
        return 'translate(' + [word.x, word.y] + ')rotate(' + word.rotate + ')';
      })
      .style('font-size', function(word) {
          return word.size + 'px'
      })
      .style('fill', function(word, i) { return fill(i); })
      .text(function(word) { return word.text; })

    n.exit().remove()
  }
}

tweetStore.getDateRange = () => {
  get('http://localhost:3030/tweets/' + moment(tweetStore.startDate).format('M-D-YYYY') + '/to/' + moment(tweetStore.endDate).format('M-D-YYYY'))
    .then((resp) => tweetStore.getTweetsSuccess(resp.data))
    .catch((err) => tweetStore.getTweetsFailure())
}

export default tweetStore
