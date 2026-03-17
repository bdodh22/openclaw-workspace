// backend/src/services/notify.js - 推送通知服务

const axios = require('axios');

/**
 * 微信订阅消息推送
 * 需要在微信后台配置模板 ID
 */
class NotificationService {
  constructor() {
    this.accessToken = null;
    this.tokenExpiresAt = 0;
    this.appId = process.env.WECHAT_APPID;
    this.secret = process.env.WECHAT_SECRET;
  }

  /**
   * 获取 access_token
   */
  async getAccessToken() {
    // 检查 token 是否过期
    if (this.accessToken && Date.now() < this.tokenExpiresAt) {
      return this.accessToken;
    }

    try {
      const res = await axios.get('https://api.weixin.qq.com/cgi-bin/token', {
        params: {
          grant_type: 'client_credential',
          appid: this.appId,
          secret: this.secret
        }
      });

      if (res.data.access_token) {
        this.accessToken = res.data.access_token;
        // 提前 5 分钟过期
        this.tokenExpiresAt = Date.now() + (res.data.expires_in - 300) * 1000;
        return this.accessToken;
      } else {
        throw new Error(`Get access_token failed: ${res.data.errmsg}`);
      }
    } catch (error) {
      console.error('Get access_token error:', error);
      throw error;
    }
  }

  /**
   * 发送订阅消息
   * @param {string} openid - 用户 openid
   * @param {string} templateId - 模板 ID
   * @param {Object} data - 模板数据
   * @param {string} page - 跳转页面
   */
  async sendSubscribeMessage(openid, templateId, data, page = '') {
    try {
      const token = await this.getAccessToken();

      const payload = {
        touser: openid,
        template_id: templateId,
        page: page,
        data: data,
        miniprogram_state: 'formal', // formal/trial
        lang: 'zh_CN'
      };

      const res = await axios.post(
        `https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token=${token}`,
        payload
      );

      if (res.data.errcode === 0) {
        console.log('✅ Subscribe message sent to:', openid);
        return { success: true };
      } else {
        console.error('Send subscribe message failed:', res.data);
        return {
          success: false,
          error: res.data.errmsg,
          errorCode: res.data.errcode
        };
      }
    } catch (error) {
      console.error('Send subscribe message error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 发送放生成功通知
   */
  async sendReleaseSuccess(openid, speciesName, meritPoints, certificateNo) {
    return this.sendSubscribeMessage(
      openid,
      process.env.TEMPLATE_RELEASE_SUCCESS, // 需要在微信后台配置
      {
        thing1: { value: speciesName },
        thing2: { value: '放生成功，功德无量' },
        amount3: { value: meritPoints.toString() },
        thing4: { value: certificateNo }
      },
      'pages/certificate/certificate'
    );
  }

  /**
   * 发送佛历斋戒日提醒
   */
  async sendCalendarReminder(openid, date, event) {
    return this.sendSubscribeMessage(
      openid,
      process.env.TEMPLATE_CALENDAR_REMINDER,
      {
        thing1: { value: event },
        time2: { value: date },
        thing3: { value: '宜放生、祈福、行善' }
      },
      'pages/calendar/calendar'
    );
  }

  /**
   * 发送成就达成通知
   */
  async sendAchievementUnlocked(openid, achievementName, rewardPoints) {
    return this.sendSubscribeMessage(
      openid,
      process.env.TEMPLATE_ACHIEVEMENT,
      {
        thing1: { value: achievementName },
        thing2: { value: '恭喜达成成就' },
        amount3: { value: `+${rewardPoints}` }
      },
      'pages/achievements/achievements'
    );
  }

  /**
   * 批量发送通知
   */
  async sendBatch(openidList, templateId, data, page) {
    const results = [];
    
    for (const openid of openidList) {
      const result = await this.sendSubscribeMessage(openid, templateId, data, page);
      results.push({ openid, ...result });
      
      // 避免频率限制
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    return results;
  }
}

module.exports = new NotificationService();
