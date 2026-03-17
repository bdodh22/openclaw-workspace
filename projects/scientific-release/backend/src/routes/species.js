const express = require('express');
const router = express.Router();
const { Species } = require('../models');

/**
 * @route GET /api/species
 * @desc 获取物种列表（支持筛选）
 * @access Public
 */
router.get('/', async (req, res) => {
  try {
    const { category, recommended, search } = req.query;
    
    const where = {};
    
    // 按分类筛选
    if (category) {
      where.category = category;
    }
    
    // 只获取推荐的物种
    if (recommended === 'true') {
      where.isRecommended = true;
    }
    
    // 搜索
    if (search) {
      where.name = {
        [require('sequelize').Op.like]: `%${search}%`
      };
    }
    
    const species = await Species.findAll({
      where,
      order: [['id', 'ASC']],
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      }
    });
    
    res.json({
      success: true,
      data: species,
      total: species.length
    });
  } catch (error) {
    console.error('获取物种列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取物种列表失败',
      error: error.message
    });
  }
});

/**
 * @route GET /api/species/:id
 * @desc 获取单个物种详情
 * @access Public
 */
router.get('/:id', async (req, res) => {
  try {
    const species = await Species.findByPk(req.params.id, {
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      }
    });
    
    if (!species) {
      return res.status(404).json({
        success: false,
        message: '物种不存在'
      });
    }
    
    res.json({
      success: true,
      data: species
    });
  } catch (error) {
    console.error('获取物种详情失败:', error);
    res.status(500).json({
      success: false,
      message: '获取物种详情失败',
      error: error.message
    });
  }
});

/**
 * @route GET /api/species/categories/list
 * @desc 获取所有分类
 * @access Public
 */
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Species.findAll({
      attributes: [
        [require('sequelize').fn('DISTINCT', require('sequelize').col('category')), 'category'],
        'category'
      ],
      group: ['category'],
      where: { isActive: true }
    });
    
    const categoryList = categories.map(c => c.category);
    
    res.json({
      success: true,
      data: categoryList
    });
  } catch (error) {
    console.error('获取分类列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取分类列表失败',
      error: error.message
    });
  }
});

/**
 * @route GET /api/species/random
 * @desc 随机获取一个推荐物种（用于每日推荐）
 * @access Public
 */
router.get('/random', async (req, res) => {
  try {
    const species = await Species.findOne({
      where: {
        isRecommended: true,
        isActive: true
      },
      order: require('sequelize').literal('RAND()'),
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      }
    });
    
    if (!species) {
      return res.status(404).json({
        success: false,
        message: '未找到推荐物种'
      });
    }
    
    res.json({
      success: true,
      data: species
    });
  } catch (error) {
    console.error('获取随机物种失败:', error);
    res.status(500).json({
      success: false,
      message: '获取随机物种失败',
      error: error.message
    });
  }
});

module.exports = router;
