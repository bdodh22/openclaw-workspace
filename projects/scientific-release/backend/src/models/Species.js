'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Species extends Model {
    static associate(models) {
      // 物种可以有多个放生记录
      Species.hasMany(models.ReleaseRecord, {
        foreignKey: 'speciesId',
        as: 'releaseRecords'
      });
    }
  }

  Species.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '中文名称'
      },
      scientificName: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '学名（拉丁名）'
      },
      category: {
        type: DataTypes.ENUM('鱼类', '鸟类', '龟类', '其他'),
        allowNull: false,
        comment: '主要分类'
      },
      subcategory: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: '子分类（如：淡水鱼、陆禽等）'
      },
      habitat: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: '栖息环境'
      },
      nativeRegion: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: '原产地/分布区域'
      },
      releaseSeason: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: '适宜放生季节'
      },
      difficulty: {
        type: DataTypes.ENUM('容易', '中等', '困难'),
        allowNull: true,
        comment: '放生难度'
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        comment: '参考价格（元）'
      },
      unit: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: '计价单位（斤/只等）'
      },
      merit: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: '放生功德寓意'
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: '物种描述'
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: '图片 URL'
      },
      isRecommended: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        comment: '是否推荐放生'
      },
      protectionLevel: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: '保护级别（无危/易危/濒危等）'
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: '放生注意事项'
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        comment: '是否启用'
      }
    },
    {
      sequelize,
      modelName: 'Species',
      tableName: 'species',
      timestamps: true,
      indexes: [
        { fields: ['category'] },
        { fields: ['isRecommended'] },
        { fields: ['name'] }
      ]
    }
  );

  return Species;
};
