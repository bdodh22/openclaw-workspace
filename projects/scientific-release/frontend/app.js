// app.js
App({
  onLaunch() {
    console.log('🦞 科学放生小程序 launched');
    
    // Check for updates
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager();
      updateManager.onCheckForUpdate((res) => {
        if (res.hasUpdate) {
          updateManager.onUpdateReady(() => {
            wx.showModal({
              title: '更新提示',
              content: '新版本已准备好，是否重启应用？',
              success: (res) => {
                if (res.confirm) {
                  updateManager.applyUpdate();
                }
              }
            });
          });
        }
      });
    }

    // Check login status on launch
    this.checkLoginStatus();
  },

  globalData: {
    userInfo: null,
    isLoggedIn: false,
    apiBaseUrl: 'https://sf.dexoconnect.com/api', // Production domain
    version: '1.0.0',
    miniprogramAppid: 'wxa914ecc15836bda6'
  },

  // Check if user is already logged in (from storage)
  checkLoginStatus() {
    try {
      const userInfo = wx.getStorageSync('userInfo');
      const token = wx.getStorageSync('token');
      
      if (userInfo && token) {
        this.globalData.userInfo = userInfo;
        this.globalData.isLoggedIn = true;
        console.log('✅ User logged in:', userInfo.nickname);
      }
    } catch (error) {
      console.error('Check login status error:', error);
    }
  },

  // Save user info to storage
  saveUserInfo(userInfo, token) {
    try {
      this.globalData.userInfo = userInfo;
      this.globalData.isLoggedIn = true;
      wx.setStorageSync('userInfo', userInfo);
      wx.setStorageSync('token', token);
      console.log('✅ User info saved');
    } catch (error) {
      console.error('Save user info error:', error);
    }
  },

  // Clear user info (logout)
  clearUserInfo() {
    try {
      this.globalData.userInfo = null;
      this.globalData.isLoggedIn = false;
      wx.removeStorageSync('userInfo');
      wx.removeStorageSync('token');
      console.log('✅ User logged out');
    } catch (error) {
      console.error('Clear user info error:', error);
    }
  }
});
