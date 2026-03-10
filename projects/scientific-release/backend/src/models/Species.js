// backend/src/models/Species.js
module.exports = (sequelize) => {
  const Species = sequelize.define('Species', {
    id: {
      type: sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: sequelize.DataTypes.STRING(100),
      allowNull: false,
      comment: '物种名称'
    },
    scientificName: {
      type: sequelize.DataTypes.STRING(200),
      allowNull: true,
      comment: '学名'
    },
    category: {
      type: sequelize.DataTypes.ENUM('fish', 'bird', 'turtle', 'mammal', 'other'),
      allowNull: false,
      comment: '类别：fish-鱼类，bird-鸟类，turtle-龟类，mammal-哺乳类，other-其他'
    },
    isNative: {
      type: sequelize.DataTypes.BOOLEAN,
      defaultValue: true,
      comment: '是否本地物种（true=可以放生，false=禁止放生）'
    },
    habitat: {
      type: sequelize.DataTypes.TEXT,
      allowNull: true,
      comment: '栖息环境描述'
    },
    releaseSeason: {
      type: sequelize.DataTypes.STRING(200),
      allowNull: true,
      comment: '适宜放生季节'
    },
    releaseLocation: {
      type: sequelize.DataTypes.TEXT,
      allowNull: true,
      comment: '适宜放生地点类型'
    },
    precautions: {
      type: sequelize.DataTypes.TEXT,
      allowNull: true,
      comment: '放生注意事项'
    },
    imageUrl: {
      type: sequelize.DataTypes.STRING(500),
      allowNull: true,
      comment: '物种图片 URL'
    },
    status: {
      type: sequelize.DataTypes.ENUM('active', 'inactive'),
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
