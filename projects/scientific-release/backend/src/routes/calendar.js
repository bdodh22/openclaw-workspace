// backend/src/routes/calendar.js
const express = require('express');
const router = express.Router();

// Calculate Buddhist vegetarian days (斋日)
function getVegetarianDays(year, month) {
  const days = [];
  
  // 10 Vegetarian Days (十斋日): 1, 8, 14, 15, 18, 23, 24, 28, 29, 30
  const tenDayDates = [1, 8, 14, 15, 18, 23, 24, 28, 29, 30];
  
  // 6 Vegetarian Days (六斋日): 8, 14, 15, 23, 29, 30
  const sixDayDates = [8, 14, 15, 23, 29, 30];
  
  // Get days in month
  const daysInMonth = new Date(year, month, 0).getDate();
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    const lunarDate = solarToLunar(date); // Simplified - should use proper lunar calendar library
    
    const isTenDay = tenDayDates.includes(day);
    const isSixDay = sixDayDates.includes(day);
    const isFirstDay = day === 1; // 初一
    const isFifteenthDay = day === 15; // 十五
    
    if (isTenDay || isSixDay || isFirstDay || isFifteenthDay) {
      days.push({
        date: date.toISOString().slice(0, 10),
        day: day,
        isTenDay,
        isSixDay,
        isFirstDay,
        isFifteenthDay,
        description: getDayDescription(isTenDay, isSixDay, isFirstDay, isFifteenthDay)
      });
    }
  }
  
  return days;
}

function getDayDescription(isTenDay, isSixDay, isFirstDay, isFifteenthDay) {
  if (isFirstDay && isFifteenthDay) return '朔望斋日';
  if (isFirstDay) return '朔日 (初一)';
  if (isFifteenthDay) return '望日 (十五)';
  if (isSixDay) return '六斋日';
  if (isTenDay) return '十斋日';
  return '斋日';
}

// Simplified lunar calendar conversion (should use proper library in production)
function solarToLunar(date) {
  // This is a placeholder - use a proper lunar calendar library
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate()
  };
}

// GET /api/calendar/vegetarian - Get vegetarian days
router.get('/vegetarian', async (req, res, next) => {
  try {
    const { year, month } = req.query;
    
    if (!year || !month) {
      return res.status(400).json({
        success: false,
        error: 'year and month are required'
      });
    }

    const vegetarianDays = getVegetarianDays(parseInt(year), parseInt(month));

    res.json({
      success: true,
      data: vegetarianDays
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/calendar/today - Check if today is vegetarian day
router.get('/today', async (req, res, next) => {
  try {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    
    const vegetarianDays = getVegetarianDays(year, month);
    const isVegetarianDay = vegetarianDays.find(d => d.day === day);

    res.json({
      success: true,
      data: {
        date: today.toISOString().slice(0, 10),
        isVegetarianDay: !!isVegetarianDay,
        description: isVegetarianDay ? isVegetarianDay.description : '普通日'
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
