// backend/src/routes/user.js
const express = require('express');
const router = express.Router();
const { User } = require('../models');
const crypto = require('crypto');
const axios = require('axios');

// WeChat API endpoints
const WECHAT_AUTH_URL = 'https://api.weixin.qq.com/sns/jscode2session';
const WECHAT_USER_INFO_URL = 'https://api.weixin.qq.com/cgi-bin/user/info';

// POST /api/users/login - WeChat login
router.post('/login', async (req, res, next) => {
  try {
    const { code, encryptedData, iv } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        error: 'WeChat code is required'
      });
    }

    // Step 1: Exchange code for session_key and openid
    const appConfig = {
      appid: process.env.WECHAT_APPID || 'wxa914ecc15836bda6',
      secret: process.env.WECHAT_SECRET || ''
    };

    const authRes = await axios.get(WECHAT_AUTH_URL, {
      params: {
        appid: appConfig.appid,
        secret: appConfig.secret,
        js_code: code,
        grant_type: 'authorization_code'
      }
    });

    const { openid, unionid, session_key } = authRes.data;

    if (authRes.data.errcode) {
      return res.status(400).json({
        success: false,
        error: `WeChat auth failed: ${authRes.data.errmsg}`
      });
    }

    // Step 2: Decrypt encryptedData to get userInfo (if provided)
    let userInfo = {};
    if (encryptedData && iv && session_key) {
      userInfo = decryptWeChatData(encryptedData, session_key, iv);
    }

    // Step 3: Create or update user
    let user = await User.findOne({ where: { openid } });

    if (user) {
      // Update existing user
      if (userInfo.nickName) user.nickname = userInfo.nickName;
      if (userInfo.avatarUrl) user.avatarUrl = userInfo.avatarUrl;
      if (unionid) user.unionid = unionid;
      await user.save();
    } else {
      // Create new user
      user = await User.create({
        openid,
        unionid,
        nickname: userInfo.nickName || '善心居士',
        avatarUrl: userInfo.avatarUrl || '',
        totalReleases: 0,
        totalMerit: 0,
        status: 'active'
      });
    }

    // Return user data (exclude sensitive fields)
    const userData = {
      id: user.id,
      openid: user.openid,
      unionid: user.unionid,
      nickname: user.nickname,
      avatarUrl: user.avatarUrl,
      totalReleases: user.totalReleases,
      totalMerit: user.totalMerit,
      status: user.status
    };

    res.json({
      success: true,
      data: userData,
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    next(error);
  }
});

// Helper function to decrypt WeChat encrypted data
function decryptWeChatData(encryptedData, sessionKey, iv) {
  try {
    const sessionKeyBuffer = Buffer.from(sessionKey, 'base64');
    const encryptedDataBuffer = Buffer.from(encryptedData, 'base64');
    const ivBuffer = Buffer.from(iv, 'base64');

    const decipher = crypto.createDecipheriv('aes-128-cbc', sessionKeyBuffer, ivBuffer);
    decipher.setAutoPadding(true);

    let decoded = decipher.update(encryptedDataBuffer, 'binary', 'utf8');
    decoded += decipher.final('utf8');

    return JSON.parse(decoded);
  } catch (error) {
    console.error('Decrypt error:', error);
    return {};
  }
}

// GET /api/users/:id - Get user profile
router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: {
        exclude: ['openid', 'unionid']
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/users/:id - Update user profile
router.put('/:id', async (req, res, next) => {
  try {
    const { nickname, phone } = req.body;
    
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    if (nickname) user.nickname = nickname;
    if (phone) user.phone = phone;

    await user.save();

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
