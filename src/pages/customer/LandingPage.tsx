import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/authStore';
import { Coffee, Calendar, Eye, Users, ChevronRight, Star, Heart } from 'lucide-react';
import heroImg from '../../assets/hero.png';

export const LandingPage: React.FC = () => {
  const [auth] = useAuth();
  const navigate = useNavigate();

  const handleBookingRedirect = () => {
    if (auth.isAuthenticated) {
      navigate('/booking');
    } else {
      navigate('/login', { state: { from: '/booking' } });
    }
  };

  // Mock Data cho Menu và Bàn
  const featuredMenu = [
    {
      id: '1',
      name: 'Salted Caramel Macchiato',
      description: 'Sự kết hợp hoàn hảo giữa vị mặn của caramel và vị đắng nhẹ của cafe espresso thượng hạng.',
      price: '59,000đ',
      category: 'Cà phê đặc sản',
      tag: 'Bán chạy nhất',
      image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: '2',
      name: 'Matcha Latte Đá Xay',
      description: 'Bột trà xanh Uji Nhật Bản nguyên chất hòa quyện cùng sữa tươi béo ngậy và đá bào tuyết mịn.',
      price: '65,000đ',
      category: 'Trà & Matcha',
      tag: 'Yêu thích',
      image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: '3',
      name: 'Croissant Bơ Pháp',
      description: 'Bánh sừng bò ngàn lớp nướng vàng giòn rụm bên ngoài, mềm xốp và thơm nồng hương bơ bên trong.',
      price: '45,000đ',
      category: 'Bánh ngọt',
      tag: 'Phải thử',
      image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=600'
    }
  ];

  const mockTables = [
    { id: '1', name: 'Bàn 01 (Cửa sổ)', capacity: 2, status: 'EMPTY', type: 'Cặp đôi' },
    { id: '2', name: 'Bàn 02 (Sân vườn)', capacity: 4, status: 'RESERVED', type: 'Gia đình' },
    { id: '3', name: 'Bàn 03 (Phòng lạnh)', capacity: 6, status: 'EMPTY', type: 'Nhóm làm việc' },
    { id: '4', name: 'Bàn 04 (Gác lửng)', capacity: 2, status: 'EMPTY', type: 'Cặp đôi' }
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-stone-900 py-24 text-white lg:py-32">
        {/* Glow Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-900/50 via-stone-900 to-stone-950"></div>
        <div className="absolute -top-40 right-10 h-[600px] w-[600px] rounded-full bg-amber-600/10 blur-[130px]"></div>
        <div className="absolute -bottom-20 left-10 h-[400px] w-[400px] rounded-full bg-amber-800/10 blur-[100px]"></div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
            <div className="sm:text-center md:mx-auto md:max-w-2xl lg:col-span-6 lg:text-left space-y-6">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-500 ring-1 ring-inset ring-amber-500/20">
                <Coffee size={12} />
                Hạt cà phê Specialty tuyển chọn
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl leading-tight">
                Đặt Bàn Nhẹ Nhàng <br />
                <span className="text-amber-500">Tận Hưởng Không Gian</span>
              </h1>
              <p className="text-base text-stone-300 sm:text-xl leading-relaxed">
                Quên đi nỗi lo hết chỗ hay phải chờ đợi vào những ngày cuối tuần. Đặt trước chỗ ngồi yêu thích của bạn ngay hôm nay để trải nghiệm dịch vụ cà phê và bánh ngọt trọn vẹn nhất.
              </p>
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                <button
                  onClick={handleBookingRedirect}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-amber-600/20 hover:bg-amber-700 hover:shadow-amber-600/35 transition-all active:scale-95 duration-200"
                >
                  <Calendar size={18} />
                  Đặt Bàn Trực Tuyến
                </button>
                <a
                  href="#menu"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-700 bg-stone-850 px-6 py-3.5 text-base font-semibold text-stone-200 hover:bg-stone-800 hover:text-white transition-colors"
                >
                  Xem Thực Đơn
                </a>
              </div>
            </div>
            
            {/* Visual Decor */}
            <div className="mt-16 sm:mt-24 lg:col-span-6 lg:mt-0 flex justify-center">
              <div className="relative w-full max-w-md">
                {/* Mockup Coffee shop decoration */}
                <div 
                  className="aspect-[4/3] rounded-3xl bg-cover bg-center p-8 shadow-2xl flex flex-col justify-between text-white overflow-hidden ring-1 ring-white/10 group hover:rotate-1 transition-transform duration-300 relative"
                  style={{ backgroundImage: `url('${heroImg}')` }}
                >
                  <div className="absolute inset-0 bg-stone-950/40"></div>
                  <div className="flex justify-between items-start relative z-10">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md">
                      <Coffee size={24} className="text-amber-300" />
                    </div>
                    <div className="flex items-center gap-1 rounded-full bg-white/20 backdrop-blur-md px-2.5 py-1 text-xs">
                      <Star size={12} className="fill-amber-400 text-amber-400" />
                      <span>4.9 (420+ Reviews)</span>
                    </div>
                  </div>
                  <div className="relative z-10 space-y-2">
                    <span className="text-xs uppercase tracking-widest text-amber-300 font-bold">Không gian làm việc & thư giãn</span>
                    <h3 className="text-2xl font-bold">Pam Coffee & Tea</h3>
                    <p className="text-stone-200 text-sm">Góc ban công thoáng mát và phòng máy lạnh yên tĩnh chuyên dụng.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Public Tables Section */}
      <section id="tables" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 scroll-mt-20">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600">Sơ đồ chỗ ngồi</span>
          <h2 className="text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl">
            Danh Sách Bàn Trống Thực Tế
          </h2>
          <p className="text-stone-500">
            Bạn có thể theo dõi danh sách các khu vực bàn dưới đây. Lưu ý rằng để tiến hành đặt giữ chỗ chính thức, bạn cần đăng nhập tài khoản.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {mockTables.map((table) => (
            <div
              key={table.id}
              className="group relative flex flex-col justify-between rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700 font-semibold text-sm">
                    {table.id}
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${
                      table.status === 'EMPTY'
                        ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/10'
                        : 'bg-rose-50 text-rose-700 ring-rose-600/10'
                    }`}
                  >
                    {table.status === 'EMPTY' ? 'Còn trống' : 'Đã được đặt'}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-900">{table.name}</h3>
                  <div className="mt-2 flex items-center gap-4 text-xs text-stone-500">
                    <span className="flex items-center gap-1">
                      <Users size={14} />
                      Tối đa {table.capacity} người
                    </span>
                    <span className="rounded bg-stone-100 px-2 py-0.5">{table.type}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t border-stone-100 pt-4">
                <button
                  onClick={handleBookingRedirect}
                  disabled={table.status !== 'EMPTY'}
                  className={`w-full inline-flex items-center justify-center gap-1 rounded-xl py-2.5 text-xs font-bold transition-all duration-200 ${
                    table.status === 'EMPTY'
                      ? 'bg-amber-50 text-amber-700 hover:bg-amber-600 hover:text-white'
                      : 'bg-stone-100 text-stone-400 cursor-not-allowed'
                  }`}
                >
                  {table.status === 'EMPTY' ? 'Đặt bàn này ngay' : 'Không khả dụng'}
                  {table.status === 'EMPTY' && <ChevronRight size={14} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Public Menu Section */}
      <section id="menu" className="bg-stone-100 py-20 scroll-mt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600">Thực đơn đặc sắc</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl">
              Thức Uống & Bánh Ngọt
            </h2>
            <p className="text-stone-500">
              Hãy để Pam Coffee & Tea đồng hành cùng khoảnh khắc đặt bàn của bạn bằng các loại đồ uống tuyệt hảo được pha chế tinh tế.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featuredMenu.map((item) => (
              <div
                key={item.id}
                className="group flex flex-col justify-between overflow-hidden rounded-3xl bg-white border border-stone-200/60 shadow-sm transition-all duration-300 hover:shadow-lg"
              >
                {/* Real beverage image */}
                <div 
                  className="h-48 bg-cover bg-center p-6 flex flex-col justify-between relative overflow-hidden group-hover:scale-105 transition-transform duration-300"
                  style={{ backgroundImage: `url('${item.image}')` }}
                >
                  <div className="absolute inset-0 bg-stone-900/30"></div>
                  <span className="relative z-10 self-start rounded-full bg-amber-600 text-white px-3 py-1 text-xs font-bold shadow-sm">
                    {item.category}
                  </span>
                  
                  <div className="relative z-10 flex justify-between items-end">
                    <span className="text-xs font-bold text-amber-900 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-lg shadow-sm border border-stone-200">
                      {item.tag}
                    </span>
                    <button className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-stone-600 hover:text-rose-500 shadow-md transition-colors">
                      <Heart size={16} />
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-stone-900 group-hover:text-amber-600 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-sm text-stone-500 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                    <span className="text-xl font-extrabold text-amber-700">{item.price}</span>
                    <span className="text-xs text-stone-400 font-semibold">Tất cả cỡ ly</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Booking CTA Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-amber-600 px-6 py-16 text-white shadow-xl sm:px-12 sm:py-20 lg:px-20">
          <div className="absolute inset-0 bg-stone-950/10 mix-blend-overlay"></div>
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-amber-500/30 blur-2xl"></div>
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-amber-700/30 blur-2xl"></div>

          <div className="relative max-w-2xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Sẵn Sàng Chọn Góc Ngồi Cho Riêng Mình?
            </h2>
            <p className="mx-auto max-w-xl text-lg text-amber-100">
              Hãy dành ra 30 giây đăng ký tài khoản để mở khóa toàn bộ tính năng: Chọn giờ chi tiết, chọn khu vực ngồi và đặt trước món uống yêu thích.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={handleBookingRedirect}
                className="rounded-xl bg-white px-6 py-3.5 text-base font-bold text-amber-700 shadow-md hover:bg-stone-50 transition-colors"
              >
                Đặt Giữ Bàn Ngay
              </button>
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-amber-400 bg-amber-600 px-6 py-3.5 text-base font-semibold hover:bg-amber-500 transition-colors"
              >
                Tạo tài khoản mới
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
