import {observable, action, useStrict, computed, autorun} from 'mobx'
useStrict(true)
import {get, post} from 'axios'
import Moment from 'moment'
import {extendMoment} from 'moment-range'
const moment = extendMoment(Moment)
import cloud from 'd3-cloud'

const BASE_URL = 'http://localhost:3030/words/'

class WordcloudStore {
  @action init = () => {
    this.getDateRange(this.startDate, this.endDate)
    autorun(() => this.startWordLayout(this.filteredWordsObjArray))
  }

  // LOADING CRAZY -------------------------------------------------------------
  @computed get showLoading () { return this.isLoading && !this.error }
  @observable.ref loadingD3CloudWords = []
  @observable isLoading = false
  @action startLoading = () => {
    cloud().words([{text: 'loading...', size: 80}])
           .timeInterval(10)
           .padding(5)
           .rotate(() => ~~(Math.random() * 2) * 90)
           .font('Impact').fontSize((worbObj) => worbObj.size)
           .size([this.width, this.height])
           .on('end', this.setLoadingD3CloudWords)
           .start()
  }
  @action setLoadingD3CloudWords = (wordForD3) => {
    this.isLoading = true
    this.loadingD3CloudWords = wordForD3
  }

  // LAYOUT --------------------------------------------------------------------
  @computed get showWords () { return this.receivedOnce && !this.waitingForCloud && !this.requesting && !this.error}
  @observable.ref d3CloudWords = []
  @observable waitingForCloud = true
  @observable autorunFirstPass = false // <-- this is used because autorun runs once to start the observables
  @action startWordLayout = (wordObjs) => {
    if (this.autorunFirstPass) {
      this.waitingForCloud = true
      this.startLoading()
      const screenSizeNormalize = this.width > 1200 ? 100 : 50
      const normalizedFontSize = wordObjs.length && Number.isInteger(wordObjs[0].size)
        ? Math.ceil(screenSizeNormalize / wordObjs[0].size) : 80
      cloud().words(wordObjs)
             .timeInterval(10)
             .padding(5)
             .rotate(() => ~~(Math.random() * 2) * 90)
             .font('Impact').fontSize((wordObj) => Math.ceil(wordObj.size * normalizedFontSize))
             .size([this.width, this.height])
             .on('end', this.setD3CloudWords)
             .start()
    } else {
      this.autorunFirstPass = true // <-- autorun first pass
    }
  }
  @action setD3CloudWords = (d3Words) => {
    this.isLoading = false
    this.waitingForCloud = false
    this.d3CloudWords = d3Words
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
    }, 500)
  }
  @observable width = window.innerWidth
  @observable height = window.innerHeight
  @action setWordcloudSize = () => {
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.startWordLayout(this.filteredWordsObjArray)
  }

  // FILTERING -----------------------------------------------------------------
  @observable filterStartDate = this.startDate
  @observable filterEndDate = this.endDate
  @action setFilterDates = (start, end) => {
    this.filterStartDate = start
    this.filterEndDate = end
  }
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
    // This needs to be limited a bit because the cloud takes forever if the
    // array is too large - we can think about this more later perhaps
    return wordObjsForCloud.length > 0
      ? wordObjsForCloud.slice(0, 200) : [{text: 'Nothing here...', size: 80}]
  }

  // DATA/CACHING --------------------------------------------------------------
  @observable wordsByDate = observable.shallowMap()
  @action getDateRange = (start, end) => {
    // this needs some work, but it is working (growing from the startDate)
    // could be optimized in the case that we have some dates working backwards
    // from the endDate
    const range = moment.range(start, end)
    let serverStart = start
    let serverEnd = end
    for (let day of range.by('day')) {
      if (this.wordsByDate.has(day.format())) {
        if (serverStart.format() === serverEnd.format()) {
          this.setFilterDates(start, end)
          break
        } else {
          serverStart = moment(serverStart).add(1, 'day')
        }
      } else {
        this.getWords(serverStart, serverEnd)
        break
      }
    }

  }

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
    this.setFilterDates(this.startDate, this.endDate)
  }
  @action getWordsFailure = (err) => {
    this.requesting = false
    this.error = err || 'something happened..'
  }
  getWords = (start, end) => {
    this.requestWords()
    const url = BASE_URL + moment(start).format('MM-DD-YYYY') + '/to/' + moment(end).format('MM-DD-YYYY')
    get(url).then((resp) => this.getWordsSuccess(resp.data))
            .catch((err) => this.getWordsFailure())
  }
}

const wordcloudStore = new WordcloudStore()
export default wordcloudStore
