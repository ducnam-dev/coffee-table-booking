import { axiosClient } from '../config/axiosClient';
import { CoffeeTable, TableArea, TableStatus } from '../types';

export function normalizeTable(raw: any): CoffeeTable {
  let tableNumber = raw.tableNumber;
  if (!tableNumber) {
    if (raw.name) {
      const match = String(raw.name).match(/\d+/);
      tableNumber = match ? `B${match[0].padStart(2, '0')}` : `B0${raw.id}`;
    } else {
      tableNumber = `B0${raw.id}`;
    }
  }

  let capacity = raw.capacity || raw.seats || 4;
  let area: TableArea = raw.area;
  if (!area) {
    const t = String(raw.type || '').toLowerCase();
    if (t.includes('sân vườn') || raw.isOutdoor) area = 'OUTDOOR';
    else if (t.includes('vip')) area = 'VIP';
    else if (t.includes('gác') || t.includes('cửa sổ') || t.includes('ban công')) area = 'BALCONY';
    else area = 'INDOOR';
  }

  return {
    id: raw.id,
    tableNumber,
    name: raw.name || `Bàn ${tableNumber}`,
    capacity,
    seats: raw.seats || capacity,
    area,
    type: raw.type || area,
    status: raw.status || 'AVAILABLE',
    description: raw.description || raw.name || 'Khu vực yên tĩnh, thoáng mát',
    hasPowerOutlet: raw.hasPowerOutlet ?? raw.hasSocket ?? true,
    hasSocket: raw.hasSocket ?? raw.hasPowerOutlet ?? true,
    isWindowView: raw.isWindowView ?? raw.isNearWindow ?? false,
    isNearWindow: raw.isNearWindow ?? raw.isWindowView ?? false,
    isOutdoor: raw.isOutdoor ?? (area === 'OUTDOOR'),
  };
}

const MOCK_TABLES: CoffeeTable[] = [
  { id: 1, tableNumber: 'B01', name: 'Bàn 01 (Cửa sổ)', capacity: 2, area: 'INDOOR', status: 'AVAILABLE', description: 'Gần quầy pha chế, có ổ cắm điện', hasPowerOutlet: true },
  { id: 2, tableNumber: 'B02', name: 'Bàn 02 (Sân vườn)', capacity: 4, area: 'OUTDOOR', status: 'OCCUPIED', description: 'Bàn sân vườn xanh mát dưới tán cây', hasPowerOutlet: false },
  { id: 3, tableNumber: 'B03', name: 'Bàn 03 (Phòng lạnh)', capacity: 6, area: 'INDOOR', status: 'AVAILABLE', description: 'Bàn nhóm họp phòng lạnh yên tĩnh', hasPowerOutlet: true },
  { id: 4, tableNumber: 'B04', name: 'Bàn 04 (Gác lửng)', capacity: 2, area: 'BALCONY', status: 'AVAILABLE', description: 'Ban công gác lửng thoáng mát, view phố', isWindowView: true },
  { id: 5, tableNumber: 'B05', name: 'Bàn 05 (Sân vườn VIP)', capacity: 8, area: 'VIP', status: 'RESERVED', description: 'Phòng VIP sân vườn cao cấp riêng tư', isWindowView: true },
  { id: 6, tableNumber: 'B06', name: 'Bàn 06 (Cửa sổ tầng 2)', capacity: 4, area: 'BALCONY', status: 'AVAILABLE', description: 'Cửa sổ tầng 2 view phố đón gió tự nhiên', hasPowerOutlet: true },
  { id: 7, tableNumber: 'B07', name: 'Bàn 07 (Sân vườn)', capacity: 4, area: 'OUTDOOR', status: 'AVAILABLE', description: 'Sân vườn xanh mát, nhiều cây' },
  { id: 8, tableNumber: 'B08', name: 'Bàn 08 (Góc đọc sách)', capacity: 2, area: 'INDOOR', status: 'AVAILABLE', description: 'Góc phòng yên tĩnh đọc sách' },
];

export class TableModel {
  static async getAllTables(): Promise<CoffeeTable[]> {
    try {
      const res = await axiosClient.get('/tables');
      if (Array.isArray(res.data)) {
        return res.data.map(normalizeTable);
      }
      return MOCK_TABLES;
    } catch {
      return MOCK_TABLES;
    }
  }

  static async updateTableStatus(tableId: number, status: TableStatus): Promise<CoffeeTable> {
    try {
      const res = await axiosClient.put(`/tables/${tableId}/status`, { status });
      return normalizeTable(res.data);
    } catch {
      const t = MOCK_TABLES.find((item) => item.id === tableId);
      if (t) t.status = status;
      return t || { id: tableId, tableNumber: `B0${tableId}`, name: `Bàn B0${tableId}`, capacity: 4, area: 'INDOOR', status };
    }
  }

  static async createTable(table: Partial<CoffeeTable>): Promise<CoffeeTable> {
    try {
      const res = await axiosClient.post('/tables', table);
      return normalizeTable(res.data);
    } catch {
      const newT: CoffeeTable = normalizeTable({
        id: Date.now(),
        tableNumber: table.tableNumber || 'B99',
        name: table.name || `Bàn ${table.tableNumber || 'B99'}`,
        capacity: table.capacity || 4,
        area: table.area || 'INDOOR',
        status: 'AVAILABLE',
        description: table.description || '',
      });
      MOCK_TABLES.push(newT);
      return newT;
    }
  }
}

export default TableModel;

