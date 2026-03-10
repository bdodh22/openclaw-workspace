// backend/src/routes/certificate.js
const express = require('express');
const router = express.Router();
const { Certificate, Species, User } = require('../models');

// Generate certificate number
function generateCertificateNo() {
  const date = new Date();
  const prefix = 'CERT';
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}${dateStr}${random}`;
}

// POST /api/certificates - Create certificate
router.post('/', async (req, res, next) => {
  try {
    const { userId, speciesId, blessingText, releaseDate, releaseLocation } = req.body;

    // Validate required fields
    if (!userId || !speciesId) {
      return res.status(400).json({
        success: false,
        error: 'userId and speciesId are required'
      });
    }

    // Check if species exists
    const species = await Species.findByPk(speciesId);
    if (!species) {
      return res.status(404).json({
        success: false,
        error: 'Species not found'
      });
    }

    // Create certificate
    const certificate = await Certificate.create({
      userId,
      speciesId,
      certificateNo: generateCertificateNo(),
      blessingText,
      releaseDate,
      releaseLocation,
      meritPoints: 10
    });

    // Update user's total releases and merit
    await User.increment(
      { totalReleases: 1, totalMerit: 10 },
      { where: { id: userId } }
    );

    res.status(201).json({
      success: true,
      data: certificate
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/certificates/user/:userId - Get user's certificates
router.get('/user/:userId', async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await Certificate.findAndCountAll({
      where: {
        userId: req.params.userId,
        status: 'active'
      },
      include: [{
        model: Species,
        as: 'species',
        attributes: ['id', 'name', 'imageUrl']
      }],
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

// GET /api/certificates/:id - Get certificate by ID
router.get('/:id', async (req, res, next) => {
  try {
    const certificate = await Certificate.findByPk(req.params.id, {
      include: [{
        model: Species,
        as: 'species',
        attributes: ['id', 'name', 'imageUrl']
      }, {
        model: User,
        as: 'user',
        attributes: ['id', 'nickname', 'avatarUrl']
      }]
    });

    if (!certificate) {
      return res.status(404).json({
        success: false,
        error: 'Certificate not found'
      });
    }

    res.json({
      success: true,
      data: certificate
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
