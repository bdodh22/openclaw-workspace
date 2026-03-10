# Deployment Guide

## Prerequisites

- Node.js 18+ installed on server
- MySQL 8.0+ installed on server
- Domain name with ICP filing (备案已完成)
- SSL certificate

## 1. Database Setup

```bash
# Login to MySQL
mysql -u root -p

# Create database and import schema
mysql -u root -p < backend/database/init.sql

# Create dedicated user (recommended)
mysql -u root -p
> CREATE USER 'scientific_release'@'localhost' IDENTIFIED BY 'strong_password';
> GRANT ALL PRIVILEGES ON scientific_release.* TO 'scientific_release'@'localhost';
> FLUSH PRIVILEGES;
```

## 2. Backend Deployment

```bash
# Navigate to backend directory
cd /home/admin/.openclaw/workspace/projects/scientific-release/backend

# Install dependencies
npm install --production

# Create config file
cp config/config.example.js config/config.js

# Edit config with actual values
nano config/config.js

# Or use environment variables
export NODE_ENV=production
export DB_USERNAME=scientific_release
export DB_PASSWORD=your_password
export DB_NAME=scientific_release
export DB_HOST=localhost
```

### Using PM2 (Recommended for Production)

```bash
# Install PM2 globally
npm install -g pm2

# Start application
pm2 start server.js --name scientific-release-api

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

## 3. Frontend Deployment

```bash
# Open WeChat DevTools on your development machine
# Import frontend/ directory
# Set your AppID in project.config.json
# Build for production
# Upload to WeChat
```

### WeChat Mini-Program Submission

1. Open WeChat DevTools
2. Click "上传" (Upload)
3. Fill in version number and description
4. Submit for review in WeChat Admin Panel
5. Wait for approval (1-3 days)
6. Publish after approval

## 4. Nginx Configuration (Optional Reverse Proxy)

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

## 5. Security Checklist

- [ ] Change default database passwords
- [ ] Enable firewall (ufw/iptables)
- [ ] Setup SSL certificate
- [ ] Enable HTTPS only
- [ ] Configure security headers
- [ ] Setup regular backups
- [ ] Enable database backup
- [ ] Monitor server logs
- [ ] Setup error tracking

## 6. Monitoring

```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs scientific-release-api

# Monitor resources
pm2 monit

# Restart application
pm2 restart scientific-release-api

# Stop application
pm2 stop scientific-release-api
```

## 7. Backup Strategy

```bash
# Database backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u root -p scientific_release > /backups/scientific_release_$DATE.sql

# Add to crontab (daily backup at 2 AM)
0 2 * * * /path/to/backup-script.sh
```

## Troubleshooting

### Backend not starting
```bash
# Check Node.js version
node --version

# Check if port is in use
lsof -i :3000

# Check logs
pm2 logs scientific-release-api
```

### Database connection error
```bash
# Test MySQL connection
mysql -u scientific_release -p -h localhost scientific_release

# Check MySQL is running
systemctl status mysql
```

## Contact

For deployment issues, check:
- PM2 documentation: https://pm2.keymetrics.io
- WeChat Mini-Program docs: https://developers.weixin.qq.com/miniprogram/dev/framework/
