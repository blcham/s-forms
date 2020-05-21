import React, { useEffect, useContext } from 'react';
import DatePicker from 'react-datepicker';
import { FormGroup, Form } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import Utils from '../../util/Utils';
import FormUtils from '../../util/FormUtils';
import * as Constants from '../../constants/Constants';
import { ComponentsContext } from '../../contexts/ComponentsContext';

import 'react-datepicker/dist/react-datepicker.css';

const DateTimeAnswer = (props) => {
  const { options } = useContext(ComponentsContext);

  const dateFormat = Utils.resolveDateTimeFormat(props.question, props.value, options.dateTimeAnswer);

  const isDate = FormUtils.isDate(props.question);
  const isTime = FormUtils.isTime(props.question);

  // workaround because it is not possible to construct Date only with time
  let value;
  if (isTime && props.value) {
    value = new Date(`0 ${props.value}`);
  } else {
    value = props.value ? new Date(props.value) : new Date();
  }

  // DatePicker does not know dateFormat "x", translate to datetime
  const datePickerFormat = dateFormat === 'x' ? options.dateTimeAnswer.dateTimeFormat : dateFormat;

  const onChange = (date) => {
    if (dateFormat === Constants.DATETIME_NUMBER_FORMAT) {
      props.onChange(Number(date));
    } else {
      props.onChange(format(date, dateFormat));
    }
  };

  useEffect(() => {
    onChange(value);
  }, []);

  return (
    <FormGroup size="small">
      <Form.Label>{props.label}</Form.Label>
      <DatePicker
        selected={value}
        onChange={onChange}
        showTimeSelect={!isDate}
        showTimeSelectOnly={isTime}
        timeFormat="HH:mm"
        timeIntervals={1}
        timeCaption="Time"
        dateFormat={datePickerFormat}
        className="form-control"
        disabled={FormUtils.isDisabled(props.question, options.readOnly)}
      />
    </FormGroup>
  );
};

DateTimeAnswer.propTypes = {
  question: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  title: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired
};

export default DateTimeAnswer;
