# 物种数据库迁移脚本

**创建时间:** 2026-03-16  
**描述:** 创建物种数据表

```sql
-- 创建物种表
CREATE TABLE IF NOT EXISTS `species` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL COMMENT '中文名称',
  `scientificName` VARCHAR(200) NOT NULL COMMENT '学名（拉丁名）',
  `category` ENUM('鱼类', '鸟类', '龟类', '其他') NOT NULL COMMENT '主要分类',
  `subcategory` VARCHAR(50) COMMENT '子分类',
  `habitat` VARCHAR(255) COMMENT '栖息环境',
  `nativeRegion` VARCHAR(255) COMMENT '原产地/分布区域',
  `releaseSeason` VARCHAR(50) COMMENT '适宜放生季节',
  `difficulty` ENUM('容易', '中等', '困难') COMMENT '放生难度',
  `price` DECIMAL(10,2) COMMENT '参考价格（元）',
  `unit` VARCHAR(20) COMMENT '计价单位',
  `merit` VARCHAR(255) COMMENT '放生功德寓意',
  `description` TEXT COMMENT '物种描述',
  `imageUrl` VARCHAR(500) COMMENT '图片 URL',
  `isRecommended` BOOLEAN DEFAULT TRUE COMMENT '是否推荐放生',
  `protectionLevel` VARCHAR(50) COMMENT '保护级别',
  `notes` TEXT COMMENT '放生注意事项',
  `isActive` BOOLEAN DEFAULT TRUE COMMENT '是否启用',
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_category` (`category`),
  INDEX `idx_recommended` (`isRecommended`),
  INDEX `idx_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='物种数据表';
```

## 使用方法

### 方式 1: 自动同步（开发环境）
```bash
cd backend
npm run dev
# 服务器启动时会自动同步数据库结构
```

### 方式 2: 手动执行 SQL
```bash
mysql -u root -p your_database < migrations/001-create-species-table.sql
```

### 导入物种数据
```bash
cd backend
node scripts/seed-species.js
```
