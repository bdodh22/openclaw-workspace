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
