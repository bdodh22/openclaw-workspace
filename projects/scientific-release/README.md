# 科学放生小程序 - Scientific Release Mini-Program

**高端放生平台 | 现代东方禅意设计**

[![Status](https://img.shields.io/badge/status-production%20ready-success)](https://sf.dexoconnect.com)
[![WeChat](https://img.shields.io/badge/WeChat-Mini%20Program-07C160)](https://mp.weixin.qq.com)
[![License](https://img.shields.io/badge/license-Private-blue)]()

---

## 🌟 项目简介

科学放生小程序是一个面向高端用户群体的放生指导平台，提供：
- 🐟 **物种查询** - 15+ 种常见放生物种，科学指导
- 📜 **祈福证书** - 动态电子证书，烫金视觉效果
- 📅 **佛历日历** - 斋戒日标注，宜忌查询
- 🏆 **功德排行榜** - 善行记录，激励分享
- 🎨 **现代东方禅意设计** - 黛绿 + 暖沙金 + 米宣纸白

**生产环境:** https://sf.dexoconnect.com  
**微信小程序 AppID:** `wxa914ecc15836bda6`

---

## 🎨 设计规范

**风格定位:** 现代东方禅意 (Modern Zen)

### 色彩系统
| 颜色 | 色值 | 用途 |
|------|------|------|
| 黛绿 | `#4A5D4E` | 主色调、按钮 |
| 暖沙金 | `#C9B037` | 强调、烫金效果 |
| 米宣纸白 | `#EFEEE9` | 卡片背景 |
| 云雾白 | `#F5F5F0` | 页面背景 |

### 设计特点
- 极致留白，营造"空灵"感
- Bento Grid 布局，秩序与灵动并存
- 动态电子证书，数字藏品质感
- 液态玻璃拟态，呼应"水"主题

---

## 🏗️ 技术架构

### 前端
- **平台:** 微信小程序 (原生)
- **语言:** WXML + WXSS + JavaScript
- **设计库:** 自定义高端禅意风格

### 后端
- **Runtime:** Node.js 24.13.0
- **Framework:** Express.js
- **Database:** MySQL 8.0.44
- **ORM:** Sequelize

### 基础设施
- **Server:** Linux (Alibaba Cloud)
- **Domain:** sf.dexoconnect.com
- **SSL:** Let's Encrypt (自动续期)
- **Reverse Proxy:** Nginx 1.20.1

---

## 📦 项目结构

```
scientific-release/
├── frontend/                     # 微信小程序
│   ├── pages/
│   │   ├── index/               # 首页 - Bento Grid 布局
│   │   ├── species/             # 物种列表 - 生命图鉴设计
│   │   ├── species-detail/      # 物种详情
│   │   ├── certificate/         # 祈福证书 - 动态电子证书
│   │   ├── calendar/            # 佛历日历
│   │   ├── profile/             # 个人中心
│   │   └── ranking/             # 功德排行榜
│   ├── utils/
│   │   ├── api.js               # API 封装
│   │   └── util.js              # 工具函数
│   ├── app.js/json/wxss         # 应用配置
│   └── project.config.json      # 项目配置 (AppID)
│
├── backend/
│   ├── src/
│   │   ├── models/              # 数据模型
│   │   ├── routes/              # API 路由
│   │   └── services/            # 业务服务
│   ├── config/
│   │   └── config.js            # 数据库配置
│   ├── scripts/
│   │   ├── init-db.js           # 数据库初始化
│   │   └── seed-species.js      # 物种数据导入
│   ├── migrations/              # 数据库迁移
│   ├── server.js                # 服务器入口
│   └── scientific-release.service  # systemd 配置
│
├── docs/
│   ├── DEPLOYMENT.md            # 部署文档
│   ├── GIT_SETUP.md             # Git 配置
│   └── DESIGN_SPEC_高端放生平台.md  # 设计规范
│
└── README.md
```

---

## 🚀 快速开始

### 前端开发

1. **打开微信开发者工具**
2. **导入项目:** `frontend/` 目录
3. **配置 AppID:** 已自动配置 `wxa914ecc15836bda6`
4. **编译测试**

### 后端部署

```bash
# 安装依赖
cd backend
npm install

# 初始化数据库
node scripts/init-db.js
node scripts/seed-species.js

# 启动服务 (开发)
npm run dev

# 启动服务 (生产 - systemd)
sudo systemctl start scientific-release
sudo systemctl enable scientific-release
```

### Nginx 配置

```bash
# 测试配置
sudo nginx -t

# 重启服务
sudo systemctl restart nginx
```

---

## 📊 API 文档

### 物种相关
| 端点 | 方法 | 说明 |
|------|------|------|
| `/api/species` | GET | 获取物种列表（分页、分类过滤） |
| `/api/species/:id` | GET | 获取物种详情 |
| `/api/species/search` | GET | 搜索物种 |

### 用户相关
| 端点 | 方法 | 说明 |
|------|------|------|
| `/api/users/login` | POST | 微信登录 |
| `/api/users/:openid` | GET | 获取用户信息 |

### 证书相关
| 端点 | 方法 | 说明 |
|------|------|------|
| `/api/certificates` | POST | 生成祈福证书 |
| `/api/certificates/user/:openid` | GET | 用户证书列表 |

### 其他
| 端点 | 方法 | 说明 |
|------|------|------|
| `/api/calendar` | GET | 佛历查询 |
| `/api/ranking` | GET | 功德排行榜 |
| `/api/achievements` | GET | 用户成就 |
| `/health` | GET | 健康检查 |

---

## 📅 开发进度

| Phase | 日期 | 状态 | 完成度 |
|-------|------|------|--------|
| Phase 1: Setup | Mar 9-15 | ✅ Done | 100% |
| Phase 2: Core Features | Mar 16-24 | ✅ Done | 100% |
| Phase 3: Testing & Launch | Mar 25-31 | 🔄 Ready | 待测试 |

### 已完成功能
- ✅ 后端服务部署 (Node.js + MySQL)
- ✅ Nginx 反向代理 + HTTPS
- ✅ 15 条物种数据导入
- ✅ 6 个前端页面开发
- ✅ 现代东方禅意设计
- ✅ 动态电子证书生成
- ✅ 佛历日历查询
- ✅ 成就系统
- ✅ 海报生成功能

---

## 🔐 安全配置

### SSL 证书
- **提供商:** Let's Encrypt
- **有效期:** 90 天 (自动续期)
- **配置:** Nginx 自动 HTTPS

### 数据库
- **端口:** 3306 (仅本地访问)
- **用户:** `sr_user`
- **加密:** 密码哈希存储

### 服务器
- **防火墙:** 仅开放 80/443
- **进程管理:** systemd (自动重启)
- **日志:** Nginx + Node.js 双日志

---

## 📝 部署清单

### 生产环境
- [x] 域名备案 (sf.dexoconnect.com)
- [x] SSL 证书申请
- [x] Nginx 反向代理配置
- [x] Node.js systemd 服务
- [x] MySQL 数据库初始化
- [x] 物种数据导入 (15 条)
- [x] 前端 API 地址配置

### 微信小程序
- [x] AppID 配置 (`wxa914ecc15836bda6`)
- [ ] 服务器域名配置 (需手动)
- [ ] 提交审核材料
- [ ] 上线发布

---

## ⚠️ 注意事项

### 法律合规
- 小程序内必须包含**免责声明**
- 物种数据需符合当地法律法规
- 避免宗教敏感词汇，强调"科学放生"

### 微信审核
- 服务类目建议：**教育 > 科普教育** 或 **工具 > 查询**
- 准备 5-10 张小程序截图
- 编写隐私政策和使用说明

---

## 📞 联系方式

- **GitHub:** https://github.com/bdodh22/openclaw-workspace
- **生产地址:** https://sf.dexoconnect.com
- **开发开始:** 2026-03-09
- **目标上线:** 2026-03-31

---

## 📄 License

Private - All Rights Reserved

---

**最后更新:** 2026-03-17  
**当前版本:** v1.0.0 (Production Ready)
