// pages/species/species.js
const app = getApp();
import { getSpeciesList, searchSpecies } from '../../utils/api.js';
import { showLoading, hideLoading, showError } from '../../utils/util.js';

Page({
  data: {
    speciesList: [],
    keyword: '',
    currentCategory: '',
    page: 1,
    limit: 20,
    loading: false,
    hasMore: true,
    categories: [
      { key: '', name: '全部', icon: '🌊' },
      { key: 'fish', name: '鱼类', icon: '🐟' },
      { key: 'bird', name: '鸟类', icon: '🐦' },
      { key: 'turtle', name: '龟类', icon: '🐢' },
      { key: 'mammal', name: '哺乳类', icon: '🦎' },
      { key: 'other', name: '其他', icon: '🌿' }
    ]
  },

  onLoad() {
    this.loadSpecies();
  },

  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.loadMore();
    }
  },

  onPullDownRefresh() {
    this.refresh();
  },

  async loadSpecies() {
    this.setData({ loading: true });
    showLoading('加载中...');

    try {
      const { page, limit, currentCategory } = this.data;
      
      const res = await getSpeciesList(page, limit);
      
      const newList = this.data.page === 1 
        ? res.data 
        : [...this.data.speciesList, ...res.data];
      
      this.setData({
        speciesList: newList,
        loading: false,
        hasMore: res.pagination.page < res.pagination.totalPages
      });
      
      hideLoading();
    } catch (error) {
      console.error('Load species error:', error);
      this.setData({ loading: false });
      hideLoading();
      showError('加载失败，请重试');
    }
  },

  loadMore() {
    this.setData({ page: this.data.page + 1 });
    this.loadSpecies();
  },

  refresh() {
    this.setData({ page: 1, speciesList: [] });
    this.loadSpecies().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  onSearchInput(e) {
    this.setData({ keyword: e.detail.value });
  },

  async doSearch() {
    if (!this.data.keyword.trim()) {
      this.refresh();
      return;
    }

    showLoading('搜索中...');
    
    try {
      const res = await searchSpecies(this.data.keyword);
      this.setData({
        speciesList: res.data,
        hasMore: false
      });
      hideLoading();
    } catch (error) {
      hideLoading();
      showError('搜索失败');
    }
  },

  selectCategory(e) {
    const category = e.currentTarget.dataset.category;
    this.setData({ 
      currentCategory: category,
      page: 1,
      speciesList: []
    });
    this.loadSpecies();
  },

  goToDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/species-detail/species-detail?id=${id}`
    });
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
  }
});
