import React from 'react'
import Axios from 'axios'

import Wordcloud from './wordcloud.jsx'
import getWordArray from '../lib/getWordArray.js'

export default class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tweets: [],
      words: [],
      startDate: '12-1-2016',
      endDate: '12-10-2016',
      refresh: false
    }
    this.getDateRange = this.getDateRange.bind(this)
    this.updateStartDate = this.updateStartDate.bind(this)
    this.updateEndDate = this.updateEndDate.bind(this)
  }
  componentDidMount() {
    Axios.get('http://localhost:3030/tweets')
      .then((resp) => {
        this.setState({
          tweets: resp.data,
          words: getWordArray(resp.data)
        })
      })
  }
  getDateRange(e) {
    e.preventDefault()
    Axios.get('http://localhost:3030/tweets/' + this.state.startDate + '/to/' + this.state.endDate)
      .then((resp) => {
        this.setState({
          tweets: resp.data,
          words: getWordArray(resp.data),
          refresh: true
        })
      })
  }
  updateStartDate(e) {
    this.setState({
      startDate: e.target.value,
      refresh: false
    })
  }
  updateEndDate(e) {
    this.setState({
      endDate: e.target.value,
      refresh: false
    })
  }
  render() {
    //console.log(this.state.startDate, this.state.endDate, this.state.tweets)
    var words = this.state.words
    return (
      <div>
        <div className="row controls">
          <form className="form-inline" onSubmit={this.getDateRange}>
            <div className="form-group">
              <label htmlFor="startDate">Start Date</label>
              <input type="text" className="form-control" id="startDate" placeholder="1-1-2016" value={this.state.startDate} onChange={this.updateStartDate} />
            </div>
            <div className="form-group">
              <label htmlFor="endDate">End Date</label>
              <input type="text" className="form-control" id="endDate" placeholder="12-31-2016" value={this.state.endDate} onChange={this.updateEndDate} />
            </div>
            <button type="submit" className="btn btn-default">Submit</button>
          </form>
        </div>
        <Wordcloud words={this.state.words} refresh={this.state.refresh} />
      </div>
    )
  }
}
