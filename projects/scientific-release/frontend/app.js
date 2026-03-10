// app.js
App({
  onLaunch() {
    // Initialize when mini-program launches
    console.log('Scientific Release Mini-Program launched');
    
    // Check for updates
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager();
      updateManager.onCheckForUpdate((res) => {
        if (res.hasUpdate) {
          updateManager.onUpdateReady(() => {
            wx.showModal({
              title: 'Update Available',
              content: 'New version ready. Restart to apply?',
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
  },

  globalData: {
    userInfo: null,
    isLoggedIn: false,
    apiBaseUrl: 'https://your-domain.com/api', // Replace with your domain
    version: '1.0.0'
  }
});
