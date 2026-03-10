// pages/certificate/certificate.js
import { createCertificate, getSpeciesDetail } from '../../utils/api.js';
import { showLoading, hideLoading, showSuccess, showError, generateCertificateNo } from '../../utils/util.js';

const app = getApp();

Page({
  data: {
    speciesId: null,
    species: null,
    blessingText: '',
    releaseLocation: '',
    releaseDate: new Date().toISOString().split('T')[0],
    userInfo: null
  },

  onLoad(options) {
    if (options.speciesId) {
      this.setData({ speciesId: options.speciesId });
      this.loadSpeciesDetail(options.speciesId);
    }
    
    // 获取用户信息（模拟）
    this.loadUserInfo();
  },

  async loadSpeciesDetail(id) {
    showLoading('加载中...');
    
    try {
      const res = await getSpeciesDetail(id);
      this.setData({ species: res.data });
      hideLoading();
    } catch (error) {
      hideLoading();
      showError('加载物种信息失败');
    }
  },

  loadUserInfo() {
    // TODO: 实际项目中从 app.globalData 获取
    this.setData({
      userInfo: {
        nickname: '善信',
        avatarUrl: ''
      }
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

  async submitCertificate() {
    const { species, blessingText, releaseLocation, releaseDate } = this.data;
    
    if (!species) {
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
      
      // TODO: 实际项目中调用 API
      // const res = await createCertificate({
      //   speciesId: species.id,
      //   blessingText,
      //   releaseLocation,
      //   releaseDate,
      //   certificateNo
      // });

      // 模拟生成成功
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      hideLoading();
      showSuccess('祈福证书生成成功！');
      
      // 保存到证书列表（本地存储）
      this.saveCertificate({
        certificateNo,
        species,
        blessingText,
        releaseLocation,
        releaseDate,
        createTime: new Date().toISOString()
      });

      // 显示证书预览
      this.showCertificatePreview({
        certificateNo,
        species,
        blessingText,
        releaseLocation,
        releaseDate
      });
    } catch (error) {
      hideLoading();
      showError('生成失败，请重试');
    }
  },

  saveCertificate(certificate) {
    // 本地存储证书
    const key = 'user_certificates';
    const certificates = wx.getStorageSync(key) || [];
    certificates.unshift(certificate);
    wx.setStorageSync(key, certificates);
  },

  showCertificatePreview(data) {
    // 跳转到证书预览页或显示预览
    wx.navigateTo({
      url: `/pages/certificate/certificate-preview?data=${encodeURIComponent(JSON.stringify(data))}`
    });
  },

  chooseSpecies() {
    wx.navigateTo({
      url: '/pages/species/species'
    });
  }
});
