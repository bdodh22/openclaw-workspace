'use strict';
require('dotenv').config();
const { sequelize, Species } = require('../src/models');
const speciesData = require('../data/species-data.json');

/**
 * 数据库初始化脚本 - 同步表结构并导入物种数据
 * 使用方法：node scripts/init-db.js
 */
async function initDatabase() {
  try {
    console.log('🔧 开始初始化数据库...');
    
    // 测试数据库连接
    await sequelize.authenticate();
    console.log('✅ 数据库连接成功');
    
    // 同步数据库表结构
    console.log('📐 正在同步表结构...');
    await sequelize.sync({ alter: true });
    console.log('✅ 表结构同步完成');
    
    // 检查是否已有数据
    const existingCount = await Species.count();
    if (existingCount > 0) {
      console.log(`⚠️  数据库中已有 ${existingCount} 条物种记录`);
      console.log('💡 如需重新导入，请先清空数据库');
      return;
    }
    
    // 导入物种数据
    const speciesList = speciesData.species;
    console.log(`\n📦 准备导入 ${speciesList.length} 个物种...`);
    
    for (const species of speciesList) {
      await Species.create(species);
      console.log(`✅ 已导入：${species.name} (${species.scientificName})`);
    }
    
    console.log('\n🎉 数据库初始化完成！');
    console.log(`📊 总计导入：${speciesList.length} 个物种`);
    
    // 显示分类统计
    const categories = {};
    speciesList.forEach(s => {
      categories[s.category] = (categories[s.category] || 0) + 1;
    });
    
    console.log('\n📋 分类统计:');
    Object.entries(categories).forEach(([cat, count]) => {
      console.log(`   ${cat}: ${count} 个`);
    });
    
  } catch (error) {
    console.error('❌ 初始化失败:', error);
    process.exit(1);
  }
}

// 执行初始化脚本
initDatabase();
