// pages/achievements/achievements.js - 成就系统页面
const app = getApp();
const feedback = require('../../utils/feedback');

Page({
  data: {
    currentTab: 'all',
    userLevel: 1,
    currentExp: 0,
    nextLevelExp: 100,
    progressPercent: 0,
    achievements: []
  },

  onLoad() {
    this.loadAchievements();
    this.updateUserProgress();
  },

  onShow() {
    // 每次显示时刷新数据
    this.loadAchievements();
    this.updateUserProgress();
  },

  // 加载成就数据
  async loadAchievements() {
    try {
      const userInfo = app.globalData.userInfo;
      if (!userInfo) return;

      const res = await wx.request({
        url: `${app.globalData.apiBaseUrl}/achievements`,
        method: 'GET',
        data: {
          openid: userInfo.openid
        }
      });

      if (res.data.success) {
        this.setData({
          achievements: res.data.data || []
        });
      }
    } catch (error) {
      console.error('Load achievements error:', error);
      // 使用本地示例数据
      this.loadDemoAchievements();
    }
  },

  // 加载示例成就数据
  loadDemoAchievements() {
    const demoAchievements = [
      {
        id: 1,
        name: '初发行善',
        description: '完成第一次放生',
        icon: '🐟',
        category: 'species',
        unlocked: true,
        reward: 50,
        progress: null
      },
      {
        id: 2,
        name: '慈悲为怀',
        description: '累计放生 10 次',
        icon: '🙏',
        category: 'species',
        unlocked: false,
        reward: 200,
        current: 3,
        target: 10,
        progressPercent: 30
      },
      {
        id: 3,
        name: '功德无量',
        description: '累计获得 1000 功德值',
        icon: '✨',
        category: 'merit',
        unlocked: false,
        reward: 500,
        current: 350,
        target: 1000,
        progressPercent: 35
      },
      {
        id: 4,
        name: '护生使者',
        description: '放生 5 种不同物种',
        icon: '🌿',
        category: 'species',
        unlocked: false,
        reward: 300,
        current: 2,
        target: 5,
        progressPercent: 40
      },
      {
        id: 5,
        name: '日行一善',
        description: '连续 7 天放生',
        icon: '📅',
        category: 'special',
        unlocked: false,
        reward: 1000,
        current: 2,
        target: 7,
        progressPercent: 28
      },
      {
        id: 6,
        name: '善心居士',
        description: '累计放生 100 次',
        icon: '🪷',
        category: 'species',
        unlocked: false,
        reward: 2000,
        current: 3,
        target: 100,
        progressPercent: 3
      }
    ];

    this.setData({ achievements: demoAchievements });
  },

  // 更新用户进度
  updateUserProgress() {
    const userInfo = app.globalData.userInfo;
    if (!userInfo) return;

    const totalMerit = userInfo.totalMerit || 0;
    const level = Math.floor(totalMerit / 1000) + 1;
    const currentExp = totalMerit % 1000;
    const nextLevelExp = 1000;
    const progressPercent = (currentExp / nextLevelExp) * 100;

    this.setData({
      userLevel: level,
      currentExp: currentExp,
      nextLevelExp: nextLevelExp,
      progressPercent: progressPercent
    });
  },

  // 切换分类标签
  switchTab(e) {
    feedback.buttonTap();
    const tab = e.currentTarget.dataset.tab;
    this.setData({ currentTab: tab });

    // 过滤成就
    if (tab === 'all') {
      this.loadAchievements();
    } else {
      const filtered = this.data.achievements.filter(a => a.category === tab);
      this.setData({ achievements: filtered });
    }
  },

  // 查看成就详情
  viewAchievement(e) {
    feedback.buttonTap();
    const item = e.currentTarget.dataset.item;
    
    if (!item.unlocked) {
      wx.showToast({
        title: '尚未达成',
        icon: 'none',
        duration: 1500
      });
      return;
    }

    wx.showModal({
      title: item.name,
      content: `${item.description}\n\n功德奖励：+${item.reward}`,
      showCancel: false,
      confirmText: '随喜赞叹',
      confirmColor: '#C9B037'
    });
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.loadAchievements();
    this.updateUserProgress();
    wx.stopPullDownRefresh();
  }
});
