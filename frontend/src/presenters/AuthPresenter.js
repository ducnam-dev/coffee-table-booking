import { UserModel } from '../models/UserModel';

export class AuthPresenter {
  constructor(view) {
    this.view = view;
  }

  async login(emailOrUsername, password) {
    if (!emailOrUsername || !emailOrUsername.trim()) {
      this.view.showError('Vui lòng nhập tên đăng nhập hoặc email');
      return;
    }
    if (!password) {
      this.view.showError('Vui lòng nhập mật khẩu');
      return;
    }

    this.view.showLoading(true);
    this.view.clearError();

    try {
      const res = await UserModel.authenticate(emailOrUsername.trim(), password);
      if (res.success) {
        this.view.onLoginSuccess(res.user, res.token);
      } else {
        this.view.showError(res.message || 'Đăng nhập không thành công');
      }
    } catch (e) {
      this.view.showError('Đã xảy ra lỗi, vui lòng thử lại');
    } finally {
      this.view.showLoading(false);
    }
  }

  async register({ username, fullName, email, phone, password, confirmPassword }) {
    if (!username || !username.trim() || !email || !email.trim() || !password) {
      this.view.showError('Vui lòng điền đầy đủ các thông tin bắt buộc (*)');
      return;
    }
    if (password !== confirmPassword) {
      this.view.showError('Mật khẩu xác nhận không trùng khớp');
      return;
    }

    this.view.showLoading(true);
    this.view.clearError();

    try {
      const res = await UserModel.register({
        username: username.trim(),
        fullName: (fullName || username).trim(),
        email: email.trim(),
        phone: (phone || '').trim(),
        password
      });

      if (res.success) {
        this.view.onRegisterSuccess(res.user);
      } else {
        this.view.showError(res.message || 'Đăng ký không thành công');
      }
    } catch (e) {
      this.view.showError('Lỗi hệ thống khi đăng ký');
    } finally {
      this.view.showLoading(false);
    }
  }

  async quickLogin(role) {
    this.view.showLoading(true);
    const res = await UserModel.quickLoginFallback(role);
    this.view.showLoading(false);
    if (res.success) {
      this.view.onLoginSuccess(res.user, res.token);
    }
  }
}

