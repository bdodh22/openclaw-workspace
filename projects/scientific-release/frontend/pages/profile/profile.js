// pages/profile/profile.js
const app = getApp();

Page({
  data: {
    userInfo: {
      id: null,
      nickname: '',
      avatarUrl: '',
      totalReleases: 0,
      totalMerit: 0
    },
    isLoggedIn: false
  },

  onLoad() {
    this.checkLoginStatus();
  },

  onShow() {
    if (this.data.isLoggedIn) {
      this.loadUserInfo();
    }
  },

  checkLoginStatus() {
    const userInfo = app.globalData.userInfo;
    const isLoggedIn = app.globalData.isLoggedIn;

    if (isLoggedIn && userInfo) {
      this.setData({
        userInfo,
        isLoggedIn
      });
    }
  },

  async loadUserInfo() {
    // Mock data for development
    const mockUser = {
      id: 1,
      nickname: '善心居士',
      avatarUrl: '',
      totalReleases: 12,
      totalMerit: 120
    };

    this.setData({ userInfo: mockUser });

    // Actual API call (uncomment in production)
    /*
    const userId = app.globalData.userInfo.id;
    wx.request({
      url: `${app.globalData.apiBaseUrl}/users/${userId}`,
      success: (res) => {
        if (res.data.success) {
          this.setData({ userInfo: res.data.data });
        }
      }
    });
    */
  },

  async login() {
    wx.showLoading({ title: '登录中...' });

    try {
      // WeChat login
      const loginRes = await wx.login();
      const { code } = loginRes;

      // Get user info
      const userInfoRes = await new Promise((resolve, reject) => {
        wx.getUserProfile({
          desc: '用于完善用户资料',
          success: resolve,
          fail: reject
        });
      });

      // Send to backend
      // In production, call your backend API here
      const userInfo = {
        id: 1,
        nickname: userInfoRes.userInfo.nickName,
        avatarUrl: userInfoRes.userInfo.avatarUrl,
        totalReleases: 0,
        totalMerit: 0
      };

      app.globalData.userInfo = userInfo;
      app.globalData.isLoggedIn = true;

      this.setData({
        userInfo,
        isLoggedIn: true
      });

      wx.hideLoading();
      wx.showToast({ title: '登录成功', icon: 'success' });
    } catch (error) {
      console.error('Login error:', error);
      wx.hideLoading();
      wx.showToast({ title: '登录失败', icon: 'none' });
    }
  },

  goToCertificates() {
    if (!this.data.isLoggedIn) {
      wx.showToast({ title: '请先登录', icon: 'none' });
      return;
    }
    wx.navigateTo({
      url: '/pages/certificates/certificates'
    });
  },

  goToFavorites() {
    if (!this.data.isLoggedIn) {
      wx.showToast({ title: '请先登录', icon: 'none' });
      return;
    }
    wx.showToast({ title: '功能开发中', icon: 'none' });
  },

  goToSettings() {
    wx.showToast({ title: '功能开发中', icon: 'none' });
  },

  showAbout() {
    wx.showModal({
      title: '关于科学放生',
      content: '科学放生小程序致力于推广科学、合规的放生理念，保护生态环境，传承慈悲文化。\n\n版本：v1.0.0\n开发日期：2026 年 3 月',
      showCancel: false
    });
  },

  showFeedback() {
    wx.showModal({
      title: '意见反馈',
      editable: true,
      placeholderText: '请输入您的建议或问题',
      success: (res) => {
        if (res.confirm && res.content) {
          wx.showToast({ title: '感谢反馈', icon: 'success' });
          // In production, send feedback to backend
        }
      }
    });
  }
});
