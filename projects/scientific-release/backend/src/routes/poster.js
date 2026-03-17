// backend/src/routes/poster.js
const express = require('express');
const router = express.Router();
const PosterGeneratorService = require('../services/posterGenerator');
const { User, Certificate, Species } = require('../models');

const posterService = new PosterGeneratorService();

/**
 * POST /api/posters/certificate
 * 生成放生证书分享海报
 */
router.post('/certificate', async (req, res, next) => {
  try {
    const { certificateId, userId } = req.body;

    if (!certificateId) {
      return res.status(400).json({
        success: false,
        error: 'Certificate ID is required'
      });
    }

    // 获取证书信息
    const certificate = await Certificate.findByPk(certificateId, {
      include: [
        { model: Species, attributes: ['name', 'scientificName', 'imageUrl'] },
        { model: User, attributes: ['nickname', 'avatarUrl'] }
      ]
    });

    if (!certificate) {
      return res.status(404).json({
        success: false,
        error: 'Certificate not found'
      });
    }

    // 生成海报
    const posterPath = await posterService.generateCertificatePoster(
      {
        id: certificate.id,
        speciesName: certificate.Species?.name,
        speciesImage: certificate.Species?.imageUrl,
        quantity: certificate.quantity,
        blessing: certificate.blessing
      },
      certificate.User || { nickname: '善心居士' }
    );

    // 返回海报 URL（生产环境应该是 CDN URL）
    const posterUrl = `/api/posters/${posterPath.split('/').pop()}`;

    res.json({
      success: true,
      data: {
        posterUrl,
        localPath: posterPath
      },
      message: 'Poster generated successfully'
    });
  } catch (error) {
    console.error('Generate poster error:', error);
    next(error);
  }
});

/**
 * POST /api/posters/daily-quote
 * 生成每日禅语分享海报
 */
router.post('/daily-quote', async (req, res, next) => {
  try {
    const { quote, author } = req.body;

    if (!quote) {
      return res.status(400).json({
        success: false,
        error: 'Quote is required'
      });
    }

    // 生成海报
    const posterPath = await posterService.generateDailyQuotePoster(quote, author);
    const posterUrl = `/api/posters/${posterPath.split('/').pop()}`;

    res.json({
      success: true,
      data: {
        posterUrl,
        localPath: posterPath
      },
      message: 'Daily quote poster generated successfully'
    });
  } catch (error) {
    console.error('Generate daily quote poster error:', error);
    next(error);
  }
});

/**
 * GET /api/posters/:filename
 * 获取海报文件
 */
router.get('/:filename', async (req, res, next) => {
  try {
    const fs = require('fs');
    const path = require('path');
    
    const filename = req.params.filename;
    const filepath = path.join(posterService.posterDir, filename);

    if (!fs.existsSync(filepath)) {
      return res.status(404).json({
        success: false,
        error: 'Poster not found'
      });
    }

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 1 day
    
    const fileStream = fs.createReadStream(filepath);
    fileStream.pipe(res);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
