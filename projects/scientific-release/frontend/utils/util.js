// frontend/utils/util.js
// 通用工具函数

/**
 * 触觉反馈（Haptic Feedback）
 * type: 'light' | 'medium' | 'heavy'
 */
export function hapticFeedback(type = 'light') {
  try {
    wx.vibrateShort({
      type: type,
      fail: () => {
        // 忽略失败（部分设备可能不支持）
      }
    });
  } catch (e) {
    // 静默失败
  }
}

/**
 * 格式化日期
 */
export function formatDate(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 格式化时间
 */
export function formatTime(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hour = String(d.getHours()).padStart(2, '0');
  const minute = String(d.getMinutes()).padStart(2, '0');
  const second = String(d.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

/**
 * 生成证书编号
 */
export function generateCertificateNo() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `SR${timestamp}${String(random).padStart(4, '0')}`;
}

/**
 * 防抖函数
 */
export function debounce(fn, delay = 300) {
  let timer = null;
  return function(...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

/**
 * 显示加载提示
 */
export function showLoading(title = '加载中...') {
  wx.showLoading({
    title,
    mask: true
  });
}

/**
 * 隐藏加载提示
 */
export function hideLoading() {
  wx.hideLoading();
}

/**
 * 显示成功提示
 */
export function showSuccess(title) {
  wx.showToast({
    title,
    icon: 'success'
  });
}

/**
 * 显示错误提示
 */
export function showError(title) {
  wx.showToast({
    title,
    icon: 'none',
    duration: 2000
  });
}

export default {
  formatDate,
  formatTime,
  generateCertificateNo,
  debounce,
  showLoading,
  hideLoading,
  showSuccess,
  showError
};
