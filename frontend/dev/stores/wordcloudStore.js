import {observable, action, useStrict, computed, toJS, autorun} from 'mobx'
// useStrict(true)
import {get, post} from 'axios'
import Moment from 'moment'
import {extendMoment} from 'moment-range'
const moment = extendMoment(Moment)
import cloud from 'd3-cloud'
// this.layout = cloud().words(props.words)
//                      .timeInterval(10)
//                      .padding(5)
//                      .rotate(() => ~~(Math.random() * 2) * 90)
//                      .font('Impact').fontSize((d) => d.size * 40)
//                      .size([props.width, props.height])
//                      .on('end', this._draw)
// this.layout.start()

class WordcloudStore {
  @action init = () => {
    this.getDateRange(this.startDate, this.endDate)
    autorun(() => {
      this.startWordLayout(this.filteredWordsObjArray, this.width, this.height)
    })
  }

  // LOADING CRAZY -------------------------------------------------------------
  @observable showLoading = false
  @observable loadingD3CloudWords = null
  @action startLoading = () => {
    this.showLoading = false
    cloud().words([{text: 'loading...', size: 80}])
           .timeInterval(10)
           .padding(5)
           .rotate(() => ~~(Math.random() * 2) * 90)
           .font('Impact').fontSize((d) => d.size)
           .size([this.width, this.height])
           .on('end', this.setLoadingD3CloudWords)
           .start()
  }
  @action setLoadingD3CloudWords = (words) => {
    this.showLoading = true
    this.loadingD3CloudWords = words
  }

  // LAYOUT --------------------------------------------------------------------
  @computed get showWords () { return this.receivedOnce && !this.waitingForCloud && !this.requesting }
  @observable d3CloudWords = null
  @observable waitingForCloud = true
  @action startWordLayout = (words, width, height) => {
    this.waitingForCloud = true
    this.startLoading()
    cloud().words(words)
           .timeInterval(10)
           .padding(5)
           .rotate(() => ~~(Math.random() * 2) * 90)
           .font('Impact').fontSize((d) => d.size * 20)
           .size([width, height])
           .on('end', this.setD3CloudWords)
           .start()
  }
  @action setD3CloudWords = (words) => {
    this.showLoading = false
    this.waitingForCloud = false
    this.d3CloudWords = words
  }

  // DATES ---------------------------------------------------------------------
  @observable startDate = moment().startOf('day').subtract(4, 'days')
  @observable endDate = moment().startOf('day')
  @observable dateRangeFocusedInput = null
  @action onDateRangeFocusChange = (newFocus) => this.dateRangeFocusedInput = newFocus
  @action onDatesChange = ({startDate, endDate}) => {
    this.startDate = moment(startDate).startOf('day')
    this.endDate = moment(endDate).startOf('day')
    if (this.dateRangeFocusedInput === null) {
       this.getDateRange(this.startDate, this.endDate)
    }
  }

  // SIZING --------------------------------------------------------------------
  // we need a way to delay the drawing because the onResize events are frequent
  delay = null
  @action resizeWordcloud = () => {
    this.delay && clearTimeout(this.delay)
    this.delay = setTimeout(() => {
      this.setWordcloudSize()
      this.delay = null
    }, 1000)
  }
  @observable width = window.innerWidth
  @observable height = window.innerHeight
  @action setWordcloudSize = () => {
    this.width = window.innerWidth
    this.height = window.innerHeight
  }

  // PARSING/FILTERING ---------------------------------------------------------
  @observable filterStartDate = this.startDate
  @observable filterEndDate = this.endDate
  @computed get filteredWordsObjArray () {
    const wordObjsForCloud = []
    this.wordsByDate.keys().forEach((date) => {
      if (moment(date) >= moment(this.filterStartDate) && moment(date) <= moment(this.filterEndDate)) {
        const wordObjs = this.wordsByDate.get(date)
        wordObjs.forEach((wordObj) => {
          const index = wordObjsForCloud.findIndex((w) => w.text === wordObj.text)
          if (index > -1) {
            wordObjsForCloud[index].size += wordObj.size
          } else {
            wordObjsForCloud.push(Object.assign({}, wordObj))
          }
        })
      }
    })
    wordObjsForCloud.sort((a, b) => b.size - a.size)
    return wordObjsForCloud.slice(0, 200)
  }

  // DATA ----------------------------------------------------------------------
  @observable wordsByDate = observable.shallowMap()

  // SERVER --------------------------------------------------------------------
  @observable requesting = false
  @observable receivedOnce = false
  @observable error = null
  @action requestWords = () => {
    this.error = null
    this.requesting = true
  }
  @action getWordsSuccess = (words) => {
    this.receivedOnce = true
    words.forEach(({wordMapDate, wordMapObj}) => {
      this.wordsByDate.set(moment(wordMapDate).startOf('day').format(), wordMapObj)
    })
    this.requesting = false
  }
  @action getWordsFailure = (err) => {
    this.requesting = false
    this.error = err || 'something happened..'
  }
  @action getDateRange = (start, end) => {
    const range = moment.range(start, end)
    this.filterStartDate = start
    this.filterEndDate = end
    let serverStart = start
    let serverEnd = end
    for (let day of range.by('day')) {
      if (this.wordsByDate.has(day.format())) {
        serverStart = moment(serverStart).add(1, 'day')
      } else {
        this.getWords(serverStart, serverEnd)
        break
      }
    }
  }
  getWords = (start, end) => {
    this.requestWords()
    const url = 'http://localhost:3030/words/' +
                moment(start).format('MM-DD-YYYY') +
                '/to/' +
                moment(end).format('MM-DD-YYYY')
    get(url)
      .then((resp) => this.getWordsSuccess(resp.data))
      .catch((err) => this.getWordsFailure())
  }
}

const wordcloudStore = new WordcloudStore()
export default wordcloudStore
