import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {inject, observer} from 'mobx-react'
import moment from 'moment'

import {DateRangePicker} from 'react-dates'
import 'react-dates/lib/css/_datepicker.css'

import '../../scss/wordcloud.scss'

@inject('wordcloudStore')
@observer class WordcloudControls extends Component {
  static propTypes = {
    wordcloudStore: PropTypes.shape({
      onDatesChange: PropTypes.func,
      onDateRangeFocusChange: PropTypes.func,
      onDateRangeClose: PropTypes.func,
      dateRangeFocusedInput: PropTypes.string,
      startDate: PropTypes.object,
      endDate: PropTypes.object,
      showLoading: PropTypes.bool,
      orientation: PropTypes.string,
      numberOfMonths: PropTypes.number
    })
  }
  render() {
    const {
      onDatesChange,
      onDateRangeFocusChange,
      onDateRangeClose,
      dateRangeFocusedInput,
      startDate,
      endDate,
      showLoading,
      orientation,
      numberOfMonths
    } = this.props.wordcloudStore

    return (
      <div className='wordcloud-controls'>
        <DateRangePicker
          onDatesChange={onDatesChange}
          onFocusChange={onDateRangeFocusChange}
          onClose={onDateRangeClose}
          focusedInput={dateRangeFocusedInput}
          minimumNights={0}
          startDate={startDate}
          initialVisibleMonth={() => {
            return dateRangeFocusedInput === 'startDate'
              ? moment(startDate).subtract(numberOfMonths - 1, 'months')
              : moment(endDate).subtract(numberOfMonths - 1, 'months')
          }}
          endDate={endDate}
          isOutsideRange={() => false}
          isDayBlocked={(day) => moment(day).startOf('day').format() > moment().startOf('day').format()}
          orientation={orientation}
          numberOfMonths={numberOfMonths}
          disabled={showLoading}
          renderCalendarInfo={() => false}
        />
      </div>
    )
  }
}

export default WordcloudControls
