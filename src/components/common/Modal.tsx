import { FC, HTMLAttributes } from 'react';
import { createPortal } from 'react-dom';
import Draggable from 'react-draggable';
import { Button } from '..';
import { cm } from '../../utils';

export type TBackdrop = HTMLAttributes<HTMLDivElement> & {
  dim?: boolean;
};

const Backdrop: FC<TBackdrop> = ({ dim, className, ...p }) => (
  <div
    {...p}
    className={cm(
      'animate-aFadeIn',
      'fixed left-0 top-0 h-full w-full',
      'flex items-center justify-center',
      dim && 'bg-black bg-opacity-20',
      className
    )}
  />
);

export type TModal = HTMLAttributes<HTMLDivElement> & {
  title?: string;
  backdropProps?: TBackdrop;
  modalRootQuery?: string;
  noClose?: boolean;
  disableClose?: boolean;
  onClose?: () => void;
};

export const Modal: FC<TModal> = ({
  className,
  children,
  title,
  backdropProps,
  modalRootQuery,
  noClose = false,
  disableClose,
  onClose,
  ...p
}) => {
  const modalComponent = (
    <Backdrop {...backdropProps}>
      <Draggable handle='#title' bounds='parent'>
        <div
          {...p}
          className={cm(
            'fixed animate-fadeInScale rounded-xl shadow-modal',
            className
          )}
        >
          <div
            id='title'
            className={cm(
              'flex items-center justify-between',
              'gap-2 rounded-t-xl px-3 py-1',
              'cursor-move select-none',
              'bg-primaryLight text-white',
              noClose && 'pr-5'
            )}
          >
            <div>✥</div>
            {title}
            {!noClose && (
              <Button
                tabIndex={100}
                variant='text'
                disabled={disableClose}
                onClick={() => onClose?.()}
              >
                ✕
              </Button>
            )}
            {noClose && <div />}
          </div>
          <div className='rounded-b-xl bg-white'>{children}</div>
        </div>
      </Draggable>
    </Backdrop>
  );

  return modalRootQuery
    ? createPortal(modalComponent, document.querySelector(modalRootQuery)!)
    : modalComponent;
};
