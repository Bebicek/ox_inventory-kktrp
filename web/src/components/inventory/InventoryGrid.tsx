import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Inventory } from '../../typings';
import WeightBar from '../utils/WeightBar';
import InventorySlot from './InventorySlot';
import { getTotalWeight } from '../../helpers';
import { useAppSelector } from '../../store';
import { useIntersection } from '../../hooks/useIntersection';

const PAGE_SIZE = 30;

const InventoryGrid: React.FC<{ inventory: Inventory }> = ({ inventory }) => {
  const weight = useMemo(
    () => (inventory.maxWeight !== undefined ? Math.floor(getTotalWeight(inventory.items) * 1000) / 1000 : 0),
    [inventory.maxWeight, inventory.items]
  );
  const [page, setPage] = useState(0);
  const containerRef = useRef(null);
  const { ref, entry } = useIntersection({ threshold: 0.5 });
  const isBusy = useAppSelector((state) => state.inventory.isBusy);

  useEffect(() => {
    if (entry && entry.isIntersecting) {
      setPage((prev) => ++prev);
    }
  }, [entry]);
  return (
    <div className="inventory-grid-wrapper" style={{ pointerEvents: isBusy ? 'none' : 'auto' }}>
      <div className="inventory-grid-header">
        <div className="inventory-grid-title-group">
          <p className="inventory-grid-title">{inventory.label}</p>
          {inventory.type && <span className="inventory-grid-subtitle">{inventory.type}</span>}
        </div>
        {inventory.maxWeight && (
          <div className="inventory-grid-weight">
            <span className="inventory-grid-weight-current">{weight / 1000}</span>
            <span className="inventory-grid-weight-divider">/</span>
            <span className="inventory-grid-weight-max">{inventory.maxWeight / 1000}kg</span>
          </div>
        )}
      </div>
      <WeightBar percent={inventory.maxWeight ? (weight / inventory.maxWeight) * 100 : 0} />
      <div className="inventory-grid-body">
        <div className="inventory-grid-container" ref={containerRef}>
          {inventory.items.slice(0, (page + 1) * PAGE_SIZE).map((item, index) => (
            <InventorySlot
              key={`${inventory.type}-${inventory.id}-${item.slot}`}
              item={item}
              ref={index === (page + 1) * PAGE_SIZE - 1 ? ref : null}
              inventoryType={inventory.type}
              inventoryGroups={inventory.groups}
              inventoryId={inventory.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default InventoryGrid;
