// backend/src/models/Species.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Species = sequelize.define('Species', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: '物种名称'
    },
    scientificName: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: '学名'
    },
    category: {
      type: DataTypes.ENUM('fish', 'bird', 'turtle', 'mammal', 'other'),
      allowNull: false,
      comment: '类别：fish-鱼类，bird-鸟类，turtle-龟类，mammal-哺乳类，other-其他'
    },
    isNative: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: '是否本地物种（true=可以放生，false=禁止放生）'
    },
    habitat: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '栖息环境描述'
    },
    releaseSeason: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: '适宜放生季节'
    },
    releaseLocation: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '适宜放生地点类型'
    },
    precautions: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '放生注意事项'
    },
    imageUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: '物种图片 URL'
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active',
      comment: '状态：active-启用，inactive-禁用'
    }
  }, {
    tableName: 'species',
    timestamps: true,
    underscored: true,
    comment: '放生物种表'
  });

  return Species;
};
