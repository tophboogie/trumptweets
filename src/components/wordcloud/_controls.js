import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {inject, observer} from 'mobx-react'
import moment from 'moment'

import {SingleDatePicker} from 'react-dates'
import 'react-dates/lib/css/_datepicker.css'

class WordcloudControls extends Component {
  static propTypes = {
    wordcloudStore: PropTypes.shape({
      startDate: PropTypes.object,
      onStartDateChange: PropTypes.func,
      startDateFocused: PropTypes.bool,
      onStartDateFocusChange: PropTypes.func,
      endDate: PropTypes.object,
      onEndDateChange: PropTypes.func,
      endDateFocused: PropTypes.bool,
      onEndDateFocusChange: PropTypes.func
    })
  }
  render() {
    const {
      startDate,
      onStartDateChange,
      startDateFocused,
      onStartDateFocusChange,
      endDate,
      onEndDateChange,
      endDateFocused,
      onEndDateFocusChange
    } = this.props.wordcloudStore

    return (
      <div className='wordcloud__controls'>
        <SingleDatePicker
          date={startDate}
          onDateChange={onStartDateChange}
          focused={startDateFocused}
          onFocusChange={onStartDateFocusChange}
          isDayBlocked={(day) => {
            return moment(day).startOf('day').format() > moment().startOf('day').format() ||
                   moment(day).startOf('day').format() > moment(endDate).startOf('day').format()
          }}
          isOutsideRange={() => false}
          numberOfMonths={1}
        />
        <div className='wordcloud__controls-spacer'>→</div>
        <SingleDatePicker
          date={endDate}
          onDateChange={onEndDateChange}
          focused={endDateFocused}
          onFocusChange={onEndDateFocusChange}
          isDayBlocked={(day) => {
            return moment(day).startOf('day').format() > moment().startOf('day').format() ||
                   moment(day).startOf('day').format() < moment(startDate).startOf('day').format()
          }}
          isOutsideRange={() => false}
          numberOfMonths={1}
        />
      </div>
    )
  }
}

const ConnectWordcloudControls = inject('wordcloudStore')(observer(WordcloudControls))
export default ConnectWordcloudControls
