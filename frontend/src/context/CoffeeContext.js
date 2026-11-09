import React, { createContext, useState, useEffect, useContext } from 'react';
import { TableModel } from '../models/TableModel';
import { MenuModel } from '../models/MenuModel';
import { ReservationModel } from '../models/ReservationModel';
import { AuthContext } from './AuthContext';
import { INITIAL_TABLES, INITIAL_MENU, INITIAL_RESERVATIONS } from '../config/api';

export const CoffeeContext = createContext({});

export const CoffeeProvider = ({ children }) => {
  const { token, user } = useContext(AuthContext);

  const [tables, setTables] = useState(INITIAL_TABLES);
  const [menu, setMenu] = useState(INITIAL_MENU);
  const [reservations, setReservations] = useState(INITIAL_RESERVATIONS);
  const [loading, setLoading] = useState(true);

  const [preOrder, setPreOrder] = useState({});
  const [selectedTableForBooking, setSelectedTableForBooking] = useState(null);

  useEffect(() => {
    loadAllData();
  }, [token]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [tablesData, menuData, reservationsData] = await Promise.all([
        TableModel.fetchTables(),
        MenuModel.fetchMenu(),
        ReservationModel.fetchReservations(token)
      ]);
      if (tablesData) setTables(tablesData);
      if (menuData) setMenu(menuData);
      if (reservationsData) setReservations(reservationsData);
    } catch (e) {
      console.warn('CoffeeContext load data error', e);
    } finally {
      setLoading(false);
    }
  };

  // --- TABLES ---
  const updateTableStatus = async (tableId, newStatus) => {
    const updated = tables.map(t => t.id === tableId ? { ...t, status: newStatus } : t);
    setTables(updated);
    await TableModel.cacheTables(updated);
    await TableModel.updateStatus(tableId, newStatus, token);
  };

  const addTable = async (tableData) => {
    const newId = Date.now();
    const newTable = {
      id: newId,
      name: tableData.name,
      seats: Number(tableData.seats) || 2,
      capacity: Number(tableData.seats) || 2,
      type: tableData.type || 'Phòng lạnh',
      status: 'AVAILABLE',
      isNearWindow: !!tableData.isNearWindow,
      isOutdoor: !!tableData.isOutdoor,
      hasSocket: !!tableData.hasSocket
    };
    const updated = [newTable, ...tables];
    setTables(updated);
    await TableModel.cacheTables(updated);
    await TableModel.createTable(newTable, token);
  };

  const deleteTable = async (tableId) => {
    const updated = tables.filter(t => t.id !== tableId);
    setTables(updated);
    await TableModel.cacheTables(updated);
    await TableModel.deleteTable(tableId, token);
  };

  // --- MENU ---
  const addMenuItem = async (itemData) => {
    const newItem = {
      id: Date.now(),
      name: itemData.name,
      category: itemData.category || 'Trà Sữa',
      price: Number(itemData.price) || 20000,
      description: itemData.description || '',
      available: true
    };
    const updated = [...menu, newItem];
    setMenu(updated);
    await MenuModel.cacheMenu(updated);
    await MenuModel.createMenuItem(newItem, token);
  };

  const updateMenuItem = async (id, itemData) => {
    const updated = menu.map(m => m.id === id ? { ...m, ...itemData } : m);
    setMenu(updated);
    await MenuModel.cacheMenu(updated);
    await MenuModel.updateMenuItem(id, itemData, token);
  };

  const toggleMenuAvailable = async (id) => {
    const item = menu.find(m => m.id === id);
    if (!item) return;
    await updateMenuItem(id, { available: !item.available });
  };

  const deleteMenuItem = async (id) => {
    const updated = menu.filter(m => m.id !== id);
    setMenu(updated);
    await MenuModel.cacheMenu(updated);
    await MenuModel.deleteMenuItem(id, token);
  };

  // --- RESERVATIONS ---
  const updateReservationStatus = async (resId, newStatus) => {
    const updated = reservations.map(r => r.id === resId ? { ...r, status: newStatus } : r);
    setReservations(updated);
    await ReservationModel.cacheReservations(updated);

    const target = reservations.find(r => r.id === resId);
    if (target?.coffeeTable?.id) {
      if (newStatus === 'CANCELLED') {
        updateTableStatus(target.coffeeTable.id, 'AVAILABLE');
      } else if (newStatus === 'CONFIRMED') {
        updateTableStatus(target.coffeeTable.id, 'OCCUPIED');
      }
    }
    await ReservationModel.updateStatus(resId, newStatus, token);
  };

  // --- PRE-ORDER CART ---
  const updatePreOrderQty = (menuId, delta) => {
    setPreOrder(prev => {
      const current = prev[menuId] || 0;
      const next = current + delta;
      if (next <= 0) {
        const copy = { ...prev };
        delete copy[menuId];
        return copy;
      }
      return { ...prev, [menuId]: next };
    });
  };

  const clearPreOrder = () => setPreOrder({});

  const preOrderTotal = Object.entries(preOrder).reduce((sum, [id, qty]) => {
    const item = menu.find(m => m.id === Number(id));
    return sum + (item ? item.price * qty : 0);
  }, 0);

  const preOrderCount = Object.values(preOrder).reduce((a, b) => a + b, 0);

  return (
    <CoffeeContext.Provider
      value={{
        tables,
        menu,
        reservations,
        loading,
        selectedTableForBooking,
        setSelectedTableForBooking,
        updateTableStatus,
        addTable,
        deleteTable,
        addMenuItem,
        updateMenuItem,
        toggleMenuAvailable,
        deleteMenuItem,
        updateReservationStatus,
        preOrder,
        updatePreOrderQty,
        clearPreOrder,
        preOrderTotal,
        preOrderCount,
        refreshData: loadAllData
      }}
    >
      {children}
    </CoffeeContext.Provider>
  );
};
