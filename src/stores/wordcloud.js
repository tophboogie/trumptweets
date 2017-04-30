import {observable, extendObservable, action, useStrict, computed, autorun} from 'mobx'
useStrict(true)
import moment from 'moment'
import cloud from 'd3-cloud'

import WordDataStore from './wordData'

const INITIAL_DAYS_BACK = 10
const WORD_ARRAY_MAX_LENGTH = 200
const FONT_SIZE_CRAZY = 150
const FONT_SIZE_ROOMY = 120
const FONT_SIZE_NORMAL = 85
const FONT_SIZE_COMPACT = 50
const SCREEN_SIZE_BREAKPOINT_1 = 475
const SCREEN_SIZE_BREAKPOINT_2 = 950
const SCREEN_SIZE_BREAKPOINT_3 = 1425

const loadingWordObjs = [{text: 'loading...', size: 1}]
const invalidWordObjs = [{text: `invalid`, size: 3}, {text: '⛔️ select a valid range', size: 1}]
const errorWordObjs = [{text: `oops...`, size: 3}, {text: '⛔️ an error occurred', size: 1}]
const emptyWordObjs = [{text: `no data`, size: 3}, {text: '🦄 try another date range', size: 1}]

class WordcloudStore {
  constructor() {
    extendObservable(this, {
      // INITALIZE -------------------------------------------------------------
      init: action('init store', ({history, person, start, end}) => {
        this.history = history
        this.setActivePerson(person || 'trump')
        this.startDate = moment(start, 'YYYY-MM-DD').isValid()
          ? moment(start, 'YYYY-MM-DD')
          : moment().startOf('day').subtract(INITIAL_DAYS_BACK, 'days')
        this.endDate = moment(end, 'YYYY-MM-DD').isValid()
          ? moment(end, 'YYYY-MM-DD')
          : moment().startOf('day')

        autorun(() => {
          if (this.dateRangeValid) {
            this.startWordcloud({
              activePerson: this.activePerson,
              start: this.startDate,
              end: this.endDate,
              width: this.width,
              height: this.height
            })
          }
        })
        autorun(() => this.syncHistory({
          person: this.activePerson,
          start: moment(this.startDate).format('YYYY-MM-DD'),
          end: moment(this.endDate).format('YYYY-MM-DD'),
          dateRangeValid: this.dateRangeValid
        }))
        autorun(() => {
          if (!this.dateRangeValid) {
            this.createMessageCloud({
              wordObjs: invalidWordObjs,
              width: this.width,
              height: this.height
            })
          }
        })
      }),

      // SYNC HISTORY ----------------------------------------------------------
      pathName: null,
      syncHistory: action('sync browser history', ({person, start, end, dateRangeValid}) => {
        // first, update state if need be
        if (this.activePerson !== person) { this.setActivePerson(person) }
        if (moment(this.startDate).format('YYYY-MM-DD') !== start) {
          this.startDate = moment(start, 'YYYY-MM-DD').isValid()
            ? moment(start, 'YYYY-MM-DD')
            : null
        }
        if (moment(this.endDate).format('YYYY-MM-DD') !== end) {
          this.endDate = moment(start, 'YYYY-MM-DD').isValid()
            ? moment(end, 'YYYY-MM-DD')
            : null
        }
        // then, we can figure out if we need to push to the history
        const url = '/' + this.activePerson +
                    '/' + moment(this.startDate).format('YYYY-MM-DD') +
                    '/to/' + moment(this.endDate).format('YYYY-MM-DD')
        if (this.pathName === null && this.history.location.pathname !== url && dateRangeValid) {
          this.pathName = url
          this.history.replace(url)
        } else if (this.pathName !== url && this.history.location.pathname !== url && dateRangeValid) {
          this.pathName = url
          this.history.push(url)
        }
      }),

      // PEOPLE STUFF ----------------------------------------------------------
      activePerson: null,
      setActivePerson: action('set active person', (person) => {
        if (!this.people.has(person)) { this.addPerson(person) }
        this.activePerson = person
      }),
      people: observable.shallowMap(),
      addPerson: action('add person', (person) => {
        this.people.set(person, new WordDataStore(person))
      }),

      // LOADING --------------------------------------------------------------
      showLoading: false,
      loadingD3CloudWords: observable.ref([]),
      createLoadingCloud: action('start loading', ({width, height}) => {
        this.showWordcloud = false
        this.showMessage = false
        this.showLoading = false
        this.asyncCloudGen({
          wordObjs: loadingWordObjs,
          width,
          height,
          onEnd: this.setLoadingD3CloudWords,
        })
      }),
      setLoadingD3CloudWords: action('set loading words', (d3LoadingWords) => {
        this.showLoading = true
        this.loadingD3CloudWords = d3LoadingWords.slice()
      }),

      // MESSAGES --------------------------------------------------------------
      showMessage: false,
      messageD3CloudWords: observable.ref([]),
      createMessageCloud: action('start messages', ({wordObjs, width, height}) => {
        this.showWordcloud = false
        this.showMessage = false
        this.asyncCloudGen({
          wordObjs,
          width,
          height,
          onEnd: this.setMessageD3CloudWords,
        })
      }),
      setMessageD3CloudWords: action('set messages words', (d3MessageWords) => {
        this.showMessage = true
        this.showLoading = false // <-- this trumps the loading cloud
        this.messageD3CloudWords = d3MessageWords.slice()
      }),

      // LAYOUT ----------------------------------------------------------------
      showWordcloud: false,
      d3CloudWords: observable.ref([]),
      startWordcloud: action('(autorun) wordcloud', ({activePerson, start, end, width, height}) => {
        console.log('starting')
        this.dateRangeFocusedInput = null // <-- clear the date picker dropdown
        this.createLoadingCloud({width, height})
        const person = this.people.get(activePerson)
        person && person.getWords(start, end)
          .then((wordObjs) => this.createWordcloud({wordObjs, width, height}))
          .catch((err) => this.createMessageCloud({wordObjs: errorWordObjs, width, height}))
      }),
      createWordcloud: action('start wordcloud', ({wordObjs, width, height}) => {
        const wordcloudWordObjs = wordObjs.slice(0, WORD_ARRAY_MAX_LENGTH)
        wordcloudWordObjs.forEach((word) => word.tooltip = word.size === 1 ? '1 use' : word.size + ' uses')
        this.showWordcloud = false
        if (wordcloudWordObjs.length > 0) {
          this.asyncCloudGen({
            wordObjs: wordcloudWordObjs,
            onEnd: this.setD3CloudWords,
            width: this.width,
            height: this.height
          })
        } else {
          this.createMessageCloud({wordObjs: emptyWordObjs, width, height})
        }
      }),
      setD3CloudWords: action('set wordcloud', (d3Words) => {
        this.showMessage = false
        this.showLoading = false
        this.showWordcloud = true
        this.d3CloudWords = d3Words.slice()
      }),

      // DATES -----------------------------------------------------------------
      startDate: null,
      onStartDateChange: action('change start date', (date) => {
        this.startDate = date
      }),
      startDateFocused: false,
      onStartDateFocusChange: action('start date focus', ({focused}) => {
        this.startDateFocused = focused
      }),
      endDate: null,
      onEndDateChange: action('change end date', (date) => {
        this.endDate = date
      }),
      endDateFocused: false,
      onEndDateFocusChange: action('end date focus', ({focused}) => {
        this.endDateFocused = focused
      }),
      datesValid: computed(() => {
        return moment(this.startDate).isValid() && moment(this.endDate).isValid()
      }),
      dateRangeValid: computed(() => {
        return this.datesValid &&
          moment(this.startDate).format('YYYY-MM-DD') < moment(this.endDate).format('YYYY-MM-DD')
      }),

      // SIZING --------------------------------------------------------------------
      // we need a way to delay the drawing because the onResize events are frequent
      delay: null,
      delayedResize: action('delayed resize', () => {
        this.setWordcloudSize()
        this.delay = null
      }),
      resizeWordcloud: action('throttle resize', () => {
        this.delay && clearTimeout(this.delay)
        this.delay = setTimeout(this.delayedResize, 500)
      }),
      width: window.innerWidth,
      height: window.innerHeight,
      setWordcloudSize: action('set wordcloud size', () => {
        this.width = window.innerWidth
        this.height = window.innerHeight
      }),
      fontSize: computed(() => {
        if (this.width > SCREEN_SIZE_BREAKPOINT_3) { return FONT_SIZE_CRAZY }
        else if (this.width > SCREEN_SIZE_BREAKPOINT_2) { return FONT_SIZE_ROOMY }
        else if (this.width > SCREEN_SIZE_BREAKPOINT_1) { return FONT_SIZE_NORMAL }
        else { return FONT_SIZE_COMPACT }
      }),
      minFontSize: computed(() => {
        const minFontSize = this.fontSize / 10
        return minFontSize < 10 ? 10 : minFontSize
      })
    }) // end observables
  }

  // GENERATE WORDCLOUD OBJECTS ------------------------------------------------
  asyncCloudGen = ({wordObjs, width, height, onEnd}) => {
    const normalizeFontSize = wordObjs.length && Number.isInteger(wordObjs[0].size)
      ? this.fontSize / wordObjs[0].size : this.fontSize
    cloud().words(wordObjs)
           .timeInterval(10)
           .padding(5)
           .rotate(() => ~~(Math.random() * 2) * 90)
           .font('Impact').fontSize((wordObj) => {
             const normalized = wordObj.size * normalizeFontSize
             return normalized > this.minFontSize ? Math.ceil(normalized) : this.minFontSize
           })
           .size([width, height])
           .on('end', onEnd)
           .start()
  }
}

const wordcloudStoreSingleton = new WordcloudStore()
export default wordcloudStoreSingleton
