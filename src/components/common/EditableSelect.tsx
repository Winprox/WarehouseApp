import { nanoid } from 'nanoid';
import { FC, HTMLAttributes, SelectHTMLAttributes, useEffect, useMemo, useRef, useState } from 'react'; // prettier-ignore
import { cm } from '../../utils';
import { Button } from './Button';
import { Input } from './Input';

const addId = nanoid();

type Props = {
  wrapperProps?: HTMLAttributes<HTMLDivElement>;
  unselectedLabel?: string;
  addLabel?: string;
  values: string[];
  onChange?: (value: string) => void;
  onDeleteValue?: (value: string) => void;
};

export type TDropDown = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  keyof Props
> &
  Props;

export const EditableSelect: FC<TDropDown> = ({
  className,
  unselectedLabel = '--- Не выбран ---',
  addLabel = '--- Добавить ---',
  values,
  value,
  onChange,
  onDeleteValue,
  ...p
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selected, setSelected] = useState(value);
  const localValues = useMemo(() => ['', ...values, addId], [values]);

  const addIsSelected = selected === localValues.at(-1);

  useEffect(() => {
    if (addIsSelected) inputRef.current?.focus();
  }, [addIsSelected]);

  return (
    <>
      {!addIsSelected && (
        <div
          {...p.wrapperProps}
          className={cm('flex items-center gap-2', p.wrapperProps?.className)}
        >
          {!!selected && values.includes(selected.toString()) && (
            <Button
              title='Удалить'
              className='text-xl leading-[0]'
              type='button'
              variant='text'
              onClick={() => {
                const value = selected?.toString() ?? '';
                const prev =
                  localValues[Math.max(localValues.indexOf(value) - 1, 0)];

                onDeleteValue?.(value);
                onChange?.(prev);
                setSelected(prev);
              }}
            >
              ×
            </Button>
          )}
          <select
            {...p}
            value={selected}
            className={cm(
              'h-6 rounded-md border-2 border-controlStroke',
              'disabled:cursor-not-allowed disabled:bg-white disabled:opacity-75',
              className
            )}
            onChange={(e) => {
              const value = e.target.value;
              setSelected(value);
              onChange?.(value);
            }}
          >
            {localValues.map((v, i) => (
              <option key={v} value={v}>
                {[unselectedLabel, ...values, addLabel][i]}
              </option>
            ))}
          </select>
        </div>
      )}
      {addIsSelected && (
        <Input
          {...(p as HTMLAttributes<HTMLInputElement>)}
          className={className}
          ref={inputRef}
          defaultValue=''
          onChange={(e) => onChange?.(e.target.value)}
        />
      )}
    </>
  );
};
