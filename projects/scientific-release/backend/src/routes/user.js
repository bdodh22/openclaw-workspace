// backend/src/routes/user.js
const express = require('express');
const router = express.Router();
const { User } = require('../models');

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

    // TODO: Implement WeChat login logic
    // 1. Exchange code for session_key and openid
    // 2. Decrypt encryptedData to get userInfo
    // 3. Create or update user

    // Mock response for development
    const user = {
      id: 1,
      openid: 'mock_openid_' + Date.now(),
      nickname: '用户' + Math.random().toString(36).substring(2, 5),
      avatarUrl: '',
      totalReleases: 0,
      totalMerit: 0
    };

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
});

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
