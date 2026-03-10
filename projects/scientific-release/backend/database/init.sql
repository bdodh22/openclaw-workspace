-- Database initialization script for Scientific Release Mini-Program
-- Run this after creating the database

CREATE DATABASE IF NOT EXISTS scientific_release CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE scientific_release;

-- Species table
CREATE TABLE IF NOT EXISTS species (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL COMMENT '物种名称',
  scientific_name VARCHAR(200) COMMENT '学名',
  category ENUM('fish', 'bird', 'turtle', 'mammal', 'other') NOT NULL COMMENT '类别',
  is_native BOOLEAN DEFAULT TRUE COMMENT '是否本地物种',
  habitat TEXT COMMENT '栖息环境描述',
  release_season VARCHAR(200) COMMENT '适宜放生季节',
  release_location TEXT COMMENT '适宜放生地点类型',
  precautions TEXT COMMENT '放生注意事项',
  image_url VARCHAR(500) COMMENT '物种图片 URL',
  status ENUM('active', 'inactive') DEFAULT 'active' COMMENT '状态',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_is_native (is_native),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='放生物种表';

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  openid VARCHAR(100) NOT NULL UNIQUE COMMENT '微信 openid',
  unionid VARCHAR(100) COMMENT '微信 unionid',
  nickname VARCHAR(100) COMMENT '用户昵称',
  avatar_url VARCHAR(500) COMMENT '头像 URL',
  phone VARCHAR(20) COMMENT '手机号',
  total_releases INT DEFAULT 0 COMMENT '累计放生次数',
  total_merit INT DEFAULT 0 COMMENT '累计福报积分',
  status ENUM('active', 'banned') DEFAULT 'active' COMMENT '状态',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_openid (openid),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- Certificates table
CREATE TABLE IF NOT EXISTS certificates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL COMMENT '用户 ID',
  species_id INT NOT NULL COMMENT '物种 ID',
  certificate_no VARCHAR(50) NOT NULL UNIQUE COMMENT '证书编号',
  blessing_text TEXT COMMENT '祈福文字',
  release_date DATETIME COMMENT '放生日期',
  release_location VARCHAR(200) COMMENT '放生地点',
  image_url VARCHAR(500) COMMENT '证书图片 URL',
  merit_points INT DEFAULT 10 COMMENT '福报积分',
  status ENUM('active', 'deleted') DEFAULT 'active' COMMENT '状态',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (species_id) REFERENCES species(id) ON DELETE RESTRICT,
  INDEX idx_user_id (user_id),
  INDEX idx_species_id (species_id),
  INDEX idx_certificate_no (certificate_no)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='祈福证书表';

-- Insert sample species data
INSERT INTO species (name, scientific_name, category, is_native, habitat, release_season, release_location, precautions, status) VALUES
('鲫鱼', 'Carassius auratus', 'fish', TRUE, '淡水湖泊、河流、池塘', '春夏秋冬四季', '江河湖泊、水库', '选择健康个体，避免放生到污染水域', 'active'),
('鲤鱼', 'Cyprinus carpio', 'fish', TRUE, '淡水水域', '春季、秋季', '江河、湖泊、水库', '避免放生到封闭小水域', 'active'),
('草鱼', 'Ctenopharyngodon idellus', 'fish', TRUE, '淡水江河湖泊', '春季、夏季', '大型江河湖泊', '需要较大水域空间', 'active'),
('青鱼', 'Mylopharyngodon piceus', 'fish', TRUE, '淡水江河湖泊', '春季、秋季', '江河、湖泊', '选择自然栖息地', 'active'),
('鲢鱼', 'Hypophthalmichthys molitrix', 'fish', TRUE, '淡水水域', '春季、夏季', '大型湖泊、水库', '需要充足氧气', 'active'),
('鳙鱼', 'Hypophthalmichthys nobilis', 'fish', TRUE, '淡水水域', '春季、夏季', '大型湖泊、水库', '适合富营养化水域', 'active'),
('泥鳅', 'Misgurnus anguillicaudatus', 'fish', TRUE, '淡水池塘、稻田', '春夏秋三季', '池塘、水田、沟渠', '适应性强，易存活', 'active'),
('黄鳝', 'Monopterus albus', 'fish', TRUE, '淡水稻田、池塘', '春季、夏季', '稻田、池塘、沟渠', '避免阳光直射', 'active'),
('乌龟', 'Chinemys reevesii', 'turtle', TRUE, '淡水水域', '春季、夏季', '江河、湖泊、池塘', '本地中华龟，非巴西龟', 'active'),
('麻雀', 'Passer montanus', 'bird', TRUE, '城乡常见', '春季、秋季', '树林、公园', '选择健康个体，远离人类聚居区', 'active');

-- Insert admin user (for testing)
-- Note: In production, use proper authentication
INSERT INTO users (openid, nickname, total_releases, total_merit) VALUES
('admin_openid', '管理员', 0, 0);
