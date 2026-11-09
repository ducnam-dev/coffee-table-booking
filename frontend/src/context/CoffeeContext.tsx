import React, { createContext, useContext, useState, useEffect } from 'react';
import { TableModel } from '../models/TableModel';
import { MenuModel } from '../models/MenuModel';
import { ReservationModel } from '../models/ReservationModel';
import { CoffeeTable, MenuItem, Reservation, OrderItem } from '../types';

interface CoffeeContextType {
  tables: CoffeeTable[];
  menuItems: MenuItem[];
  reservations: Reservation[];
  cart: OrderItem[];
  loading: boolean;
  refreshData: () => Promise<void>;
  addToCart: (item: MenuItem, qty?: number) => void;
  removeFromCart: (itemId: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

const CoffeeContext = createContext<CoffeeContextType | undefined>(undefined);

export const CoffeeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tables, setTables] = useState<CoffeeTable[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshData = async () => {
    setLoading(true);
    const [t, m, r] = await Promise.all([
      TableModel.getAllTables(),
      MenuModel.getAllMenuItems(),
      ReservationModel.getAllReservations(),
    ]);
    setTables(t);
    setMenuItems(m);
    setReservations(r);
    setLoading(false);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const addToCart = (item: MenuItem, qty = 1) => {
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.menuItemId === item.id);
      if (idx !== -1) {
        const updated = [...prev];
        updated[idx].quantity += qty;
        return updated;
      }
      return [...prev, { menuItemId: item.id, name: item.name, price: item.price, quantity: qty }];
    });
  };

  const removeFromCart = (itemId: number) => {
    setCart((prev) => prev.filter((i) => i.menuItemId !== itemId));
  };

  const clearCart = () => setCart([]);

  const getCartTotal = () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CoffeeContext.Provider
      value={{
        tables,
        menuItems,
        reservations,
        cart,
        loading,
        refreshData,
        addToCart,
        removeFromCart,
        clearCart,
        getCartTotal,
      }}
    >
      {children}
    </CoffeeContext.Provider>
  );
};

export const useCoffee = () => {
  const ctx = useContext(CoffeeContext);
  if (!ctx) throw new Error('useCoffee must be used within CoffeeProvider');
  return ctx;
};

export default CoffeeContext;

