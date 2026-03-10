// pages/index/index.js
const app = getApp();

Page({
  data: {
    dailyWisdom: '放生须如法，物种要本地。盲目放外来，不仅无功还有过。',
    notices: [
      {
        icon: '⚠️',
        text: '请勿放生外来物种，违法可能面临罚款'
      },
      {
        icon: '✅',
        text: '选择本地物种，科学放生才能真正积福'
      }
    ]
  },

  onLoad() {
    // Load daily wisdom
    this.loadDailyWisdom();
  },

  onShow() {
    // Check login status
    if (app.globalData.isLoggedIn) {
      console.log('User is logged in');
    }
  },

  loadDailyWisdom() {
    // In production, fetch from backend
    const wisdoms = [
      '放生须如法，物种要本地。盲目放外来，不仅无功还有过。',
      '慈悲护生命，智慧选物种。科学来放生，福报自然来。',
      '初一十五斋日，放生祈福好时机。如法如律，功德无量。',
      '保护生态就是保护家园，科学放生就是真正行善。',
      '放生不放“生”，外来物种危害大。本地物种才是真慈悲。'
    ];
    
    const today = new Date().getDate();
    const wisdom = wisdoms[today % wisdoms.length];
    this.setData({ dailyWisdom: wisdom });
  },

  goToSpecies() {
    wx.switchTab({
      url: '/pages/species/species'
    });
  },

  goToCertificate() {
    wx.switchTab({
      url: '/pages/certificate/certificate'
    });
  },

  goToCalendar() {
    wx.navigateTo({
      url: '/pages/calendar/calendar'
    });
  },

  goToKnowledge() {
    wx.navigateTo({
      url: '/pages/knowledge/knowledge'
    });
  }
});
