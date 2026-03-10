// pages/species/species.js
const app = getApp();
const apiBaseUrl = app.globalData.apiBaseUrl;

Page({
  data: {
    speciesList: [],
    keyword: '',
    currentCategory: '',
    page: 1,
    limit: 20,
    loading: false,
    hasMore: true
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

    try {
      const { page, limit, currentCategory, keyword } = this.data;
      
      // Mock data for development (replace with actual API call)
      const mockData = [
        {
          id: 1,
          name: '鲫鱼',
          scientificName: 'Carassius auratus',
          category: 'fish',
          isNative: true,
          habitat: '淡水湖泊、河流、池塘',
          releaseSeason: '春夏秋冬四季',
          releaseLocation: '江河湖泊、水库',
          precautions: '选择健康个体，避免放生到污染水域'
        },
        {
          id: 2,
          name: '鲤鱼',
          scientificName: 'Cyprinus carpio',
          category: 'fish',
          isNative: true,
          habitat: '淡水水域',
          releaseSeason: '春季、秋季',
          releaseLocation: '江河、湖泊、水库',
          precautions: '避免放生到封闭小水域'
        },
        {
          id: 3,
          name: '乌龟',
          scientificName: 'Chinemys reevesii',
          category: 'turtle',
          isNative: true,
          habitat: '淡水水域',
          releaseSeason: '春季、夏季',
          releaseLocation: '江河、湖泊、池塘',
          precautions: '本地中华龟，非巴西龟'
        },
        {
          id: 4,
          name: '麻雀',
          scientificName: 'Passer montanus',
          category: 'bird',
          isNative: true,
          habitat: '城乡常见',
          releaseSeason: '春季、秋季',
          releaseLocation: '树林、公园',
          precautions: '选择健康个体，远离人类聚居区'
        }
      ];

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      this.setData({
        speciesList: this.data.page === 1 ? mockData : [...this.data.speciesList, ...mockData],
        loading: false,
        hasMore: false // For mock data
      });

      // Actual API call (uncomment in production)
      /*
      const url = `${apiBaseUrl}/species?page=${page}&limit=${limit}${currentCategory ? '&category=' + currentCategory : ''}${keyword ? '&keyword=' + keyword : ''}`;
      
      wx.request({
        url,
        success: (res) => {
          if (res.data.success) {
            const newList = this.data.page === 1 
              ? res.data.data 
              : [...this.data.speciesList, ...res.data.data];
            
            this.setData({
              speciesList: newList,
              loading: false,
              hasMore: res.data.pagination.page < res.data.pagination.totalPages
            });
          }
        },
        fail: () => {
          this.setData({ loading: false });
          wx.showToast({ title: '加载失败', icon: 'none' });
        }
      });
      */
    } catch (error) {
      console.error('Load species error:', error);
      this.setData({ loading: false });
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

  doSearch() {
    this.refresh();
  },

  selectCategory(e) {
    const category = e.currentTarget.dataset.category;
    this.setData({ currentCategory: category });
    this.refresh();
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
  }
});
