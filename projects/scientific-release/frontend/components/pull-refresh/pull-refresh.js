// components/pull-refresh/pull-refresh.js
Component({
  properties: {
    pulling: {
      type: Boolean,
      value: false
    },
    refresh: {
      type: Boolean,
      value: false
    },
    refreshHeight: {
      type: Number,
      value: 120
    }
  },

  data: {
    refreshText: '下拉刷新'
  },

  observers: {
    pulling(pulling) {
      if (pulling) {
        this.setData({ refreshText: '释放刷新' });
      } else if (!this.data.refresh) {
        this.setData({ refreshText: '下拉刷新' });
      }
    },
    refresh(refresh) {
      if (refresh) {
        this.setData({ refreshText: '正在刷新...' });
      }
    }
  },

  methods: {}
});
