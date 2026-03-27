// pages/species/species.js - Stitch Design: 集成后端 API
const app = getApp();
import { getSpeciesList, searchSpecies } from '../../utils/api.js';

Page({
  data: {
    speciesList: [],
    keyword: '',
    currentCategory: '',
    loading: false,
    categories: [
      { key: '', name: '全部' },
      { key: 'fish', name: '鱼类' },
      { key: 'bird', name: '鸟类' },
      { key: 'turtle', name: '龟类' },
      { key: 'mammal', name: '哺乳类' },
      { key: 'other', name: '其他' }
    ]
  },

  onLoad() {
    this.loadSpecies();
  },

  onPullDownRefresh() {
    this.refresh();
  },

  /**
   * 加载物种列表 - 调用后端 API
   */
  async loadSpecies() {
    this.setData({ loading: true });
    
    try {
      const { currentCategory, keyword } = this.data;
      
      // 调用后端 API
      const res = await getSpeciesList(1, 50);
      
      let speciesData = res.data || [];
      
      // 处理图片 URL - 拼接完整域名
      const baseUrl = app.globalData.apiBaseUrl || 'https://sf.dexoconnect.com';
      speciesData = speciesData.map(item => ({
        ...item,
        imageUrl: item.imageUrl ? 
          (item.imageUrl.startsWith('http') ? item.imageUrl : baseUrl + item.imageUrl) 
          : '/images/species/default.png'
      }));
      
      // 分类过滤
      if (currentCategory) {
        speciesData = speciesData.filter(item => item.category === this.getCategoryKey(currentCategory));
      }
      
      // 搜索过滤
      if (keyword && keyword.trim()) {
        speciesData = speciesData.filter(item => 
          item.name.includes(keyword) || 
          item.scientificName?.toLowerCase().includes(keyword.toLowerCase())
        );
      }
      
      this.setData({
        speciesList: speciesData,
        loading: false
      });
      
    } catch (error) {
      console.error('Load species error:', error);
      this.setData({ loading: false });
      
      wx.showToast({
        title: '加载失败，请重试',
        icon: 'none',
        duration: 2000
      });
    }
  },

  /**
   * 刷新数据
   */
  refresh() {
    this.setData({ 
      page: 1, 
      speciesList: [],
      keyword: '',
      currentCategory: ''
    });
    
    this.loadSpecies().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  /**
   * 搜索输入
   */
  onSearchInput(e) {
    this.setData({ keyword: e.detail.value });
  },

  /**
   * 执行搜索
   */
  async doSearch() {
    const { keyword } = this.data;
    
    if (!keyword.trim()) {
      this.refresh();
      return;
    }

    wx.showLoading({ title: '搜索中...', mask: true });
    
    try {
      const res = await searchSpecies(keyword);
      this.setData({
        speciesList: res.data || []
      });
      wx.hideLoading();
    } catch (error) {
      wx.hideLoading();
      wx.showToast({
        title: '搜索失败',
        icon: 'none'
      });
    }
  },

  /**
   * 选择分类
   */
  selectCategory(e) {
    const category = e.currentTarget.dataset.category;
    this.setData({ 
      currentCategory: category,
      speciesList: []
    });
    this.loadSpecies();
  },

  /**
   * 跳转到详情页
   */
  goToDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/species-detail/species-detail?id=${id}`
    });
  },

  /**
   * 跳转导航
   */
  goToIndex() {
    wx.switchTab({
      url: '/pages/index/index'
    });
  },

  goToCertificate() {
    wx.navigateTo({
      url: '/pages/certificate/certificate'
    });
  },

  goToProfile() {
    wx.navigateTo({
      url: '/pages/profile/profile'
    });
  },

  /**
   * 分类名称映射
   */
  getCategoryKey(category) {
    const mapping = {
      'fish': '鱼类',
      'bird': '鸟类',
      'turtle': '龟类',
      'mammal': '哺乳类',
      'other': '其他'
    };
    return mapping[category] || category;
  }
});
