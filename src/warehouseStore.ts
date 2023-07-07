import { nanoid } from 'nanoid';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TItem, rndRange } from './utils';

const MS_IN_DAY = 864e5;

const initWarehouses = Array.from({ length: 5 }).map(
  (_, i) => `Склад #${i + 1}`
);

const initItems: TItem[] = Array.from({ length: 100 }).map(() => ({
  id: nanoid(10),
  title: `Товар #${nanoid(3)}`,
  price: rndRange(10000),
  quantity: rndRange(10000),
  arrival: new Date(new Date().valueOf() - rndRange(MS_IN_DAY * 14)),
  warehouse: initWarehouses[rndRange(initWarehouses.length)],
}));

type TStore = {
  selectedItemId: string;
  setSelectedItemId: (selectedItemId: string) => void;
  items: TItem[];
  handleItem: (value?: TItem, onComplete?: (added?: boolean) => void) => void;
  warehouses: string[];
  addWarehouse: (value: string) => void;
  deleteWarehouse: (value: string) => void;
};

export const useWarehouseStore = create(
  persist<TStore>(
    (set, get) => ({
      selectedItemId: initItems[rndRange(Math.min(10, initItems.length))].id,
      setSelectedItemId: (selectedItemId) => set({ selectedItemId }),
      items: initItems,
      handleItem: (addedItem, onComplete) => {
        const setSelectedItemId = get().setSelectedItemId;

        if (!addedItem) {
          set((s) => ({
            items: s.items.filter((i) => i.id !== get().selectedItemId),
          }));
          setSelectedItemId('');
          setTimeout(() => onComplete?.());
          return;
        }

        const newItems = [...get().items];

        if (addedItem.id === '') {
          addedItem.id = nanoid(10);
          newItems.push(addedItem);
          setSelectedItemId(addedItem.id);
          setTimeout(() => onComplete?.(true));
        } else {
          const oldItem = newItems.findLast((i) => i.id === addedItem.id);
          if (oldItem) Object.assign(oldItem, addedItem);
          setTimeout(() => onComplete?.());
        }

        set({ items: newItems });
      },
      warehouses: initWarehouses,
      addWarehouse: (value) =>
        set((s) => ({ warehouses: [...s.warehouses, value] })),
      deleteWarehouse: (value) =>
        set((s) => ({ warehouses: s.warehouses.filter((wh) => wh !== value) })),
    }),
    {
      name: 'warehouse',
      storage: {
        getItem: (name) => {
          const state: TStore = JSON.parse(localStorage.getItem(name) ?? '');
          return {
            state: {
              ...state,
              items: state.items.map((i) => ({
                ...i,
                arrival: new Date(i.arrival),
              })),
            },
          };
        },
        setItem: (name, { state }) =>
          localStorage.setItem(name, JSON.stringify(state)),
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);
