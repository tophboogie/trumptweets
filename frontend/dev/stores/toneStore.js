import {observable, action, useStrict, computed, toJS} from 'mobx'
// useStrict(true)
import {get, post} from 'axios'

const toneStore = observable({
  tones: [],
  currentToneIndex: 0,
  tone: computed(() => toneStore.tones.length ? toJS(toneStore.tones[toneStore.currentToneIndex]) : {}),
  loading: false,
  error: '',
  hasBeenFetched: false,
  requestTone: action(() => {
    toneStore.loading = true
    toneStore.error = ''
  }),
  getToneSuccess: action((tone) => {
    toneStore.hasBeenFetched = true
    toneStore.loading = false
    toneStore.tones.push(tone)
  }),
  getToneFailure: action((error) => {
    toneStore.loading = false
    toneStore.error = 'oops...'
  })
})

// api stuff
toneStore.getTone = () => {
  get('http://localhost:3030/tone')
    .then((resp) => toneStore.getToneSuccess(resp.data))
    .catch((err) => toneStore.getToneFailure())
}

export default toneStore
