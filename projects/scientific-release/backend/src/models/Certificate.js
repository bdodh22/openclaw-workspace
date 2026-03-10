// backend/src/models/Certificate.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Certificate = sequelize.define('Certificate', {
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
    speciesId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '物种 ID'
    },
    certificateNo: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      comment: '证书编号'
    },
    blessingText: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '祈福文字'
    },
    releaseDate: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: '放生日期'
    },
    releaseLocation: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: '放生地点'
    },
    imageUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: '证书图片 URL'
    },
    meritPoints: {
      type: DataTypes.INTEGER,
      defaultValue: 10,
      comment: '福报积分'
    },
    status: {
      type: DataTypes.ENUM('active', 'deleted'),
      defaultValue: 'active',
      comment: '状态'
    }
  }, {
    tableName: 'certificates',
    timestamps: true,
    underscored: true,
    comment: '祈福证书表'
  });

  return Certificate;
};
