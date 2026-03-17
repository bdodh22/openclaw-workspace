// utils/feedback.js - 触觉反馈和声音效果工具

/**
 * 触觉反馈类型
 * light: 轻微反馈（适用于轻触）
 * medium: 中等反馈（适用于按钮点击）
 * heavy: 强烈反馈（适用于重要操作）
 * success: 成功反馈
 * warning: 警告反馈
 * error: 错误反馈
 */
const FeedbackType = {
  LIGHT: 'light',
  MEDIUM: 'medium',
  HEAVY: 'heavy',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error'
};

/**
 * 触发触觉反馈
 * @param {string} type - 反馈类型
 */
function vibrate(type = FeedbackType.MEDIUM) {
  try {
    if (!wx.vibrateShort) return;
    
    const typeMap = {
      [FeedbackType.LIGHT]: { type: 'light' },
      [FeedbackType.MEDIUM]: { type: 'medium' },
      [FeedbackType.HEAVY]: { type: 'heavy' },
      [FeedbackType.SUCCESS]: { type: 'medium' },
      [FeedbackType.WARNING]: { type: 'medium' },
      [FeedbackType.ERROR]: { type: 'heavy' }
    };
    
    wx.vibrateShort(typeMap[type] || typeMap[FeedbackType.MEDIUM]);
  } catch (error) {
    console.error('Vibrate error:', error);
  }
}

/**
 * 成功反馈（触觉 + 声音）
 */
function successFeedback() {
  vibrate(FeedbackType.SUCCESS);
  playSound('success');
}

/**
 * 错误反馈（触觉 + 声音）
 */
function errorFeedback() {
  vibrate(FeedbackType.ERROR);
  playSound('error');
}

/**
 * 播放音效
 * @param {string} type - 音效类型：success, error, click, water, bell
 */
function playSound(type) {
  try {
    // 检查用户是否启用声音
    const soundEnabled = wx.getStorageSync('soundEnabled') !== false;
    if (!soundEnabled) return;
    
    const soundMap = {
      success: '/sounds/success.mp3',
      error: '/sounds/error.mp3',
      click: '/sounds/click.mp3',
      water: '/sounds/water.mp3',
      bell: '/sounds/bell.mp3' // 引磬声
    };
    
    const soundPath = soundMap[type];
    if (!soundPath) return;
    
    const innerAudioContext = wx.createInnerAudioContext();
    innerAudioContext.src = soundPath;
    innerAudioContext.volume = 0.5;
    innerAudioContext.play();
    
    // 自动释放资源
    innerAudioContext.onEnded(() => {
      innerAudioContext.destroy();
    });
  } catch (error) {
    console.error('Play sound error:', error);
  }
}

/**
 * 按钮点击反馈
 */
function buttonTap() {
  vibrate(FeedbackType.LIGHT);
  playSound('click');
}

/**
 * 切换声音开关状态
 */
function toggleSound() {
  const current = wx.getStorageSync('soundEnabled') !== false;
  wx.setStorageSync('soundEnabled', !current);
  return !current;
}

/**
 * 获取声音开关状态
 */
function isSoundEnabled() {
  return wx.getStorageSync('soundEnabled') !== false;
}

module.exports = {
  FeedbackType,
  vibrate,
  playSound,
  successFeedback,
  errorFeedback,
  buttonTap,
  toggleSound,
  isSoundEnabled
};
