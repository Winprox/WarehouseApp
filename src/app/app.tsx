import { ru } from 'date-fns/locale';
import { useCallback, useMemo, useRef, useState } from 'react';
import { registerLocale } from 'react-datepicker';
import { createRoot } from 'react-dom/client';
import { Header, ItemModal, Table } from '../components';
import { TItem, newItem } from '../utils';
import { useWarehouseStore } from '../warehouseStore';
import './app.css';

const App = () => {
  const selectedItemId = useWarehouseStore((s) => s.selectedItemId);
  const setSelectedItemId = useWarehouseStore((s) => s.setSelectedItemId);
  const items = useWarehouseStore((s) => s.items);
  const handleItem = useWarehouseStore((s) => s.handleItem);
  const warehouses = useWarehouseStore((s) => s.warehouses);
  const addWarehouse = useWarehouseStore((s) => s.addWarehouse);
  const deleteWarehouse = useWarehouseStore((s) => s.deleteWarehouse);

  const [modalOpened, setModalOpened] = useState(false);
  const tableRef = useRef<HTMLTableElement>(null);

  const selectedItem = useMemo(() => {
    return items.find((i) => i.id === selectedItemId) ?? newItem;
  }, [selectedItemId, items]);

  const onAddHandler = useCallback(() => {
    setSelectedItemId('');
    setModalOpened(true);
  }, [setSelectedItemId]);

  const onEditHandler = useCallback(() => {
    setModalOpened(true);
  }, []);

  const onItemHandler = useCallback(
    (item?: TItem) => {
      handleItem(item, (added) => {
        if (added)
          tableRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'end',
          });
        setModalOpened(false);
      });
    },
    [handleItem]
  );

  return (
    <div style={{ height: '100vh' }} className='flex flex-col'>
      <Header
        addDisabled={modalOpened}
        editDisabled={modalOpened || !selectedItemId}
        onAdd={onAddHandler}
        onEdit={onEditHandler}
      />
      <Table
        ref={tableRef}
        wrapperProps={{ className: 'px-4 flex-1' }}
        items={items}
        selectedId={selectedItemId}
        onSelect={setSelectedItemId}
      />
      {modalOpened && (
        <ItemModal
          item={selectedItem}
          warehouses={warehouses}
          onAddWarehouse={addWarehouse}
          onDeleteWarehouse={deleteWarehouse}
          onItem={onItemHandler}
        />
      )}
    </div>
  );
};

registerLocale('ru', ru);
createRoot(document.querySelector('#app')!).render(<App />);
