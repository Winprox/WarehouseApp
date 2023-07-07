import { FC, useCallback, useState } from 'react';
import ReactDatePicker, { ReactDatePickerProps } from 'react-datepicker'; // prettier-ignore
import 'react-datepicker/dist/react-datepicker.css';
import { cm } from '../../utils';

type TProps = {
  value?: Date;
  onChange?: (value?: Date) => void;
};

export type TDateTimePicker = Omit<ReactDatePickerProps, keyof TProps> & TProps;

export const DateTimePicker: FC<TDateTimePicker> = ({
  className,
  fixedHeight = true,
  showTimeSelect = true,
  locale = 'ru',
  dateFormat = 'Pp',
  timeCaption = 'время',
  placeholderText = 'дд/мм/гггг чч:мм',
  timeIntervals = 1,
  selected,
  value,
  onChange,
  ...p
}) => {
  const [time, setTime] = useState(value);

  const changeHandler = useCallback(
    (value: Date | null) => {
      setTime(value ?? undefined);
      onChange?.(value ?? undefined);
    },
    [onChange]
  );

  return (
    <ReactDatePicker
      {...p}
      className={cm(
        'h-6 w-[20ch] rounded-md pl-1',
        'border-2 border-controlStroke',
        'disabled:cursor-not-allowed disabled:bg-white disabled:opacity-75',
        className
      )}
      fixedHeight={fixedHeight}
      showTimeSelect={showTimeSelect}
      locale={locale}
      dateFormat={dateFormat}
      timeCaption={timeCaption}
      placeholderText={placeholderText}
      timeIntervals={timeIntervals}
      selected={selected ?? time}
      onChange={changeHandler}
    />
  );
};
