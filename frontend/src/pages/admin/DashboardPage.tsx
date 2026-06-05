import React from 'react';
import { Calendar, Users, Coffee, DollarSign, ArrowUpRight, ArrowDownRight, Check, X, ShieldAlert } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  // Mock Data cho Thẻ thống kê
  const stats = [
    {
      name: 'Tổng Lượt Đặt Bàn',
      value: '142 lượt',
      change: '+12.5%',
      isPositive: true,
      icon: <Calendar className="text-amber-600" size={24} />,
      bgColor: 'bg-amber-50',
    },
    {
      name: 'Số Bàn Đang Sử Dụng',
      value: '8 / 12 bàn',
      change: '66% Công suất',
      isPositive: true,
      icon: <Coffee className="text-emerald-600" size={24} />,
      bgColor: 'bg-emerald-50',
    },
    {
      name: 'Doanh Thu Hôm Nay',
      value: '4,850,000đ',
      change: '+8.2%',
      isPositive: true,
      icon: <DollarSign className="text-blue-600" size={24} />,
      bgColor: 'bg-blue-50',
    },
    {
      name: 'Thành Viên Mới',
      value: '24 tài khoản',
      change: '-2.4%',
      isPositive: false,
      icon: <Users className="text-rose-600" size={24} />,
      bgColor: 'bg-rose-50',
    },
  ];

  // Mock Data Danh sách đặt bàn mới nhất
  const [recentBookings, setRecentBookings] = React.useState([
    {
      id: 'B001',
      customer: 'Lê Hoàng Khách VIP',
      phone: '0901234567',
      table: 'Bàn 01 (Cửa sổ)',
      time: '19:00 - Hôm nay',
      guests: 2,
      status: 'PENDING',
    },
    {
      id: 'B002',
      customer: 'Nguyễn Trần Huy',
      phone: '0988776655',
      table: 'Bàn 03 (Phòng lạnh)',
      time: '20:30 - Hôm nay',
      guests: 5,
      status: 'CONFIRMED',
    },
    {
      id: 'B003',
      customer: 'Phạm Minh Đức',
      phone: '0911223344',
      table: 'Bàn 04 (Gác lửng)',
      time: '09:00 - Ngày mai',
      guests: 2,
      status: 'CANCELLED',
    },
  ]);

  const handleUpdateStatus = (id: string, newStatus: 'CONFIRMED' | 'CANCELLED') => {
    setRecentBookings(prev =>
      prev.map(booking => (booking.id === id ? { ...booking, status: newStatus } : booking))
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Header Welcome */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-stone-900">Tổng Quan Hệ Thống</h2>
          <p className="text-sm text-stone-500">
            Chào mừng ngày mới! Dưới đây là hiệu suất vận hành của quán tính đến thời điểm hiện tại.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-600 hover:bg-stone-50 transition-colors shadow-sm">
            Xuất báo cáo PDF
          </button>
          <button className="rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700 transition-colors shadow-sm shadow-amber-600/10">
            Xem lịch đặt trực quan
          </button>
        </div>
      </div>

      {/* 2. Statistical Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm flex items-center justify-between group hover:shadow-md transition-all duration-200"
          >
            <div className="space-y-2">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">{stat.name}</span>
              <h3 className="text-2xl font-extrabold text-stone-900 group-hover:text-amber-600 transition-colors">
                {stat.value}
              </h3>
              <div className="flex items-center gap-1.5 text-xs font-medium">
                {stat.isPositive ? (
                  <span className="text-emerald-600 flex items-center">
                    <ArrowUpRight size={14} />
                    {stat.change}
                  </span>
                ) : (
                  <span className="text-rose-600 flex items-center">
                    <ArrowDownRight size={14} />
                    {stat.change}
                  </span>
                )}
                <span className="text-stone-400">so với tuần trước</span>
              </div>
            </div>
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bgColor}`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* 3. Bookings Management Table */}
      <div className="rounded-2xl border border-stone-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-stone-100 px-6 py-5 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-stone-900">Danh Sách Yêu Cầu Đặt Bàn Gần Đây</h3>
            <p className="text-xs text-stone-500">Các lượt đặt bàn mới nhất cần phê duyệt hoặc xác nhận.</p>
          </div>
          <span className="rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-bold text-amber-800 animate-pulse">
            Có 1 yêu cầu mới
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-stone-500">
            <thead className="bg-stone-50 text-xs font-bold uppercase tracking-wider text-stone-700 border-b border-stone-200/50">
              <tr>
                <th className="px-6 py-4">Mã Đặt</th>
                <th className="px-6 py-4">Khách Hàng</th>
                <th className="px-6 py-4">Số Bàn</th>
                <th className="px-6 py-4">Thời Gian</th>
                <th className="px-6 py-4">Số Khách</th>
                <th className="px-6 py-4">Trạng Thái</th>
                <th className="px-6 py-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {recentBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-stone-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-stone-900">{booking.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-stone-800">{booking.customer}</span>
                      <span className="text-xs text-stone-400">{booking.phone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-stone-700">{booking.table}</td>
                  <td className="px-6 py-4 text-stone-700">{booking.time}</td>
                  <td className="px-6 py-4 font-semibold text-stone-800">{booking.guests} người</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${
                        booking.status === 'CONFIRMED'
                          ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/10'
                          : booking.status === 'PENDING'
                          ? 'bg-amber-50 text-amber-700 ring-amber-600/10'
                          : 'bg-rose-50 text-rose-700 ring-rose-600/10'
                      }`}
                    >
                      {booking.status === 'CONFIRMED'
                        ? 'Đã xác nhận'
                        : booking.status === 'PENDING'
                        ? 'Chờ duyệt'
                        : 'Đã hủy'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {booking.status === 'PENDING' ? (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleUpdateStatus(booking.id, 'CONFIRMED')}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-stone-200 text-stone-500 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 transition-all"
                          title="Xác nhận"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(booking.id, 'CANCELLED')}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-stone-200 text-stone-500 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-all"
                          title="Hủy đặt bàn"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-stone-400 italic">Đã xử lý xong</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
