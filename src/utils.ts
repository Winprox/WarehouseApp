import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export type TItem = {
  id: string;
  title: string;
  quantity: number;
  price: number;
  arrival: Date;
  warehouse: string;
};

export type TItemFieldTitles = {
  [Property in keyof TItem]: string;
};

export const newItem: TItem = {
  id: '',
  title: '',
  quantity: 0,
  price: 0,
  arrival: new Date(),
  warehouse: '',
};

export const itemFieldTitles: TItemFieldTitles = {
  id: 'ID',
  title: 'Наименование',
  quantity: 'Количество',
  price: 'Цена',
  arrival: 'Дата поступления',
  warehouse: 'Склад',
};

export const cm = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const formatDateTime = (date: Date) =>
  date.toString() !== 'Invalid Date'
    ? `${date.toLocaleString().substring(0, 17)}`
    : '';

export const rndRange = (...args: number[]) =>
  (args.length === 1 ? 0 : Math.min(...args)) +
  Math.floor(Math.random() * Math.max(...args));
