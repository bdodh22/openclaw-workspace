// backend/src/routes/ranking.js
// 功德排行榜 API

const express = require('express');
const router = express.Router();
const { User, Certificate } = require('../models');
const { Op } = require('sequelize');

/**
 * GET /api/ranking/merit - 功德排行榜
 * @param {string} type - 类型：total(总榜)|month(月榜)|week(周榜)
 * @param {number} limit - 返回数量
 */
router.get('/merit', async (req, res, next) => {
  try {
    const { type = 'total', limit = 50 } = req.query;
    
    let where = { status: 'active' };
    
    // 时间范围过滤
    if (type === 'month') {
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      where.createdAt = { [Op.gte]: firstDay };
    } else if (type === 'week') {
      const now = new Date();
      const firstDay = new Date(now.setDate(now.getDate() - now.getDay()));
      where.createdAt = { [Op.gte]: firstDay };
    }

    const rankings = await Certificate.findAll({
      where,
      attributes: [
        'userId',
        [Certificate.sequelize.fn('COUNT', Certificate.col('id')), 'totalCount'],
        [Certificate.sequelize.fn('SUM', Certificate.col('meritPoints')), 'totalMerit']
      ],
      group: ['userId'],
      order: [[Certificate.sequelize.literal('totalMerit'), 'DESC']],
      limit: parseInt(limit),
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'nickname', 'avatarUrl', 'totalReleases', 'totalMerit']
      }]
    });

    // 格式化数据
    const formattedRankings = rankings.map((item, index) => ({
      rank: index + 1,
      userId: item.userId,
      nickname: item.user?.nickname || '善信',
      avatarUrl: item.user?.avatarUrl || '',
      totalCount: item.dataValues.totalCount,
      totalMerit: item.dataValues.totalMerit || 0,
      level: getUserLevel(item.dataValues.totalMerit)
    }));

    res.json({
      success: true,
      data: formattedRankings,
      type,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/ranking/user/:userId - 用户排名
 */
router.get('/user/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;
    
    // 计算用户总排名
    const allRankings = await Certificate.findAll({
      where: { status: 'active' },
      attributes: [
        'userId',
        [Certificate.sequelize.fn('SUM', Certificate.col('meritPoints')), 'totalMerit']
      ],
      group: ['userId']
    });

    const userIndex = allRankings.findIndex(item => item.userId === parseInt(userId));
    const userRanking = allRankings[userIndex];

    if (!userRanking) {
      return res.json({
        success: true,
        data: {
          rank: null,
          userId,
          totalMerit: 0,
          level: '新手'
        }
      });
    }

    res.json({
      success: true,
      data: {
        rank: userIndex + 1,
        userId,
        totalMerit: userRanking.dataValues.totalMerit || 0,
        level: getUserLevel(userRanking.dataValues.totalMerit),
        totalUsers: allRankings.length
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * 用户等级计算
 */
function getUserLevel(totalMerit) {
  if (totalMerit >= 10000) return { name: '至善尊者', icon: '👑', color: '#C9A961' };
  if (totalMerit >= 2000) return { name: '钻石善信', icon: '💎', color: '#5D7A5F' };
  if (totalMerit >= 500) return { name: '金牌善信', icon: '🥇', color: '#B8945E' };
  if (totalMerit >= 100) return { name: '银牌善信', icon: '🥈', color: '#8B8B8B' };
  if (totalMerit >= 10) return { name: '铜牌善信', icon: '🥉', color: '#A86B6B' };
  return { name: '初发心者', icon: '🌱', color: '#6B7D6D' };
}

module.exports = router;
