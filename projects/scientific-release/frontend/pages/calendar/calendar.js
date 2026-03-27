// pages/calendar/calendar.js - Stitch Design: 佛历日历
const app = getApp();

Page({
  data: {
    currentYear: 2024,
    currentMonth: 5,
    currentDay: 24,
    lunarDate: '农历四月十七',
    ganzhiYear: '甲辰',
    zodiac: '龙',
    englishMonth: 'MAY',
    vegetarianDays: [1, 8, 14, 15, 18, 23, 24, 28, 29, 30], // 十斋日
    sixVegetarianDays: [8, 14, 23, 29, 30] // 六斋日
  },

  onLoad() {
    this.initDate();
  },

  /**
   * 初始化日期
   */
  initDate() {
    const now = new Date();
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    
    this.setData({
      currentYear: now.getFullYear(),
      currentMonth: now.getMonth() + 1,
      currentDay: now.getDate(),
      englishMonth: months[now.getMonth()]
    });
  },

  /**
   * 上个月
   */
  prevMonth() {
    let { currentYear, currentMonth } = this.data;
    
    if (currentMonth === 1) {
      currentMonth = 12;
      currentYear--;
    } else {
      currentMonth--;
    }
    
    this.setData({ currentYear, currentMonth });
  },

  /**
   * 下个月
   */
  nextMonth() {
    let { currentYear, currentMonth } = this.data;
    
    if (currentMonth === 12) {
      currentMonth = 1;
      currentYear++;
    } else {
      currentMonth++;
    }
    
    this.setData({ currentYear, currentMonth });
  },

  /**
   * 选择日期
   */
  selectDay(e) {
    const day = e.currentTarget.dataset.day;
    const { currentYear, currentMonth } = this.data;
    
    wx.showModal({
      title: `${currentYear}年${currentMonth}月${day}日`,
      content: '详情功能开发中...',
      showCancel: false
    });
  },

  /**
   * 添加放生记录
   */
  addRelease() {
    wx.navigateTo({
      url: '/pages/certificate/certificate'
    });
  },

  /**
   * 导航跳转
   */
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
  },

  goToProfile() {
    wx.switchTab({
      url: '/pages/profile/profile'
    });
  }
});
