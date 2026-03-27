// pages/index/index.js - Stitch Design: Bento Grid
const app = getApp();

Page({
  data: {
    currentDate: '',
    wisdoms: [
      { text: '「万物并育而不相害，道并行而不相悖。科学放生，是智者的慈悲。」', source: '《放生智慧》' },
      { text: '「慈悲护生命，智慧选物种。科学来放生，福报自然来。」', source: '《护生录》' },
      { text: '「初一十五斋日，放生祈福好时机。如法如律，功德无量。」', source: '《佛门日历》' },
      { text: '「保护生态就是保护家园，科学放生就是真正行善。」', source: '《生态放生指南》' },
      { text: '「放生不放"生"，外来物种危害大。本地物种才是真慈悲。」', source: '《现代放生论》' }
    ]
  },

  onLoad() {
    this.loadDailyWisdom();
  },

  /**
   * 加载每日禅语
   */
  loadDailyWisdom() {
    const { wisdoms } = this.data;
    const today = new Date();
    const dayIndex = today.getDate() % wisdoms.length;
    const wisdom = wisdoms[dayIndex];
    
    // 格式化日期
    const lunarDate = this.formatLunarDate(today);
    
    this.setData({
      dailyWisdom: wisdom.text,
      wisdomSource: wisdom.source,
      currentDate: lunarDate
    });
  },

  /**
   * 格式化农历日期 (简化版)
   */
  formatLunarDate(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const heavenlyStems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    const earthlyBranches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
    
    // 简化计算 (实际应使用农历库)
    const stemIndex = (year - 4) % 10;
    const branchIndex = (year - 4) % 12;
    
    return `${heavenlyStems[stemIndex]}${earthlyBranches[branchIndex]}年 ${month}月${day}日`;
  },

  /**
   * 分享智慧
   */
  shareWisdom() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
    
    wx.showToast({
      title: '点击右上角分享',
      icon: 'none',
      duration: 2000
    });
  },

  /**
   * 导航跳转
   */
  goToSpecies() {
    wx.switchTab({
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
    wx.switchTab({
      url: '/pages/profile/profile'
    });
  },

  goToIndex() {
    // 已在首页，刷新数据
    this.loadDailyWisdom();
  },

  /**
   * 分享配置
   */
  onShareAppMessage() {
    return {
      title: '科学放生 - 生灵守护',
      path: '/pages/index/index',
      imageUrl: '/images/share/wisdom.jpg'
    };
  }
});
