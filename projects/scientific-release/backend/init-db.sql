-- 重置 root 密码并创建数据库用户
ALTER USER 'root'@'localhost' IDENTIFIED BY 'Root2026!';

-- 创建数据库
CREATE DATABASE IF NOT EXISTS scientific_release 
  DEFAULT CHARACTER SET utf8mb4 
  DEFAULT COLLATE utf8mb4_unicode_ci;

-- 创建用户
CREATE USER IF NOT EXISTS 'sr_user'@'localhost' 
  IDENTIFIED BY 'SrUser2026!';

-- 授权
GRANT ALL PRIVILEGES ON scientific_release.* TO 'sr_user'@'localhost';
FLUSH PRIVILEGES;

-- 验证
SHOW DATABASES;
SELECT User, Host FROM mysql.user WHERE User='sr_user';
