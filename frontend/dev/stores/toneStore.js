import {observable, action, useStrict} from 'mobx'
// useStrict(true)
import {get, post} from 'axios'

const toneStore = observable({
  loadingTone: false,
  hasBeenFetched: false,
  getToneSuccess: action((tone) => {
    toneStore.hasBeenFetched = true
    toneStore.loading = false
    toneStore.tone = tone
    console.log(tone)
  })
})

// api stuff
toneStore.getTone = () => {
  get('http://localhost:3030/tone')
    .then((resp) => {
      toneStore.getToneSuccess(resp.data)
    })
}

export default toneStore
