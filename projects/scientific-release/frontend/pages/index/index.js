// pages/index/index.js - Modern Zen Design
const app = getApp();

Page({
  data: {
    dailyWisdom: '放生须如法，物种要本地。盲目放外来，不仅无功还有过。',
    wisdomSource: '《放生智慧》',
    notices: [
      {
        icon: '⚠️',
        text: '请勿放生外来物种，违法可能面临罚款',
        time: '法律法规'
      },
      {
        icon: '✅',
        text: '选择本地物种，科学放生才能真正积福',
        time: '生态友好'
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
      { text: '放生须如法，物种要本地。盲目放外来，不仅无功还有过。', source: '《放生智慧》' },
      { text: '慈悲护生命，智慧选物种。科学来放生，福报自然来。', source: '《护生录》' },
      { text: '初一十五斋日，放生祈福好时机。如法如律，功德无量。', source: '《佛门日历》' },
      { text: '保护生态就是保护家园，科学放生就是真正行善。', source: '《生态放生指南》' },
      { text: '放生不放"生"，外来物种危害大。本地物种才是真慈悲。', source: '《现代放生论》' },
      { text: '万物有灵，众生平等。以智导行，以慈养心。', source: '《禅门法语》' },
      { text: '真正的放生，是放下执着，释放慈悲。', source: '《心经释义》' }
    ];
    
    const today = new Date().getDate();
    const wisdom = wisdoms[today % wisdoms.length];
    this.setData({ 
      dailyWisdom: wisdom.text,
      wisdomSource: wisdom.source
    });
  },

  goToSpecies() {
    wx.navigateTo({
      url: '/pages/species/species'
    });
  },

  goToCertificate() {
    wx.navigateTo({
      url: '/pages/certificate/certificate'
    });
  },

  goToCalendar() {
    wx.navigateTo({
      url: '/pages/calendar/calendar'
    });
  },

  goToRanking() {
    wx.navigateTo({
      url: '/pages/ranking/ranking'
    });
  },

  goToProfile() {
    wx.navigateTo({
      url: '/pages/profile/profile'
    });
  }
});
