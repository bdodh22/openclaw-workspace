// pages/species-detail/species-detail.js
const app = getApp();

Page({
  data: {
    speciesId: null,
    species: {
      id: 1,
      name: '鲫鱼',
      scientificName: 'Carassius auratus',
      category: 'fish',
      isNative: true,
      habitat: '淡水湖泊、河流、池塘',
      releaseSeason: '春夏秋冬四季',
      releaseLocation: '江河湖泊、水库',
      precautions: '选择健康个体，避免放生到污染水域',
      imageUrl: ''
    }
  },

  onLoad(options) {
    if (options.id) {
      this.setData({ speciesId: options.id });
      this.loadSpeciesDetail(options.id);
    }
  },

  async loadSpeciesDetail(id) {
    // Mock data for development
    const mockData = {
      1: {
        id: 1,
        name: '鲫鱼',
        scientificName: 'Carassius auratus',
        category: 'fish',
        isNative: true,
        habitat: '淡水湖泊、河流、池塘',
        releaseSeason: '春夏秋冬四季',
        releaseLocation: '江河湖泊、水库',
        precautions: '选择健康个体，避免放生到污染水域。放生时轻柔放入水中，避免损伤鱼体。',
        imageUrl: '/images/species/ji.png'
      },
      2: {
        id: 2,
        name: '鲤鱼',
        scientificName: 'Cyprinus carpio',
        category: 'fish',
        isNative: true,
        habitat: '淡水水域',
        releaseSeason: '春季、秋季',
        releaseLocation: '江河、湖泊、水库',
        precautions: '避免放生到封闭小水域，需要足够活动空间。',
        imageUrl: '/images/species/li.png'
      },
      3: {
        id: 3,
        name: '巴西龟',
        scientificName: 'Trachemys scripta',
        category: 'turtle',
        isNative: false,
        habitat: '淡水水域',
        releaseSeason: '-',
        releaseLocation: '-',
        precautions: '外来入侵物种，严禁放生！',
        imageUrl: '/images/species/turtle.png'
      }
    };

    const species = mockData[id] || mockData[1];
    this.setData({ species });

    // Actual API call (uncomment in production)
    /*
    wx.request({
      url: `${app.globalData.apiBaseUrl}/species/${id}`,
      success: (res) => {
        if (res.data.success) {
          this.setData({ species: res.data.data });
        }
      }
    });
    */
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

  createCertificate() {
    wx.navigateTo({
      url: `/pages/certificate/certificate?speciesId=${this.data.speciesId}`
    });
  }
});
