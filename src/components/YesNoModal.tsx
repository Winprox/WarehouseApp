import { FC, useEffect, useRef } from 'react';
import { Button, Modal } from '.';

export type TYesNoModal = {
  description: string;
  onNo?: () => void;
  onYes?: () => void;
};

export const SureCloseModal: FC<TYesNoModal> = ({
  description,
  onNo,
  onYes,
}) => {
  const noButtonRef = useRef<HTMLButtonElement>(null);
  const yesButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const close = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') noButtonRef.current?.focus();
      if (e.key === 'ArrowRight') yesButtonRef.current?.focus();
    };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, []);

  return (
    <Modal
      backdropProps={{ dim: true }}
      title='Подтвердите действие'
      modalRootQuery='#root'
      noClose
    >
      <div className='flex flex-col gap-4 p-4'>
        <h1 className='whitespace-pre-wrap text-lg leading-5'>
          {`Вы уверены, что хотите\n${description}?`}
        </h1>
        <div className='flex justify-around'>
          <Button autoFocus ref={noButtonRef} className='w-20' onClick={onNo}>
            Нет
          </Button>
          <Button ref={yesButtonRef} className='w-20' onClick={onYes}>
            Да
          </Button>
        </div>
      </div>
    </Modal>
  );
};
