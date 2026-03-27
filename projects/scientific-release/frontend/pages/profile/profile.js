// pages/profile/profile.js - Stitch Design: 极简个人中心
const app = getApp();

Page({
  data: {
    userInfo: {
      nickname: '',
      avatarUrl: '',
      totalDays: 0,
      totalReleases: 0,
      certificateCount: 0
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

  /**
   * 检查登录状态
   */
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

  /**
   * 加载用户信息
   */
  loadUserInfo() {
    // Mock data for development
    const mockUser = {
      nickname: '林深见鹿',
      avatarUrl: '',
      totalDays: 128,
      totalReleases: 42,
      certificateCount: 12
    };

    this.setData({ userInfo: mockUser });
  },

  /**
   * 登录
   */
  async login() {
    wx.showLoading({ title: '登录中...', mask: true });

    try {
      // Step 1: WeChat login
      const loginRes = await wx.login();
      const { code } = loginRes;

      // Step 2: Get user profile
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

      // TODO: Call actual API
      // For now, use mock data
      const mockUserInfo = {
        id: 1,
        nickname: userInfoRes.userInfo.nickName,
        avatarUrl: userInfoRes.userInfo.avatarUrl,
        totalReleases: 0,
        totalMerit: 0
      };

      app.saveUserInfo(mockUserInfo, 'token_' + mockUserInfo.id);
      
      this.setData({
        userInfo: mockUserInfo,
        isLoggedIn: true
      });

      wx.hideLoading();
      
      wx.showModal({
        title: '欢迎',
        content: '🙏 阿弥陀佛，欢迎加入科学放生！\n\n首次登录赠送 10 福报积分，祝您善缘广结，福慧双增。',
        showCancel: false,
        confirmColor: '#C9A961'
      });

    } catch (error) {
      console.error('Login error:', error);
      wx.hideLoading();
      
      let errorMsg = '登录失败，请重试';
      if (error.errMsg && error.errMsg.includes('auth deny')) {
        errorMsg = '您取消了授权';
      }
      
      wx.showToast({ 
        title: errorMsg, 
        icon: 'none',
        duration: 2000
      });
    }
  },

  /**
   * 导航跳转
   */
  goToCertificates() {
    if (!this.data.isLoggedIn) {
      wx.showToast({ title: '请先登录', icon: 'none' });
      return;
    }
    wx.navigateTo({
      url: '/pages/certificate/certificate'
    });
  },

  goToFavorites() {
    if (!this.data.isLoggedIn) {
      wx.showToast({ title: '请先登录', icon: 'none' });
      return;
    }
    wx.showToast({ title: '功能开发中', icon: 'none' });
  },

  showAbout() {
    wx.showModal({
      title: '关于科学放生',
      content: '科学放生小程序致力于推广科学、合规的放生理念，保护生态环境，传承慈悲文化。\n\n版本：v2.4.0\n开发日期：2026 年 3 月',
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
          // TODO: Send feedback to backend
        }
      }
    });
  },

  goToIndex() {
    wx.switchTab({
      url: '/pages/index/index'
    });
  },

  goToSpecies() {
    wx.switchTab({
      url: '/pages/species/species'
    });
  },

  goToCertificate() {
    wx.navigateTo({
      url: '/pages/certificate/certificate'
    });
  }
});
