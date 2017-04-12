import {observable, action, useStrict, toJS} from 'mobx'
// useStrict(true)
import moment from 'moment'
import {get, post} from 'axios'

class WordStore {
  @action init = () => this.getDateRange(this.startDate, this.endDate)
  @observable startDate = moment().startOf('day').subtract(4, 'days')
  @observable endDate = moment().startOf('day')
  @observable dateRangeFocusedInput = null
  @action onDateRangeFocusChange = (newFocus) => {
    this.dateRangeFocusedInput = newFocus
  }
  @action onDatesChange = ({startDate, endDate}) => {
    this.startDate = startDate
    this.endDate = endDate
    if (this.dateRangeFocusedInput === null) {
      // selected a matching date range
      this.setWordsObjArray()
    }
  }
  @observable wordcloudWidth = window.innerWidth
  @observable wordcloudHeight = window.innerHeight
  @action setWordcloudSize = () => {
    this.wordcloudWidth = window.innerWidth
    this.wordcloudHeight = window.innerHeight
  }
  @observable words = observable.shallowArray([])
  @observable wordsObjArray = observable.shallowArray([])
  @action setWordsObjArray = () => {
    console.log('setting wordsObjArray words')
    const wordObjsForCloud = []
    const timePeriodWords = this.words.slice().filter((word) => {
      return moment(word.wordMapDate) >= moment(this.startDate) &&
             moment(word.wordMapDate) <= moment(this.endDate)
    })
    timePeriodWords.forEach((day) => {
      day.wordMapObj.forEach((wordMapObj) => {
        const index = wordObjsForCloud.findIndex((w) => w.text === wordMapObj.text)
        if (index > -1) {
          wordObjsForCloud[index].size += wordMapObj.size
        } else {
          wordObjsForCloud.push(wordMapObj)
        }
      })
    })
    wordObjsForCloud.sort((a, b) => b.size - a.size)
    this.wordsObjArray.replace(wordObjsForCloud.slice(0, 200))
  }
  @observable requesting = false
  @observable error = null
  @action requestWords = () => {
    this.error = null
    this.requesting = true
  }
  @action getWordsSuccess = (words) => {
    words.forEach(({wordMapDate}) => this.hasDates.indexOf(wordMapDate) < 0 && this.hasDates.push(wordMapDate))
    this.requesting = false
    this.words.replace(words)
    this.hasBeenReceivedOnce = true
    this.setWordsObjArray()
  }
  @observable hasDates = observable.shallowArray([])
  @action getWordsFailure = (err) => {
    this.requesting = false
    this.error = err || 'something happened..'
  }
  getDateRange = (start, end) => {
    const serverStart = moment(start).format('MM-DD-YYYY')
    const serverEnd = moment(end).format('MM-DD-YYYY')
    this.requestWords()
    get('http://localhost:3030/words/' + serverStart + '/to/' + serverEnd)
      .then((resp) => this.getWordsSuccess(resp.data))
      .catch((err) => this.getWordsFailure())
  }

  // we need a way to delay the drawing because the onResize events are frequent
  delay = null
  @action resizeWordcloud = () => {
    this.delay && clearTimeout(this.delay)
    this.delay = setTimeout(() => {
      this.setWordcloudSize()
      this.delay = null
    }, 1000)
  }
}

const wordStore = new WordStore()
export default wordStore
