import React from 'react';
import { useAuth } from '../../store/authStore';
import { Calendar, Users, Clock, AlignLeft, Info, CheckCircle } from 'lucide-react';

export const BookingPage: React.FC = () => {
  const [auth] = useAuth();
  const [formData, setFormData] = React.useState({
    date: '',
    time: '',
    guests: 2,
    tableId: '',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  // Mock danh sách bàn có sẵn để lựa chọn
  const availableTables = [
    { id: 't1', name: 'Bàn 01 (Cửa sổ - 2 Ghế)', capacity: 2 },
    { id: 't3', name: 'Bàn 03 (Phòng lạnh - 6 Ghế)', capacity: 6 },
    { id: 't4', name: 'Bàn 04 (Gác lửng - 2 Ghế)', capacity: 2 },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Giả lập cuộc gọi API
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="rounded-3xl bg-white border border-stone-200 p-8 shadow-xl text-center space-y-6 animate-in fade-in duration-300">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircle size={36} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-stone-900">Đặt Bàn Thành Công!</h2>
            <p className="text-stone-500 text-sm">
              Mã giữ bàn của bạn đã được khởi tạo thành công. Nhân viên của Pam Coffee & Tea sẽ liên hệ lại qua điện thoại trong vòng 10 phút để xác nhận.
            </p>
          </div>

          <div className="rounded-2xl bg-stone-50 p-6 text-left space-y-3 text-sm border border-stone-100">
            <div className="flex justify-between"><span className="text-stone-500">Khách hàng:</span> <span className="font-semibold text-stone-900">{auth.user?.fullName || auth.user?.username}</span></div>
            <div className="flex justify-between"><span className="text-stone-500">Ngày đặt:</span> <span className="font-semibold text-stone-900">{formData.date}</span></div>
            <div className="flex justify-between"><span className="text-stone-500">Giờ đặt:</span> <span className="font-semibold text-stone-900">{formData.time}</span></div>
            <div className="flex justify-between"><span className="text-stone-500">Số lượng khách:</span> <span className="font-semibold text-stone-900">{formData.guests} người</span></div>
            <div className="flex justify-between"><span className="text-stone-500">Khu vực:</span> <span className="font-semibold text-amber-700">{availableTables.find(t => t.id === formData.tableId)?.name || 'Hệ thống tự sắp xếp'}</span></div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                setIsSuccess(false);
                setFormData({ date: '', time: '', guests: 2, tableId: '', notes: '' });
              }}
              className="w-full rounded-xl bg-amber-600 py-3 text-sm font-bold text-white shadow-md hover:bg-amber-700 transition-colors"
            >
              Tạo cuộc đặt bàn mới
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:py-16">
      <div className="overflow-hidden rounded-3xl bg-white border border-stone-200 shadow-xl lg:grid lg:grid-cols-12">
        {/* Banner cột trái */}
        <div 
          className="relative bg-stone-900 bg-cover bg-center p-8 text-white lg:col-span-4 flex flex-col justify-between overflow-hidden"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&q=80&w=600')" }}
        >
          <div className="absolute inset-0 bg-stone-950/70"></div>
          
          <div className="relative z-10 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-500">Quy trình chuyên nghiệp</span>
            <h2 className="text-2xl font-bold">Lưu ý Đặt Giữ Bàn</h2>
            <p className="text-stone-300 text-xs leading-relaxed">
              * Vui lòng đến đúng giờ đã đăng ký. Bàn đặt trước sẽ được giữ tối đa 15 phút.
            </p>
            <p className="text-stone-300 text-xs leading-relaxed">
              * Quý khách có nhu cầu đặt bàn nhóm trên 8 người vui lòng liên hệ hotline trực tiếp.
            </p>
          </div>

          <div className="relative z-10 mt-8 rounded-xl bg-white/5 backdrop-blur-sm p-4 border border-white/10 flex items-start gap-2.5">
            <Info size={16} className="text-amber-400 shrink-0 mt-0.5" />
            <p className="text-[10px] text-stone-300">
              Mọi yêu cầu đặc biệt như trang trí tiệc sinh nhật, họp nhóm nhỏ,... vui lòng ghi nhận chi tiết tại ô ghi chú.
            </p>
          </div>
        </div>

        {/* Biểu mẫu cột phải */}
        <form onSubmit={handleSubmit} className="p-8 sm:p-10 lg:col-span-8 space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-stone-900">Đặt Bàn Trước</h2>
            <p className="text-sm text-stone-500">Chào mừng {auth.user?.fullName || auth.user?.username}, vui lòng hoàn tất thông tin đặt bàn.</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {/* Chọn Ngày */}
            <div className="space-y-1.5">
              <label htmlFor="date" className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar size={14} className="text-stone-400" />
                Ngày đến
              </label>
              <input
                type="date"
                id="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm focus:border-amber-600 focus:outline-none transition-colors"
              />
            </div>

            {/* Chọn Giờ */}
            <div className="space-y-1.5">
              <label htmlFor="time" className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                <Clock size={14} className="text-stone-400" />
                Giờ đến
              </label>
              <select
                id="time"
                required
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm focus:border-amber-600 focus:outline-none transition-colors bg-white"
              >
                <option value="">-- Chọn khung giờ --</option>
                <option value="08:00">08:00 AM</option>
                <option value="09:30">09:30 AM</option>
                <option value="14:00">02:00 PM</option>
                <option value="16:00">04:00 PM</option>
                <option value="19:00">07:00 PM</option>
                <option value="20:30">08:30 PM</option>
              </select>
            </div>

            {/* Số Lượng Người */}
            <div className="space-y-1.5">
              <label htmlFor="guests" className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                <Users size={14} className="text-stone-400" />
                Số lượng người
              </label>
              <input
                type="number"
                id="guests"
                required
                min={1}
                max={15}
                value={formData.guests}
                onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) })}
                className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm focus:border-amber-600 focus:outline-none transition-colors"
              />
            </div>

            {/* Chọn Bàn Cụ Thể */}
            <div className="space-y-1.5">
              <label htmlFor="tableId" className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                <Info size={14} className="text-stone-400" />
                Chọn bàn mong muốn (Tùy chọn)
              </label>
              <select
                id="tableId"
                value={formData.tableId}
                onChange={(e) => setFormData({ ...formData, tableId: e.target.value })}
                className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm focus:border-amber-600 focus:outline-none transition-colors bg-white"
              >
                <option value="">Nhờ nhân viên tự động sắp xếp</option>
                {availableTables.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Ghi chú */}
          <div className="space-y-1.5">
            <label htmlFor="notes" className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
              <AlignLeft size={14} className="text-stone-400" />
              Ghi chú thêm
            </label>
            <textarea
              id="notes"
              rows={3}
              placeholder="VD: Mình muốn ngồi bàn sát cửa kính cửa sổ, chuẩn bị nến sinh nhật giúp mình nhé..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm focus:border-amber-600 focus:outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-amber-600 py-3.5 text-base font-bold text-white shadow-md hover:bg-amber-700 active:scale-95 transition-all duration-200 disabled:bg-stone-300 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isSubmitting ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            ) : (
              'Xác nhận đặt giữ chỗ'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingPage;
