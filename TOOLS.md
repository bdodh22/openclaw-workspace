# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

---

## 📱 科学放生小程序 - 服务器配置

**服务器 IP:** `8.221.123.101`  
**后端端口:** `3000`  
**生产域名:** `https://sf.dexoconnect.com`  
**微信小程序 AppID:** `wxa914ecc15836bda6`

**开发环境 API 地址:** `http://8.221.123.101:3000/api`  
**生产环境 API 地址:** `https://sf.dexoconnect.com/api`

**GitHub 仓库:** https://github.com/bdodh22/openclaw-workspace

**本地开发路径 (Windows):** `E:\wechatsoft\openclaw-workspace\projects\scientific-release\frontend`

## Examples

```markdown
### Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH

- home-server → 192.168.1.100, user: admin

### TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

## 🔧 System Scripts

### Backup & Rollback

```bash
# Quick backup before changes
/home/admin/.openclaw/backups/backup-system.sh before_[change_name]

# Rollback if something breaks
/home/admin/.openclaw/backups/rollback-system.sh [backup_name]

# Safe edit (auto backup + edit + prompt rollback)
/home/admin/.openclaw/backups/safe-modify.sh before_edit nano /path/to/file
```

Location: `/home/admin/.openclaw/backups/`

---

Add whatever helps you do your job. This is your cheat sheet.
