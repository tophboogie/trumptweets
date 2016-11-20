import {observable, action, asMap, useStrict} from 'mobx'
// useStrict(true)
import {get, post} from 'axios'

const speechStore = observable({
  allSpeeches: [],
  loadingSpeeches: asMap(),
  hasBeenFetched: false,
  getSpeechesSuccess: action((speeches) => {
    speechStore.allSpeeches.replace(speeches)
    speechStore.hasBeenFetched = true
  }),
  getToneSuccess: action((id, data) => {
    speechStore.loadingSpeeches.delete(id)
    const speech = speechStore.allSpeeches.find((speech) => speech._id === id)
    const index = speechStore.allSpeeches.indexOf(speech)
    speechStore.allSpeeches[index] = data
  })
})

// api stuff
speechStore.getSpeeches = () => {
  get('http://localhost:3030/api/speeches')
    .then((resp) => {
      speechStore.getSpeechesSuccess(resp.data)
    })
}
speechStore.getTone = (speech) => {
  speechStore.loadingSpeeches.set(speech._id, true)
  post('http://localhost:3030/api/tonify', {id: speech._id})
    .then((resp) => {
      speechStore.getToneSuccess(speech._id, resp.data)
    })
}


export default speechStore
