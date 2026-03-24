// pages/certificate/certificate.js - 集成触觉反馈和成功动画
import { createCertificate, getSpeciesList } from '../../utils/api.js';
import { showLoading, hideLoading, showSuccess, showError, generateCertificateNo, hapticFeedback } from '../../utils/util.js';

const app = getApp();

Page({
  data: {
    showSuccessAnimation: false,
    showPreview: false,
    meritNumber: '',
    speciesOptions: [],
    speciesIndex: -1,
    selectedSpecies: null,
    blessingText: '',
    releaseLocation: '',
    releaseDate: new Date().toISOString().split('T')[0],
    userName: '',
    currentDate: '',
    certificateList: [],
    userInfo: null
  },

  onLoad(options) {
    // 加载物种列表
    this.loadSpeciesList();
    
    // 获取用户信息
    this.loadUserInfo();
    
    // 加载证书列表
    this.loadCertificateList();
    
    // 设置当前日期
    const now = new Date();
    this.setData({
      currentDate: `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`
    });
    
    // 生成功德编号
    this.setData({
      meritNumber: generateCertificateNo()
    });
  },

  async loadSpeciesList() {
    showLoading('加载中...');
    
    try {
      const res = await getSpeciesList(1, 50);
      const speciesList = res.data || res.list || [];
      this.setData({
        speciesOptions: speciesList,
        speciesIndex: 0
      });
      if (speciesList.length > 0) {
        this.setData({ selectedSpecies: speciesList[0] });
      }
      hideLoading();
    } catch (error) {
      hideLoading();
      // 加载失败时使用默认数据
      this.setData({
        speciesOptions: [
          { id: 1, name: '鲫鱼' },
          { id: 2, name: '鲤鱼' },
          { id: 3, name: '泥鳅' }
        ]
      });
    }
  },

  loadUserInfo() {
    // 从 app.globalData 获取用户信息
    const userInfo = app.globalData?.userInfo || {
      nickname: '善信',
      avatarUrl: ''
    };
    this.setData({
      userInfo,
      userName: userInfo.nickname || '善信'
    });
  },

  loadCertificateList() {
    const key = 'user_certificates';
    const certificates = wx.getStorageSync(key) || [];
    this.setData({ certificateList: certificates });
  },

  onSpeciesChange(e) {
    const index = parseInt(e.detail.value);
    const species = this.data.speciesOptions[index];
    this.setData({
      speciesIndex: index,
      selectedSpecies: species
    });
  },

  onBlessingInput(e) {
    this.setData({
      blessingText: e.detail.value
    });
  },

  onLocationInput(e) {
    this.setData({
      releaseLocation: e.detail.value
    });
  },

  onDateChange(e) {
    this.setData({
      releaseDate: e.detail.value
    });
  },

  async generateCertificate() {
    const { selectedSpecies, blessingText, releaseLocation, releaseDate } = this.data;
    
    if (!selectedSpecies) {
      showError('请选择物种');
      return;
    }
    
    if (!releaseLocation) {
      showError('请填写放生地点');
      return;
    }

    showLoading('生成中...');

    try {
      const certificateNo = generateCertificateNo();
      
      // 模拟生成成功
      await new Promise(resolve => setTimeout(resolve, 800));
      
      hideLoading();
      
      // 触觉反馈
      hapticFeedback('medium');
      
      showSuccess('祈福证书生成成功！');
      
      // 保存到证书列表
      this.saveCertificate({
        id: Date.now(),
        certificateNo,
        species: selectedSpecies,
        blessingText,
        releaseLocation,
        releaseDate,
        meritPoints: 100,
        createTime: new Date().toISOString()
      });

      // 显示预览
      this.setData({ showPreview: true });
      
      // 滚动到预览区域
      wx.pageScrollTo({
        scrollTop: 1000,
        duration: 300
      });
    } catch (error) {
      hideLoading();
      showError('生成失败，请重试');
    }
  },

  saveCertificate(certificate) {
    const key = 'user_certificates';
    const certificates = wx.getStorageSync(key) || [];
    certificates.unshift(certificate);
    wx.setStorageSync(key, certificates);
    this.setData({ certificateList: certificates });
  },

  shareToFriends() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
    showSuccess('点击右上角分享');
  },

  saveCertificate() {
    // TODO: 实现证书保存为图片
    showSuccess('保存功能开发中...');
  },

  viewCertificate(e) {
    const id = e.currentTarget.dataset.id;
    // TODO: 查看详情
    showSuccess('查看证书详情');
  }
});
