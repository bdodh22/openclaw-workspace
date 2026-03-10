# 科学放生小程序 - 域名配置说明

**更新时间:** 2026-03-10 16:25

---

## ✅ 当前状态

### 服务器配置
- ✅ Nginx 已安装并运行
- ✅ 反向代理已配置：`sf.dexoconnect.com` → `localhost:3000`
- ✅ 后端 API 可访问：`http://8.221.123.101/api/species`

### DNS 状态
- ⏳ DNS 解析正在传播中（通常需要几分钟到几小时）
- ⏳ HTTPS 证书申请需要等 DNS 生效后才能完成

---

## 🌐 当前可用的访问方式

### 方式 1：通过 IP 访问（立即历史）
```
http://8.221.123.101/api/species
```

### 方式 2：通过域名访问（等 DNS 生效后）
```
http://sf.dexoconnect.com/api/species
https://sf.dexoconnect.com/api/species (HTTPS 配置中)
```

---

## 📋 微信后台配置（现在可以操作）

### 开发设置 > 服务器域名

**临时配置（开发测试用）：**
由于 HTTPS 证书还在等待 DNS 生效，你可以先在微信后台添加：

- **request 合法域名（临时）:** `http://8.221.123.101`

**正式配置（DNS 生效后）：**
- request 合法域名：`https://sf.dexoconnect.com`

> ⚠️ 注意：微信小程序要求必须是 HTTPS，但开发期间可以用 HTTP + IP 测试

---

## 🔧 前端代码配置

### 修改 API 地址

编辑文件：`/home/admin/.openclaw/workspace/projects/scientific-release/frontend/utils/api.js`

**开发环境（当前）：**
```javascript
const BASE_URL = 'http://8.221.123.101:3000/api';
```

**生产环境（DNS 生效后）：**
```javascript
const BASE_URL = 'https://sf.dexoconnect.com/api';
```

---

## 📦 前端代码获取

### 方式 1：从 GitHub 克隆（推荐）

在你电脑上执行：
```bash
git clone https://github.com/bdodh22/openclaw-workspace.git
cd openclaw-workspace/projects/scientific-release/frontend
```

然后用微信开发者工具导入这个目录。

### 方式 2：我打包成 ZIP

如果你不方便用 Git，我可以把前端代码打包成 ZIP 发给你。

---

## ⏳ HTTPS 证书配置

等 DNS 完全生效后（你可以访问 http://sf.dexoconnect.com 测试），我会：

1. 申请 Let's Encrypt 免费 HTTPS 证书
2. 配置 Nginx HTTPS
3. 自动 HTTP 重定向到 HTTPS

**预计时间：** DNS 生效后 5 分钟内完成

---

## 🧪 测试步骤

### 1. 测试 IP 访问
```bash
curl http://8.221.123.101/api/species
```
应该返回 JSON 数据。

### 2. 测试域名访问（等 DNS 生效后）
```bash
curl http://sf.dexoconnect.com/api/species
```

### 3. 微信开发者工具测试
1. 打开微信开发者工具
2. 导入前端代码
3. 在 `utils/api.js` 中配置正确的 BASE_URL
4. 编译并测试

---

## 📊 下一步计划

1. **你：** 在微信后台添加 `http://8.221.123.101` 为临时合法域名
2. **你：** 下载前端代码并导入微信开发者工具
3. **我：** 监控 DNS 生效状态
4. **我：** DNS 生效后立即配置 HTTPS
5. **你：** 更新微信后台为正式域名 `https://sf.dexoconnect.com`

---

## 📞  DNS 检查方法

你可以在本地电脑检查 DNS 是否生效：

**Windows (命令提示符):**
```cmd
ping sf.dexoconnect.com
```

**Mac/Linux (终端):**
```bash
ping sf.dexoconnect.com
```

如果看到 IP `8.221.123.101`，说明 DNS 已生效！

或者在浏览器访问：http://sf.dexoconnect.com/api/species

---

**当前建议：** 先用 IP 地址开始开发测试，DNS 生效通常很快（几分钟到 1 小时），生效后我会立即配置 HTTPS。
