// pages/certificate/certificate.js - Stitch Design: 烫金证书
import { generateCertificateNo } from '../../utils/util.js';

const app = getApp();

Page({
  data: {
    userName: '善信',
    releaseDate: '',
    releaseLocation: '',
    speciesName: '',
    certificateNo: '',
    meritPoints: 0,
    showPreview: false
  },

  onLoad(options) {
    // 从参数获取证书数据，或使用 mock 数据
    if (options.id) {
      this.loadCertificate(options.id);
    } else {
      this.setMockData();
    }
  },

  /**
   * 加载证书数据
   */
  loadCertificate(id) {
    // TODO: 从 API 加载证书
    const certificates = wx.getStorageSync('user_certificates') || [];
    const cert = certificates.find(c => c.id === parseInt(id));
    
    if (cert) {
      this.setData({
        userName: cert.userName || '善信',
        releaseDate: cert.releaseDate,
        releaseLocation: cert.releaseLocation,
        speciesName: cert.species?.name || '物命',
        certificateNo: cert.certificateNo,
        meritPoints: cert.meritPoints || 100
      });
    } else {
      this.setMockData();
    }
  },

  /**
   * 设置 Mock 数据
   */
  setMockData() {
    const today = new Date();
    const dateStr = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;
    
    this.setData({
      userName: app.globalData.userInfo?.nickname || '李慕华',
      releaseDate: dateStr,
      releaseLocation: '西溪国家湿地公园',
      speciesName: '中华草龟',
      certificateNo: generateCertificateNo(),
      meritPoints: 880
    });
  },

  /**
   * 关闭证书
   */
  closeCertificate() {
    wx.navigateBack();
  },

  /**
   * 保存到相册
   */
  saveToAlbum() {
    wx.showLoading({ title: '生成中...', mask: true });
    
    // TODO: 使用 Canvas 绘制证书并保存
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({
        title: '保存功能开发中...',
        icon: 'none',
        duration: 2000
      });
    }, 800);
  },

  /**
   * 分享给好友
   */
  shareToFriends() {
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

  goToProfile() {
    wx.switchTab({
      url: '/pages/profile/profile'
    });
  },

  /**
   * 分享配置
   */
  onShareAppMessage() {
    return {
      title: `我在科学放生获得功德证书，福报 +${this.data.meritPoints}`,
      path: `/pages/certificate/certificate?id=${this.data.certificateNo}`,
      imageUrl: '/images/share/certificate.jpg'
    };
  }
});
