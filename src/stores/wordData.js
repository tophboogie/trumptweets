import {extendObservable, observable, action, useStrict, computed} from 'mobx'
useStrict(true)
import {get} from 'axios'
import Moment from 'moment'
import {extendMoment} from 'moment-range'
const moment = extendMoment(Moment)

const BASE_URL = '/api/words/'

class WordDataStore {
  constructor(who) {
    this.getUrl = () => who !== 'trump' ? BASE_URL + who + '/' : BASE_URL
    extendObservable(this, {
      wordsByDate: observable.shallowMap(),
      requesting: false,
      receivedOnce: false,
      isLoading: computed(() => this.requesting),
      error: null,
      requestWords: action(() => {
        this.error = null
        this.requesting = true
      }),
      getWordsSuccess: action((words) => {
        this.receivedOnce = true
        words.forEach(({wordMapDate, wordMapObj: wordObjArray}) => { // <-- we should rename this variable in the collection
          this.wordsByDate.set(moment(wordMapDate).startOf('day').format(), wordObjArray)
        })
        this.requesting = false
      }),
      getWordsFailure: action((err) => {
        this.requesting = false
        this.error = err || 'something happened..'
      })
    })
  }
  getWords = (start, end) => {
    const {serverStart, serverEnd, hasAll} = this.getUncachedRange(start, end)
    return new Promise((resolve, reject) => {
      if (hasAll) {
        resolve(this.getFilteredWordsObjsByDate(start, end))
      } else {
        this.requestWords()
        const url = this.getUrl() + moment(serverStart).format('MM-DD-YYYY') + '/to/' + moment(serverEnd).format('MM-DD-YYYY')
        get(url)
          .then((resp) => {
            this.getWordsSuccess(resp.data)
            resolve(this.getFilteredWordsObjsByDate(start, end))
          })
          .catch((err) => {
            this.getWordsFailure()
            reject(err)
          })
      }
    })
  }
  getFilteredWordsObjsByDate = (start, end) => {
    const wordObjsByDate = []
    this.wordsByDate.forEach((wordObjs, date) => {
      if (moment(date) >= moment(start) && moment(date) <= moment(end)) {
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
    return wordObjsByDate.sort((a, b) => b.size - a.size)
  }
  getUncachedRange = (start, end) => {
    // this needs some work, but it is working (growing from the startDate)
    // could be optimized in the case that we have some dates working backwards
    // from the endDate
    const range = moment.range(start, end)
    let serverStart = moment(start).startOf('day')
    let serverEnd = moment(end).startOf('day')
    for (let day of range.by('day')) {
      if (this.wordsByDate.has(moment(day).startOf('day').format())) {
        serverStart = moment(serverStart).add(1, 'day')
      } else {
        break
      }
    }
    return {
      serverStart,
      serverEnd,
      hasAll: moment(serverStart).format() > moment(serverEnd).format() ||
              moment(serverStart).format() === moment().startOf('day').format()
    }
  }
}

export default WordDataStore
