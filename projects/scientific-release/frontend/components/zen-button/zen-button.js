// components/zen-button/zen-button.js
const feedback = require('../../utils/feedback');

Component({
  properties: {
    text: {
      type: String,
      value: '按钮'
    },
    icon: {
      type: String,
      value: ''
    },
    type: {
      type: String,
      value: 'primary', // primary, secondary, outline, ghost
      observer: 'onTypeChange'
    },
    size: {
      type: String,
      value: 'medium' // small, medium, large
    },
    disabled: {
      type: Boolean,
      value: false
    },
    loading: {
      type: Boolean,
      value: false
    }
  },

  methods: {
    onTap() {
      if (this.data.disabled || this.data.loading) {
        feedback.vibrate(feedback.FeedbackType.ERROR);
        return;
      }

      // 触觉反馈 + 音效
      feedback.buttonTap();

      // 触发事件
      this.triggerEvent('tap', {}, {
        bubbles: false,
        composed: true
      });
    },

    onTypeChange(newType) {
      // 类型变化时的处理
      console.log('Button type changed to:', newType);
    }
  }
});
