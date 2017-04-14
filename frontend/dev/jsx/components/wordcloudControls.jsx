import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {inject, observer} from 'mobx-react'

import {DateRangePicker} from 'react-dates'
import 'react-dates/lib/css/_datepicker.css'

import '../../scss/wordcloud.scss'

@inject('wordcloudStore')
@observer class WordcloudControls extends Component {
  static propTypes = {
    wordcloudStore: PropTypes.shape({
      onDatesChange: PropTypes.func,
      onDateRangeFocusChange: PropTypes.func,
      dateRangeFocusedInput: PropTypes.string,
      startDate: PropTypes.object,
      endDate: PropTypes.object,
      showLoading: PropTypes.bool,
      orientation: PropTypes.string
    })
  }
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
