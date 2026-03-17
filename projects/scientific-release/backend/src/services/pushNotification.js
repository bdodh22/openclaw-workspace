// backend/src/services/pushNotification.js
const axios = require('axios');

/**
 * 推送通知服务 - 用于发送斋日提醒、活动通知等
 */
class PushNotificationService {
  constructor() {
    this.appid = process.env.WECHAT_APPID || 'wxa914ecc15836bda6';
    this.secret = process.env.WECHAT_SECRET || '';
    this.accessToken = null;
    this.tokenExpiresAt = 0;
  }

  /**
   * 获取微信访问令牌
   */
  async getAccessToken() {
    const now = Date.now();
    
    // Return cached token if still valid
    if (this.accessToken && now < this.tokenExpiresAt) {
      return this.accessToken;
    }

    try {
      const res = await axios.get('https://api.weixin.qq.com/cgi-bin/token', {
        params: {
          grant_type: 'client_credential',
          appid: this.appid,
          secret: this.secret
        }
      });

      if (res.data.access_token) {
        this.accessToken = res.data.access_token;
        this.tokenExpiresAt = now + (res.data.expires_in - 300) * 1000; // Refresh 5min early
        console.log('✅ Access token refreshed');
        return this.accessToken;
      } else {
        throw new Error(`Get access token failed: ${res.data.errmsg}`);
      }
    } catch (error) {
      console.error('Get access token error:', error);
      throw error;
    }
  }

  /**
   * 发送订阅消息
   * @param {string} openid - 用户 openid
   * @param {string} templateId - 模板 ID
   * @param {object} data - 模板数据
   * @param {string} page - 跳转页面
   */
  async sendSubscriptionMessage(openid, templateId, data, page = 'pages/index/index') {
    try {
      const accessToken = await this.getAccessToken();

      const payload = {
        touser: openid,
        template_id: templateId,
        page: page,
        data: data,
        miniprogram_state: 'formal', // formal, trial, developer
        lang: 'zh_CN'
      };

      const res = await axios.post(
        `https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token=${accessToken}`,
        payload
      );

      if (res.data.errcode === 0) {
        console.log(`✅ Push notification sent to ${openid}`);
        return { success: true };
      } else {
        console.error(`Send notification failed: ${res.data.errmsg}`);
        return {
          success: false,
          error: res.data.errmsg
        };
      }
    } catch (error) {
      console.error('Send notification error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 发送斋日提醒
   * @param {object} user - 用户对象
   * @param {object} zhairi - 斋日信息
   */
  async sendZhairiReminder(user, zhairi) {
    const templateId = 'YOUR_ZHAIRI_TEMPLATE_ID'; // 需要在微信后台配置

    const data = {
      thing1: { value: zhairi.name }, // 斋日名称
      date2: { value: zhairi.date }, // 日期
      thing3: { value: zhairi.description } // 说明
    };

    return await this.sendSubscriptionMessage(
      user.openid,
      templateId,
      data,
      'pages/calendar/calendar'
    );
  }

  /**
   * 发送放生成功通知
   * @param {object} user - 用户对象
   * @param {object} certificate - 证书信息
   */
  async sendReleaseSuccess(user, certificate) {
    const templateId = 'YOUR_RELEASE_TEMPLATE_ID';

    const data = {
      thing1: { value: certificate.speciesName }, // 物种名称
      number2: { value: certificate.quantity }, // 数量
      time3: { value: new Date().toLocaleDateString('zh-CN') }, // 时间
      thing4: { value: `功德编号：${certificate.id}` } // 功德编号
    };

    return await this.sendSubscriptionMessage(
      user.openid,
      templateId,
      data,
      `pages/certificate/certificate?id=${certificate.id}`
    );
  }

  /**
   * 批量发送斋日提醒（定时任务调用）
   */
  async sendBatchZhairiReminders() {
    try {
      const { User } = require('../models');
      const CalendarService = require('./calendar');
      
      // Get tomorrow's zhairi
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const calendarService = new CalendarService();
      const zhairiList = await calendarService.getZhairiByDate(tomorrow);

      if (zhairiList.length === 0) {
        console.log('No zhairi tomorrow');
        return;
      }

      // Get all active users
      const users = await User.findAll({
        where: { status: 'active' }
      });

      console.log(`Sending zhairi reminders to ${users.length} users`);

      let successCount = 0;
      for (const user of users) {
        for (const zhairi of zhairiList) {
          const result = await this.sendZhairiReminder(user, zhairi);
          if (result.success) successCount++;
        }
        // Avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      console.log(`✅ Sent ${successCount} zhairi reminders`);
    } catch (error) {
      console.error('Batch send error:', error);
    }
  }
}

module.exports = PushNotificationService;
