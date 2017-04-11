import {extendObservable, action, computed, useStrict, toJS} from 'mobx'
// useStrict(true)
import moment from 'moment'
import {get, post} from 'axios'

import {drawWordCloud} from '../lib/draw'

export default class WordStore {
  constructor() {
    extendObservable(this, {
      init: action(() => {
        // set has dates here
        this.getDateRange(this.startDate, this.endDate)
      }),
      hasDates: [],
      startDate: moment().startOf('day').subtract(30, 'days'),
      endDate: moment().startOf('day'),
      dateRangeFocusedInput: null,
      onDateRangeFocusChange: action((newFocus) => {
        this.dateRangeFocusedInput = newFocus
      }),
      onDatesChange: action(({startDate, endDate}) => {
        this.startDate = startDate
        this.endDate = endDate
        if (startDate && endDate && moment(startDate).format() <= moment(endDate).format()) {
          this.getDateRange(startDate, endDate)
        }
      }),
      wordsObjArray: computed(() => {
        if (this.words.length) {
          return toJS(this.words[0].wordMapObj)
        } else {
          return []
        }
      }),
      wordcloudWidth: window.innerWidth,
      wordcloudHeight: window.innerHeight,
      resizeWordcloud: action(() => {
        this.wordcloudWidth = window.innerWidth
        this.wordcloudHeight = window.innerHeight
        this.updateWordcloud()
      }),
      words: [],
      requesting: false,
      error: null,
      requestWords: action(() => {
        this.error = null
        this.requesting = true
      }),
      getWordsSuccess: action((words) => {
        this.requesting = false
        this.words.replace(words)
        this.hasBeenReceivedOnce = true
        this.updateWordcloud()
      }),
      getWordsFailure: action((err) => {
        this.requesting = false
        this.error = err || 'something happened..'
      }),
      getDateRange: (start, end) => {
        const serverStart = moment(start).format('MM-DD-YYYY')
        const serverEnd = moment(end).format('MM-DD-YYYY')
        this.requestWords()
        get('http://localhost:3030/words/' + serverStart + '/to/' + serverEnd)
          .then((resp) => this.getWordsSuccess(resp.data))
          .catch((err) => this.getWordsFailure())
      },
      updateWordcloud: () => {
        drawWordCloud(this.wordsObjArray, this.wordcloudWidth, this.wordcloudHeight)
      }
    })
  }
}
