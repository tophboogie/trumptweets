import {observable, action, useStrict, computed, toJS} from 'mobx'
// useStrict(true)
import {get, post} from 'axios'
import Moment from 'moment'
import {extendMoment} from 'moment-range'
const moment = extendMoment(Moment)

class WordcloudStore {
  @action init = () => this.getDateRange(this.startDate, this.endDate)
  @computed get loading () { return this.requesting || this.waitingForCloud }

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

  // LAYOUT --------------------------------------------------------------------
  @observable waitingForCloud = true
  @action cloudFinished = () => this.waitingForCloud = false

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
  @computed get filteredWordsObjArray () {
    const wordObjsForCloud = []
    this.wordsByDate.keys().forEach((date) => {
      if (moment(date) >= moment(this.startDate) && moment(date) <= moment(this.endDate)) {
        const wordObjs = this.wordsByDate.get(date)
        wordObjs.forEach((wordObj) => {
          const index = wordObjsForCloud.findIndex((w) => w.text === wordObj.text)
          if (index > -1) {
            wordObjsForCloud[index].size += wordObj.size
          } else {
            wordObjsForCloud.push(wordObj)
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
  @observable error = null
  @action requestWords = () => {
    this.error = null
    this.requesting = true
  }
  @observable hasBeenReceivedOnce = false
  @action getWordsSuccess = (words) => {
    words.forEach(({wordMapDate, wordMapObj}) => {
      this.wordsByDate.set(moment(wordMapDate).startOf('day').format(), wordMapObj)
    })
    this.requesting = false
  }
  @action getWordsFailure = (err) => {
    this.requesting = false
    this.error = err || 'something happened..'
  }
  getDateRange = (start, end) => {
    const range = moment.range(start, end)
    let serverStart = start
    let serverEnd = end
    let shouldGet = false
    console.log('the others')
    for (let day of range.by('day')) {
      if (this.wordsByDate.has(day.format())) {
        serverStart = moment(serverStart).add(1, 'day')
      } else {
        shouldGet = true
        break
      }
    }
    if (shouldGet) {
      this.requestWords()
      const url = 'http://localhost:3030/words/' +
                  moment(serverStart).format('MM-DD-YYYY') +
                  '/to/' +
                  moment(serverEnd).format('MM-DD-YYYY')
      get(url)
        .then((resp) => this.getWordsSuccess(resp.data))
        .catch((err) => this.getWordsFailure())
    }
  }
}

const wordcloudStore = new WordcloudStore()
export default wordcloudStore
