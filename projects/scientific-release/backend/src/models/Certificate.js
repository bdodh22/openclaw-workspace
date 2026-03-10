// backend/src/models/Certificate.js
module.exports = (sequelize) => {
  const Certificate = sequelize.define('Certificate', {
    id: {
      type: sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: sequelize.DataTypes.INTEGER,
      allowNull: false,
      comment: '用户 ID'
    },
    speciesId: {
      type: sequelize.DataTypes.INTEGER,
      allowNull: false,
      comment: '物种 ID'
    },
    certificateNo: {
      type: sequelize.DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      comment: '证书编号'
    },
    blessingText: {
      type: sequelize.DataTypes.TEXT,
      allowNull: true,
      comment: '祈福文字'
    },
    releaseDate: {
      type: sequelize.DataTypes.DATE,
      allowNull: true,
      comment: '放生日期'
    },
    releaseLocation: {
      type: sequelize.DataTypes.STRING(200),
      allowNull: true,
      comment: '放生地点'
    },
    imageUrl: {
      type: sequelize.DataTypes.STRING(500),
      allowNull: true,
      comment: '证书图片 URL'
    },
    meritPoints: {
      type: sequelize.DataTypes.INTEGER,
      defaultValue: 10,
      comment: '福报积分'
    },
    status: {
      type: sequelize.DataTypes.ENUM('active', 'deleted'),
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
