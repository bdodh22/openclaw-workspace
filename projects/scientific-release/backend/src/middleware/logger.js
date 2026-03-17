// backend/src/middleware/logger.js - 日志文件存储中间件

const fs = require('fs');
const path = require('path');
const morgan = require('morgan');

// 日志目录
const logDir = path.join(__dirname, '../../logs');

// 确保日志目录存在
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// 获取日志文件名（按日期）
function getLogFilename() {
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
  return `access-${dateStr}.log`;
}

// 获取错误日志文件名
function getErrorLogFilename() {
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  return `error-${dateStr}.log`;
}

// 自定义日志格式
const logFormat = ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms';

// 创建日志流
function createLogStream(filename) {
  const logPath = path.join(logDir, filename);
  return fs.createWriteStream(logPath, { flags: 'a' });
}

// Morgan 日志中间件（访问日志）
const accessLogger = morgan(logFormat, {
  stream: createLogStream(getLogFilename()),
  skip: (req, res) => {
    // 跳过健康检查请求
    return req.url === '/health';
  }
});

// 错误日志中间件
function errorLogger(err, req, res, next) {
  const errorLog = {
    timestamp: new Date().toISOString(),
    level: 'error',
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('user-agent')
  };

  // 写入错误日志
  const errorLogPath = path.join(logDir, getErrorLogFilename());
  fs.appendFile(errorLogPath, JSON.stringify(errorLog) + '\n', (err) => {
    if (err) {
      console.error('Failed to write error log:', err);
    }
  });

  next(err);
}

// 清理旧日志（保留 7 天）
function cleanupOldLogs() {
  const daysToKeep = 7;
  const now = Date.now();
  const maxAge = daysToKeep * 24 * 60 * 60 * 1000;

  fs.readdir(logDir, (err, files) => {
    if (err) {
      console.error('Failed to read log directory:', err);
      return;
    }

    files.forEach(file => {
      const filePath = path.join(logDir, file);
      fs.stat(filePath, (err, stats) => {
        if (err) return;

        if (now - stats.mtimeMs > maxAge) {
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error('Failed to delete old log:', err);
            } else {
              console.log('Deleted old log:', file);
            }
          });
        }
      });
    });
  });
}

// 每天清理一次旧日志
setInterval(cleanupOldLogs, 24 * 60 * 60 * 1000);

// 应用日志中间件
function setupLogger(app) {
  app.use(accessLogger);
  app.use(errorLogger);

  console.log('✅ Logger initialized, logs directory:', logDir);
}

module.exports = {
  setupLogger,
  logDir,
  cleanupOldLogs
};
