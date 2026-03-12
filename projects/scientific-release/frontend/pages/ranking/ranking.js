// pages/ranking/ranking.js
import { showLoading, hideLoading, showError } from '../../utils/util.js';

const app = getApp();

Page({
  data: {
    currentTab: 'total',
    tabs: [
      { key: 'total', name: '总榜' },
      { key: 'month', name: '月榜' },
      { key: 'week', name: '周榜' }
    ],
    rankings: [],
    myRank: null,
    loading: false
  },

  onLoad() {
    this.loadRanking();
    this.loadMyRank();
  },

  onShow() {
    // 每次显示时刷新数据
  },

  async loadRanking() {
    this.setData({ loading: true });
    showLoading('加载中...');

    try {
      const { currentTab } = this.data;
      
      wx.request({
        url: `https://sf.dexoconnect.com/api/ranking/merit?type=${currentTab}&limit=50`,
        success: (res) => {
          if (res.data.success) {
            this.setData({
              rankings: res.data.data,
              loading: false
            });
            hideLoading();
          } else {
            hideLoading();
            showError('加载失败');
          }
        },
        fail: () => {
          this.setData({ loading: false });
          hideLoading();
          showError('网络错误');
        }
      });
    } catch (error) {
      console.error('Load ranking error:', error);
      this.setData({ loading: false });
      hideLoading();
    }
  },

  loadMyRank() {
    // TODO: 实际项目中从 app.globalData 获取 userId
    const myUserId = 1; // 临时测试
    
    wx.request({
      url: `https://sf.dexoconnect.com/api/ranking/user/${myUserId}`,
      success: (res) => {
        if (res.data.success) {
          this.setData({ myRank: res.data.data });
        }
      }
    });
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ currentTab: tab });
    this.loadRanking();
  },

  getRankIcon(rank) {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  },

  shareRanking() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
  },

  onShareAppMessage() {
    return {
      title: '我在科学放生功德榜排名第 1，一起来行善积福！',
      path: '/pages/ranking/ranking'
    };
  }
});
