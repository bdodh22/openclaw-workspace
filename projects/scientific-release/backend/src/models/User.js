// backend/src/models/User.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    openid: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      comment: '微信 openid'
    },
    unionid: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: '微信 unionid'
    },
    nickname: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: '用户昵称'
    },
    avatarUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: '头像 URL'
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: '手机号'
    },
    totalReleases: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: '累计放生次数'
    },
    totalMerit: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: '累计福报积分'
    },
    status: {
      type: DataTypes.ENUM('active', 'banned'),
      defaultValue: 'active',
      comment: '状态：active-正常，banned-禁用'
    }
  }, {
    tableName: 'users',
    timestamps: true,
    underscored: true,
    comment: '用户表'
  });

  return User;
};
