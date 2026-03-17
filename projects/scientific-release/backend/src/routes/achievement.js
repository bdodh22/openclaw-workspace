// backend/src/routes/achievement.js
const express = require('express');
const router = express.Router();
const AchievementService = require('../services/achievementService');
const { User } = require('../models');

const achievementService = new AchievementService();

/**
 * GET /api/achievements/:userId
 * 获取用户成就列表
 */
router.get('/:userId', async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    const result = await achievementService.getUserAchievements(userId);
    
    if (!result) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Get achievements error:', error);
    next(error);
  }
});

/**
 * GET /api/achievements/config/all
 * 获取所有成就配置
 */
router.get('/config/all', (req, res) => {
  try {
    const configs = achievementService.getAllAchievementConfigs();
    
    res.json({
      success: true,
      data: configs
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/achievements/check
 * 检查并解锁成就
 */
router.post('/check', async (req, res, next) => {
  try {
    const { userId, action, metadata } = req.body;

    if (!userId || !action) {
      return res.status(400).json({
        success: false,
        error: 'User ID and action are required'
      });
    }

    const unlockedAchievements = await achievementService.checkAndUnlockAchievements(
      userId,
      action,
      metadata
    );

    res.json({
      success: true,
      data: {
        unlocked: unlockedAchievements,
        count: unlockedAchievements.length
      },
      message: unlockedAchievements.length > 0 
        ? `解锁了 ${unlockedAchievements.length} 个成就！`
        : '检查完成'
    });
  } catch (error) {
    console.error('Check achievements error:', error);
    next(error);
  }
});

/**
 * POST /api/achievements/merit/add
 * 添加积分
 */
router.post('/merit/add', async (req, res, next) => {
  try {
    const { userId, amount, source } = req.body;

    if (!userId || !amount) {
      return res.status(400).json({
        success: false,
        error: 'User ID and amount are required'
      });
    }

    const newTotal = await achievementService.addMerit(userId, amount, source);
    
    if (newTotal === null) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        userId,
        amountAdded: amount,
        newTotal,
        source
      },
      message: `获得 ${amount} 福报积分！`
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/achievements/ranking
 * 获取功德排行榜（按积分排序）
 */
router.get('/ranking/top', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    
    const topUsers = await User.findAll({
      attributes: ['id', 'nickname', 'avatarUrl', 'totalMerit', 'totalReleases'],
      where: { status: 'active' },
      order: [['totalMerit', 'DESC']],
      limit
    });

    res.json({
      success: true,
      data: topUsers
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
