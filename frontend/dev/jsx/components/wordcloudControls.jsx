import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'

import {DateRangePicker} from 'react-dates'
import 'react-dates/lib/css/_datepicker.css'

class WordcloudControls extends Component {
  render() {
    const {onDatesChange, onDateRangeFocusChange, dateRangeFocusedInput, startDate, endDate, loading} = this.props.tweetStore
    return (
      <div>
        <DateRangePicker
          onDatesChange={onDatesChange}
          onFocusChange={onDateRangeFocusChange}
          focusedInput={dateRangeFocusedInput}
          minimumNights={0}
          startDate={startDate}
          endDate={endDate}
          isOutsideRange={() => false}
          orientation={window.innerWidth > 768 ? 'horizontal' : 'vertical'}
        />
      </div>
    )
  }
}

const WordcloudControlsWrapped = inject('tweetStore')(observer(WordcloudControls))

export default WordcloudControlsWrapped
