import { axiosClient } from '../config/axiosClient';
import { CoffeeTable, TableStatus } from '../types';

const MOCK_TABLES: CoffeeTable[] = [
  { id: 1, tableNumber: 'B01', capacity: 2, area: 'INDOOR', status: 'AVAILABLE', description: 'Gần quầy pha chế, có ổ cắm điện', hasPowerOutlet: true },
  { id: 2, tableNumber: 'B02', capacity: 4, area: 'INDOOR', status: 'OCCUPIED', description: 'Bàn gỗ sồi, không gian ấm cúng', hasPowerOutlet: true },
  { id: 3, tableNumber: 'B03', capacity: 6, area: 'INDOOR', status: 'AVAILABLE', description: 'Bàn nhóm họp, ánh sáng vàng', hasPowerOutlet: true },
  { id: 4, tableNumber: 'B04', capacity: 2, area: 'BALCONY', status: 'AVAILABLE', description: 'Ban công thoáng mát, view phố', isWindowView: true },
  { id: 5, tableNumber: 'B05', capacity: 4, area: 'BALCONY', status: 'RESERVED', description: 'View ngắm hoàng hôn cực đẹp', isWindowView: true },
  { id: 6, tableNumber: 'B06', capacity: 8, area: 'VIP', status: 'AVAILABLE', description: 'Phòng riêng máy lạnh cao cấp, màn hình chiếu', hasPowerOutlet: true },
  { id: 7, tableNumber: 'B07', capacity: 4, area: 'OUTDOOR', status: 'AVAILABLE', description: 'Sân vườn xanh mát, nhiều cây' },
  { id: 8, tableNumber: 'B08', capacity: 2, area: 'OUTDOOR', status: 'AVAILABLE', description: 'Góc sân yên tĩnh đọc sách' },
];

export class TableModel {
  static async getAllTables(): Promise<CoffeeTable[]> {
    try {
      const res = await axiosClient.get('/tables');
      return res.data;
    } catch {
      return MOCK_TABLES;
    }
  }

  static async updateTableStatus(tableId: number, status: TableStatus): Promise<CoffeeTable> {
    try {
      const res = await axiosClient.put(`/tables/${tableId}/status`, { status });
      return res.data;
    } catch {
      const t = MOCK_TABLES.find((item) => item.id === tableId);
      if (t) t.status = status;
      return t || { id: tableId, tableNumber: `B0${tableId}`, capacity: 4, area: 'INDOOR', status };
    }
  }

  static async createTable(table: Partial<CoffeeTable>): Promise<CoffeeTable> {
    try {
      const res = await axiosClient.post('/tables', table);
      return res.data;
    } catch {
      const newT: CoffeeTable = {
        id: Date.now(),
        tableNumber: table.tableNumber || 'B99',
        capacity: table.capacity || 4,
        area: table.area || 'INDOOR',
        status: 'AVAILABLE',
        description: table.description || '',
      };
      MOCK_TABLES.push(newT);
      return newT;
    }
  }
}

export default TableModel;

