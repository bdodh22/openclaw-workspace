// backend/src/models/Achievement.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Achievement = sequelize.define('Achievement', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '用户 ID'
    },
    type: {
      type: DataTypes.ENUM(
        'first_release',      // 首次放生
        'release_count_10',   // 放生 10 次
        'release_count_50',   // 放生 50 次
        'release_count_100',  // 放生 100 次
        'species_collector',  // 收集 10 个物种
        'zen_master',         // 禅修达人
        'guardian',           // 守护者
        'ambassador'          // 大使
      ),
      allowNull: false,
      comment: '成就类型'
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: '成就标题'
    },
    description: {
      type: DataTypes.STRING(500),
      comment: '成就描述'
    },
    icon: {
      type: DataTypes.STRING(200),
      comment: '成就图标'
    },
    merit: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: '奖励积分'
    },
    unlockedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      comment: '解锁时间'
    }
  }, {
    tableName: 'achievements',
    timestamps: true,
    underscored: true,
    comment: '用户成就表'
  });

  return Achievement;
};
