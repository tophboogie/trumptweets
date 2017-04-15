import {observable, action, useStrict, computed, autorun} from 'mobx'
useStrict(true)
import {get, post} from 'axios'
import Moment from 'moment'
import {extendMoment} from 'moment-range'
const moment = extendMoment(Moment)
import cloud from 'd3-cloud'

const BASE_URL = 'http://0.0.0.0:3030/words/'
const INITIAL_DAYS_BACK = 4
const WORD_ARRAY_MAX_LENGTH = 200
const BASE_FONT_SIZE = 100
const BASE_FONT_SIZE_SMALLER = 70
const SCREEN_SIZE_FONT_BREAKPOINT = 1200
const SCREEN_SIZE_CALENDAR_BREAKPOINT_1 = 475
const SCREEN_SIZE_CALENDAR_BREAKPOINT_2 = 950
const SCREEN_SIZE_CALENDAR_BREAKPOINT_3 = 1425


class WordcloudStore {
  @action init = () => {
    this.getDateRange(this.startDate, this.endDate)
    autorun(() => this.startWordLayout(this.filteredWordsObjArray))
  }

  // GENERATE WORDCLOUD OBJECTS ------------------------------------------------
  asyncCloudGen = (wordObjs, onEnd) => {
    const fontSize = this.width > SCREEN_SIZE_FONT_BREAKPOINT
      ? BASE_FONT_SIZE : BASE_FONT_SIZE_SMALLER
    const normalizedFontSize = wordObjs.length && Number.isInteger(wordObjs[0].size)
      ? Math.ceil(fontSize / wordObjs[0].size) : fontSize
    console.log(normalizedFontSize)
    cloud().words(wordObjs)
           .timeInterval(10)
           .padding(5)
           .rotate(() => ~~(Math.random() * 2) * 90)
           .font('Impact').fontSize((wordObj) => Math.ceil(wordObj.size * normalizedFontSize))
           .size([this.width, this.height])
           .on('end', onEnd)
           .start()
  }

  // LOADING CRAZY -------------------------------------------------------------
  @computed get showLoading () { return this.isLoading }
  @observable.ref loadingD3CloudWords = []
  @observable isLoading = false
  @action startLoading = () => {
    const loadingWordObjs = [{text: 'loading...', size: 1}]
    this.asyncCloudGen(loadingWordObjs, this.setLoadingD3CloudWords)
  }
  @action setLoadingD3CloudWords = (wordForD3) => {
    this.isLoading = true
    this.loadingD3CloudWords = wordForD3
  }

  // LAYOUT --------------------------------------------------------------------
  @computed get showWords () { return (this.receivedOnce || this.hasError) && !this.waitingForCloud && !this.requesting }
  @observable.ref d3CloudWords = []
  @observable waitingForCloud = true
  @observable autorunFirstPass = false // <-- this is used because autorun runs once to start the observables
  @action startWordLayout = (wordObjs) => {
    this.dateRangeFocusedInput = null // <-- clear the date picker
    if (this.autorunFirstPass) {
      this.waitingForCloud = true
      this.startLoading()
      this.asyncCloudGen(wordObjs, this.setD3CloudWords)
    } else {
      this.autorunFirstPass = true // <-- autorun first pass
    }
  }
  @action setD3CloudWords = (d3Words) => {
    this.isLoading = false
    this.waitingForCloud = false
    this.d3CloudWords = d3Words.slice()
  }

  // DATES ---------------------------------------------------------------------
  @computed get orientation () { return 'horizontal' }
  @computed get numberOfMonths () {
    if (this.width > SCREEN_SIZE_CALENDAR_BREAKPOINT_3) { return 4 }
    else if (this.width > SCREEN_SIZE_CALENDAR_BREAKPOINT_2) { return 3 }
    else if (this.width > SCREEN_SIZE_CALENDAR_BREAKPOINT_1) { return 2 }
    else { return 1 }
  }
  @observable startDate = moment().startOf('day').subtract(INITIAL_DAYS_BACK, 'days')
  @observable endDate = moment().startOf('day')
  @observable dateRangeFocusedInput = null
  @action onDateRangeFocusChange = (newFocus) => this.dateRangeFocusedInput = newFocus
  @action onDatesChange = ({startDate, endDate}) => {
    if (startDate) { this.startDate = startDate }
    if (endDate) { this.endDate = endDate }
  }
  @action onDateRangeClose = () => this.getDateRange(this.startDate, this.endDate)

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
    this.filterStartDate = moment(start).startOf('day')
    this.filterEndDate = moment(end).startOf('day')
  }
  @computed get filteredWordsObjArray () {
    if (this.hasError) {
      return [{text: `⛔️ oops...`, size: 4}, {text: 'an error occurred', size: 1}]
    }

    const wordObjsForCloud = this.getWordsObjsByDate(this.wordsByDate, this.filterStartDate, this.filterEndDate)
    if (wordObjsForCloud.length > 0) {
      // This needs to be limited a bit because the cloud takes forever if the
      // array is too large - we can think about this more later perhaps
      return wordObjsForCloud.slice(0, WORD_ARRAY_MAX_LENGTH)
    } else {
      return [{text: ` 🦄 no data`, size: 4}, {text: 'try another date range', size: 1}]
    }
  }
  getWordsObjsByDate = (wordsByDate, start, end) => {
    const wordObjsByDate = []
    wordsByDate.keys().forEach((date) => {
      if (moment(date) >= moment(start) && moment(date) <= moment(end)) {
        const wordObjs = this.wordsByDate.get(date)
        wordObjs.forEach((wordObj) => {
          const index = wordObjsByDate.findIndex((w) => w.text === wordObj.text)
          if (index > -1) {
            wordObjsByDate[index].size += wordObj.size
          } else {
            wordObjsByDate.push(Object.assign({}, wordObj))
          }
        })
      }
    })
    return wordObjsByDate.sort((a, b) => b.size - a.size).slice()
  }
  // DATA/CACHING --------------------------------------------------------------
  @observable wordsByDate = observable.shallowMap()
  @action getDateRange = (start, end) => {
    // this needs some work, but it is working (growing from the startDate)
    // could be optimized in the case that we have some dates working backwards
    // from the endDate
    const range = moment.range(start, end)
    let serverStart = moment(start).startOf('day')
    let serverEnd = moment(end).startOf('day')
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
  @computed get hasError () { return !!this.error }
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