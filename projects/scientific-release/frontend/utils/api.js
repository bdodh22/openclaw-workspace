// frontend/utils/api.js
// API 配置和请求封装

// 生产环境配置
const BASE_URL = 'https://sf.dexoconnect.com/api';
// const BASE_URL = 'http://localhost:3000/api'; // 开发环境

/**
 * 封装 wx.request
 */
function request(options) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        ...options.header
      },
      success: (res) => {
        if (res.statusCode === 200 && res.data.success) {
          resolve(res.data);
        } else {
          wx.showToast({
            title: res.data.message || '请求失败',
            icon: 'none'
          });
          reject(res.data);
        }
      },
      fail: (err) => {
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        });
        reject(err);
      }
    });
  });
}

/**
 * 获取物种列表
 */
export function getSpeciesList(page = 1, limit = 20) {
  return request({
    url: '/species',
    data: { page, limit }
  });
}

/**
 * 获取物种详情
 */
export function getSpeciesDetail(id) {
  return request({
    url: `/species/${id}`
  });
}

/**
 * 搜索物种
 */
export function searchSpecies(keyword) {
  return request({
    url: '/species/search',
    data: { keyword }
  });
}

/**
 * 微信登录
 */
export function wxLogin(code) {
  return request({
    url: '/users/login',
    method: 'POST',
    data: { code }
  });
}

/**
 * 获取用户信息
 */
export function getUserInfo(openid) {
  return request({
    url: `/users/${openid}`
  });
}

/**
 * 生成祈福证书
 */
export function createCertificate(data) {
  return request({
    url: '/certificates',
    method: 'POST',
    data
  });
}

/**
 * 获取用户的证书列表
 */
export function getUserCertificates(openid, page = 1, limit = 10) {
  return request({
    url: '/certificates/user/' + openid,
    data: { page, limit }
  });
}

/**
 * 获取佛历信息
 */
export function getCalendarInfo(date) {
  return request({
    url: '/calendar',
    data: { date }
  });
}

export default {
  request,
  getSpeciesList,
  getSpeciesDetail,
  searchSpecies,
  wxLogin,
  getUserInfo,
  createCertificate,
  getUserCertificates,
  getCalendarInfo
};
