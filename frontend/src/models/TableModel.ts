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
      if (Array.isArray(res.data) && res.data.length > 0) {
        return res.data.map((t: any) => ({
          id: t.id,
          tableNumber: t.name || t.tableNumber || `B0${t.id}`,
          capacity: t.seats || t.capacity || 2,
          area: (t.type === 'Sân vườn' ? 'OUTDOOR' : t.type === 'Gác lửng' ? 'BALCONY' : t.type === 'Phòng VIP' ? 'VIP' : 'INDOOR') as any,
          status: t.status || 'AVAILABLE',
          description: t.description || (t.isNearWindow ? 'Gần cửa sổ' : t.isOutdoor ? 'Sân vườn' : 'Phòng lạnh'),
          hasPowerOutlet: t.hasSocket !== undefined ? t.hasSocket : true,
          isWindowView: t.isNearWindow,
        }));
      }
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
      const res = await axiosClient.post('/tables', {
        name: table.tableNumber || `Bàn ${Date.now().toString().slice(-2)}`,
        seats: table.capacity || 4,
        type: table.area === 'OUTDOOR' ? 'Sân vườn' : table.area === 'BALCONY' ? 'Gác lửng' : table.area === 'VIP' ? 'Phòng lạnh VIP' : 'Phòng lạnh',
        status: table.status || 'AVAILABLE',
        isNearWindow: table.isWindowView || false,
        isOutdoor: table.area === 'OUTDOOR',
        hasSocket: table.hasPowerOutlet !== undefined ? table.hasPowerOutlet : true,
      });
      return {
        id: res.data.id,
        tableNumber: res.data.name,
        capacity: res.data.seats,
        area: table.area || 'INDOOR',
        status: res.data.status,
        description: res.data.type,
      };
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

