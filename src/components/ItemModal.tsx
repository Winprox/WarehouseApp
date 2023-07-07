import { FC, FormEvent, Fragment, useCallback, useEffect, useState } from 'react'; // prettier-ignore
import { Button, DateTimePicker, EditableSelect, Input, Modal, SureCloseModal, } from '.'; // prettier-ignore
import { TItem, cm, itemFieldTitles } from '../utils';

const deleteItem = 'удалить товар';
const noSave = 'отменить изменения';

export type TItemModal = {
  item: TItem;
  warehouses: string[];
  onAddWarehouse?: (warehouse: string) => void;
  onDeleteWarehouse?: (warehouse: string) => void;
  onItem?: (item?: TItem) => void;
};

export const ItemModal: FC<TItemModal> = ({
  item,
  warehouses,
  onAddWarehouse,
  onDeleteWarehouse,
  onItem,
}) => {
  const [modifiedItem, setModifiedItem] = useState(item);
  const [sureModal, setSureModal] = useState(false);
  const [sureDescription, setSureDescription] = useState('');
  const [dateTimeFocused, setDateTimeFocused] = useState(false);

  const isNew = !item.id;

  const onAddOrEdit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      if (!warehouses.includes(modifiedItem.warehouse))
        onAddWarehouse?.(modifiedItem.warehouse);
      onItem?.(modifiedItem);
    },
    [warehouses, modifiedItem, onItem, onAddWarehouse]
  );

  const onCloseOrDelete = useCallback(() => {
    const isDeleted = sureDescription === deleteItem;
    onItem?.(isNew || isDeleted ? undefined : item);
  }, [isNew, sureDescription, item, onItem]);

  const onCloseTry = useCallback(() => {
    if (JSON.stringify(item) !== JSON.stringify(modifiedItem)) {
      setSureDescription(noSave);
      setSureModal(true);
    } else onCloseOrDelete();
  }, [item, modifiedItem, onCloseOrDelete]);

  const onDeleteTry = useCallback(() => {
    setSureDescription(deleteItem);
    setSureModal(true);
  }, []);

  const sureCancel = useCallback(() => {
    setSureDescription('');
    setSureModal(false);
  }, []);

  const sureConfirm = useCallback(() => {
    onCloseOrDelete();
    setSureModal(false);
  }, [onCloseOrDelete]);

  const modifyItem = useCallback((field: keyof TItem, value: string) => {
    let castedValue: TItem[keyof TItem] = value;

    switch (field) {
      case 'price':
      case 'quantity':
        castedValue = +value;
        break;
      case 'arrival':
        castedValue = new Date(value);
        break;
    }

    setModifiedItem((s) => ({ ...s, [field]: castedValue }));
  }, []);

  useEffect(() => {
    const close = (e: KeyboardEvent) =>
      !sureModal && !dateTimeFocused && e.key === 'Escape' && onCloseTry?.();
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [sureModal, dateTimeFocused, onCloseTry]);

  return (
    <>
      <Modal
        modalRootQuery='#root'
        title={`${isNew ? 'Создание' : 'Редактирование'} товара`}
        disableClose={sureModal}
        onClose={onCloseTry}
      >
        <form className='flex flex-col gap-4 p-4' onSubmit={onAddOrEdit}>
          <ul className='flex flex-col gap-2'>
            {Object.keys(item).map((key) => {
              if (isNew && key === 'id') return <Fragment key={key}></Fragment>;

              const fieldKey = key as keyof TItem;
              const value = item[fieldKey];
              const isValueNumber = typeof value === 'number';

              return (
                <li key={key} className='flex items-center justify-between'>
                  <label className='mr-2'>{itemFieldTitles[fieldKey]}</label>
                  {fieldKey !== 'arrival' && fieldKey !== 'warehouse' && (
                    <Input
                      required
                      className='w-[20ch]'
                      placeholder={fieldKey === 'title' ? 'Товар #1' : '0'}
                      type={isValueNumber ? 'number' : 'text'}
                      min={isValueNumber ? 0 : undefined}
                      defaultValue={value.toString()}
                      readOnly={fieldKey === 'id'}
                      disabled={sureModal}
                      onChange={(e) => modifyItem(fieldKey, e.target.value)}
                    />
                  )}
                  {fieldKey === 'arrival' && (
                    <DateTimePicker
                      required
                      onFocus={() => setDateTimeFocused(true)}
                      onBlur={() => setTimeout(() => setDateTimeFocused(false))}
                      value={value as Date}
                      disabled={sureModal}
                      onChange={(value) =>
                        value && modifyItem(fieldKey, value.toString())
                      }
                    />
                  )}
                  {fieldKey === 'warehouse' && (
                    <EditableSelect
                      required
                      className='w-[20ch]'
                      values={warehouses}
                      value={value.toString()}
                      disabled={sureModal}
                      onChange={(value) => modifyItem(fieldKey, value)}
                      onDeleteValue={onDeleteWarehouse}
                    />
                  )}
                </li>
              );
            })}
          </ul>
          <div
            className={cm(
              'flex',
              isNew && 'justify-end',
              !isNew && 'justify-between gap-2'
            )}
          >
            {!isNew && (
              <Button
                variant='text'
                type='button'
                className='text-red'
                disabled={sureModal}
                onClick={onDeleteTry}
              >
                Удалить
              </Button>
            )}
            <Button type='submit' disabled={sureModal}>
              {isNew ? 'Создать' : 'Редактировать'}
            </Button>
          </div>
        </form>
      </Modal>
      {sureModal && (
        <SureCloseModal
          description={sureDescription}
          onNo={sureCancel}
          onYes={sureConfirm}
        />
      )}
    </>
  );
};
