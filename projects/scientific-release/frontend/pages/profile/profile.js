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
      // Step 1: WeChat login - get code
      const loginRes = await wx.login();
      const { code } = loginRes;

      // Step 2: Get user profile (requires user authorization)
      const userInfoRes = await new Promise((resolve, reject) => {
        wx.getUserProfile({
          desc: '用于完善用户资料，记录放生功德',
          success: resolve,
          fail: reject
        });
      });

      // Step 3: Call backend API
      const loginData = {
        code: code,
        encryptedData: userInfoRes.encryptedData,
        iv: userInfoRes.iv
      };

      const res = await new Promise((resolve, reject) => {
        wx.request({
          url: `${app.globalData.apiBaseUrl}/users/login`,
          method: 'POST',
          data: loginData,
          success: resolve,
          fail: reject
        });
      });

      if (res.data.success) {
        const userInfo = res.data.data;
        
        // Save to global and storage
        app.saveUserInfo(userInfo, 'token_' + userInfo.id);
        
        this.setData({
          userInfo,
          isLoggedIn: true
        });

        wx.hideLoading();
        wx.showToast({ 
          title: '阿弥陀佛，登录成功', 
          icon: 'success',
          duration: 2000
        });

        // Add merit for first login
        if (userInfo.totalReleases === 0) {
          setTimeout(() => {
            wx.showModal({
              title: '欢迎',
              content: '🙏 阿弥陀佛，欢迎加入科学放生！\n\n首次登录赠送 10 福报积分，祝您善缘广结，福慧双增。',
              showCancel: false,
              confirmColor: '#C9A961'
            });
          }, 500);
        }
      } else {
        throw new Error(res.data.error || '登录失败');
      }
    } catch (error) {
      console.error('Login error:', error);
      wx.hideLoading();
      
      let errorMsg = '登录失败，请重试';
      if (error.errMsg && error.errMsg.includes('auth deny')) {
        errorMsg = '您取消了授权';
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      wx.showToast({ 
        title: errorMsg, 
        icon: 'none',
        duration: 2000
      });
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
