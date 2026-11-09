import { UserModel } from '../models/UserModel';
import { User } from '../types';

export interface AuthViewInterface {
  showLoading: (loading: boolean) => void;
  showError: (message: string) => void;
  onLoginSuccess: (user: User) => void;
  onRegisterSuccess: (user: User) => void;
}

export class AuthPresenter {
  private view: AuthViewInterface;

  constructor(view: AuthViewInterface) {
    this.view = view;
  }

  async handleLogin(username: string, password: string):Promise<void> {
    if (!username.trim()) {
      this.view.showError('Vui lòng nhập tên đăng nhập');
      return;
    }
    if (!password.trim()) {
      this.view.showError('Vui lòng nhập mật khẩu');
      return;
    }

    try {
      this.view.showLoading(true);
      const user = await UserModel.login(username, password);
      this.view.showLoading(false);
      this.view.onLoginSuccess(user);
    } catch {
      this.view.showLoading(false);
      this.view.showError('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
    }
  }

  async handleRegister(data: {
    username: string;
    password: string;
    confirmPassword: string;
    email: string;
    fullName: string;
    phone?: string;
  }): Promise<void> {
    if (!data.username.trim() || !data.password.trim() || !data.email.trim() || !data.fullName.trim()) {
      this.view.showError('Vui lòng điền đầy đủ các trường thông tin bắt buộc');
      return;
    }
    if (data.password !== data.confirmPassword) {
      this.view.showError('Mật khẩu xác nhận không khớp');
      return;
    }

    try {
      this.view.showLoading(true);
      const user = await UserModel.register({
        username: data.username,
        password: data.password,
        email: data.email,
        fullName: data.fullName,
        phone: data.phone,
      });
      this.view.showLoading(false);
      this.view.onRegisterSuccess(user);
    } catch {
      this.view.showLoading(false);
      this.view.showError('Đăng ký không thành công. Tên đăng nhập có thể đã tồn tại.');
    }
  }

  async quickDemoLogin(role: 'admin' | 'customer'): Promise<void> {
    if (role === 'admin') {
      await this.handleLogin('admin', 'admin123');
    } else {
      await this.handleLogin('khachhang', 'user123');
    }
  }
}

export default AuthPresenter;
