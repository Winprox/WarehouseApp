import { FC } from 'react';
import { Button } from '.';

export type THeader = {
  addDisabled?: boolean;
  editDisabled?: boolean;
  onAdd?: () => void;
  onEdit?: () => void;
};

export const Header: FC<THeader> = (p) => (
  <div className='flex h-12 items-center gap-4 px-4'>
    <Button disabled={p.addDisabled} onClick={p.onAdd}>
      Добавить
    </Button>
    <Button disabled={p.editDisabled} onClick={p.onEdit}>
      Редактировать
    </Button>
  </div>
);
