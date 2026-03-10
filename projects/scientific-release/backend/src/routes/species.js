// backend/src/routes/species.js
const express = require('express');
const router = express.Router();
const { Species } = require('../models');

// GET /api/species - Get all species (with filters)
router.get('/', async (req, res, next) => {
  try {
    const { category, isNative, page = 1, limit = 20 } = req.query;
    
    const where = {};
    if (category) where.category = category;
    if (isNative !== undefined) where.isNative = isNative === 'true';
    where.status = 'active';

    const offset = (page - 1) * limit;

    const { count, rows } = await Species.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/species/:id - Get species by ID
router.get('/:id', async (req, res, next) => {
  try {
    const species = await Species.findByPk(req.params.id);
    
    if (!species) {
      return res.status(404).json({
        success: false,
        error: 'Species not found'
      });
    }

    res.json({
      success: true,
      data: species
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/species/search - Search species
router.get('/search', async (req, res, next) => {
  try {
    const { keyword } = req.query;
    
    if (!keyword) {
      return res.status(400).json({
        success: false,
        error: 'Keyword is required'
      });
    }

    const species = await Species.findAll({
      where: {
        status: 'active',
        [require('sequelize').Op.or]: [
          { name: { [require('sequelize').Op.like]: `%${keyword}%` } },
          { scientificName: { [require('sequelize').Op.like]: `%${keyword}%` } }
        ]
      },
      limit: 20
    });

    res.json({
      success: true,
      data: species
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
