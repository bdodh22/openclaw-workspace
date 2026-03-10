// pages/species-detail/species-detail.js
import { getSpeciesDetail } from '../../utils/api.js';
import { showLoading, hideLoading, showError } from '../../utils/util.js';

Page({
  data: {
    speciesId: null,
    species: null,
    loading: true
  },

  onLoad(options) {
    if (options.id) {
      this.setData({ speciesId: options.id });
      this.loadSpeciesDetail(options.id);
    }
  },

  async loadSpeciesDetail(id) {
    showLoading('加载中...');
    
    try {
      const res = await getSpeciesDetail(id);
      this.setData({
        species: res.data,
        loading: false
      });
      hideLoading();
    } catch (error) {
      console.error('Load species detail error:', error);
      hideLoading();
      showError('加载失败');
    }
  },

  getCategoryName(category) {
    const names = {
      fish: '鱼类',
      bird: '鸟类',
      turtle: '龟类',
      mammal: '哺乳类',
      other: '其他'
    };
    return names[category] || '其他';
  },

  getCategoryIcon(category) {
    const icons = {
      fish: '🐟',
      bird: '🐦',
      turtle: '🐢',
      mammal: '🦎',
      other: '🌿'
    };
    return icons[category] || '🌿';
  },

  createCertificate() {
    wx.navigateTo({
      url: `/pages/certificate/certificate?speciesId=${this.data.speciesId}`
    });
  },

  shareSpecies() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
  },

  onShareAppMessage() {
    const species = this.data.species;
    return {
      title: `${species.name} - 科学放生`,
      path: `/pages/species-detail/species-detail?id=${species.id}`
    };
  }
});
