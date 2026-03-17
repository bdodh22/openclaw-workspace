'use strict';
const { Species } = require('../src/models');
const speciesData = require('../data/species-data.json');

/**
 * 数据库种子脚本 - 导入物种数据
 * 使用方法：node scripts/seed-species.js
 */
async function seedSpecies() {
  try {
    console.log('🌱 开始导入物种数据...');
    
    // 检查是否已有数据
    const existingCount = await Species.count();
    if (existingCount > 0) {
      console.log(`⚠️  数据库中已有 ${existingCount} 条物种记录`);
      console.log('💡 如需重新导入，请先清空数据库或运行：node scripts/clear-species.js');
      return;
    }
    
    // 导入物种数据
    const speciesList = speciesData.species;
    console.log(`📦 准备导入 ${speciesList.length} 个物种...`);
    
    for (const species of speciesList) {
      await Species.create(species);
      console.log(`✅ 已导入：${species.name} (${species.scientificName})`);
    }
    
    console.log('\n🎉 物种数据导入完成！');
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
    console.error('❌ 导入失败:', error);
    process.exit(1);
  }
}

// 执行种子脚本
seedSpecies();
