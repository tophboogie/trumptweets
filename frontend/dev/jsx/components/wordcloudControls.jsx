import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'

import {DateRangePicker} from 'react-dates'
import 'react-dates/lib/css/_datepicker.css'

import '../../scss/wordcloud.scss'

@inject('wordcloudStore')
@observer class WordcloudControls extends Component {
  render() {
    const {
      onDatesChange,
      onDateRangeFocusChange,
      dateRangeFocusedInput,
      startDate,
      endDate,
      showLoading,
      orientation
    } = this.props.wordcloudStore

    return (
      <div className='wordcloud-controls'>
        <DateRangePicker
          onDatesChange={onDatesChange}
          onFocusChange={onDateRangeFocusChange}
          focusedInput={dateRangeFocusedInput}
          minimumNights={0}
          startDate={startDate}
          endDate={endDate}
          isOutsideRange={() => false}
          orientation={orientation}
          disabled={showLoading}
        />
      </div>
    )
  }
}

export default WordcloudControls
