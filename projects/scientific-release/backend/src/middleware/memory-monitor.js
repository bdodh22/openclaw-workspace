// backend/src/middleware/memory-monitor.js - 内存使用监控

const fs = require('fs');
const path = require('path');

// 监控配置
const config = {
  // 内存警告阈值 (MB)
  warningThreshold: 1500,
  // 内存严重阈值 (MB)
  criticalThreshold: 1700,
  // 检查间隔 (ms)
  checkInterval: 60000, // 1 分钟
  // 日志目录
  logDir: path.join(__dirname, '../../logs'),
  // 内存日志文件
  logFile: 'memory-monitor.log'
};

// 确保日志目录存在
if (!fs.existsSync(config.logDir)) {
  fs.mkdirSync(config.logDir, { recursive: true });
}

// 内存使用历史
const memoryHistory = [];
const MAX_HISTORY = 100; // 保留最近 100 条记录

/**
 * 获取内存使用信息
 */
function getMemoryInfo() {
  const usage = process.memoryUsage();
  const totalMB = Math.round(usage.heapTotal / 1024 / 1024 * 100) / 100;
  const usedMB = Math.round(usage.heapUsed / 1024 / 1024 * 100) / 100;
  const externalMB = Math.round(usage.external / 1024 / 1024 * 100) / 100;
  const rssMB = Math.round(usage.rss / 1024 / 1024 * 100) / 100;
  
  return {
    timestamp: new Date().toISOString(),
    heapTotal: totalMB,
    heapUsed: usedMB,
    heapUsedPercent: Math.round((usage.heapUsed / usage.heapTotal) * 100),
    external: externalMB,
    rss: rssMB,
    uptime: process.uptime()
  };
}

/**
 * 记录内存日志
 */
function logMemory(memoryInfo) {
  const logPath = path.join(config.logDir, config.logFile);
  const logEntry = JSON.stringify(memoryInfo) + '\n';
  
  fs.appendFile(logPath, logEntry, (err) => {
    if (err) {
      console.error('Failed to write memory log:', err);
    }
  });
  
  // 添加到历史记录
  memoryHistory.push(memoryInfo);
  if (memoryHistory.length > MAX_HISTORY) {
    memoryHistory.shift();
  }
}

/**
 * 检查内存状态
 */
function checkMemoryStatus(memoryInfo) {
  const { rss } = memoryInfo;
  
  if (rss >= config.criticalThreshold) {
    console.error(`🚨 CRITICAL: Memory usage at ${rss}MB (threshold: ${config.criticalThreshold}MB)`);
    return 'critical';
  } else if (rss >= config.warningThreshold) {
    console.warn(`⚠️  WARNING: Memory usage at ${rss}MB (threshold: ${config.warningThreshold}MB)`);
    return 'warning';
  }
  
  return 'normal';
}

/**
 * 获取内存趋势分析
 */
function getMemoryTrend() {
  if (memoryHistory.length < 2) {
    return { trend: 'insufficient_data' };
  }
  
  const recent = memoryHistory.slice(-10); // 最近 10 条
  const first = recent[0].heapUsed;
  const last = recent[recent.length - 1].heapUsed;
  const change = last - first;
  const changePercent = Math.round((change / first) * 100);
  
  let trend = 'stable';
  if (changePercent > 10) trend = 'increasing';
  if (changePercent < -10) trend = 'decreasing';
  
  return {
    trend,
    changeMB: Math.round(change * 100) / 100,
    changePercent,
    averageMB: Math.round(recent.reduce((sum, m) => sum + m.heapUsed, 0) / recent.length * 100) / 100
  };
}

/**
 * 建议垃圾回收（如果内存使用过高）
 */
function suggestGC(memoryInfo) {
  if (memoryInfo.heapUsedPercent > 80) {
    console.log('💡 High heap usage detected, suggesting manual GC if needed');
    // 注意：Node.js 中不能直接触发 GC，除非使用 --expose-gc 标志
    if (global.gc) {
      console.log('🔄 Triggering manual garbage collection...');
      global.gc();
    }
  }
}

/**
 * 启动内存监控
 */
function startMemoryMonitoring() {
  console.log('📊 Memory monitoring started');
  console.log(`   Warning threshold: ${config.warningThreshold}MB`);
  console.log(`   Critical threshold: ${config.criticalThreshold}MB`);
  console.log(`   Check interval: ${config.checkInterval / 1000}s`);
  
  // 定期检查
  setInterval(() => {
    const memoryInfo = getMemoryInfo();
    logMemory(memoryInfo);
    
    const status = checkMemoryStatus(memoryInfo);
    
    if (status !== 'normal') {
      const trend = getMemoryTrend();
      console.log(`   Memory trend: ${trend.trend} (${trend.changePercent}%)`);
    }
    
    suggestGC(memoryInfo);
  }, config.checkInterval);
  
  // 进程退出时输出总结
  process.on('exit', () => {
    const trend = getMemoryTrend();
    console.log('\n📊 Memory monitoring summary:');
    console.log(`   Trend: ${trend.trend}`);
    console.log(`   Average usage: ${trend.averageMB}MB`);
  });
}

/**
 * 获取当前内存状态 API
 */
function getMemoryStatus() {
  const memoryInfo = getMemoryInfo();
  const status = checkMemoryStatus(memoryInfo);
  const trend = getMemoryTrend();
  
  return {
    ...memoryInfo,
    status,
    trend,
    thresholds: {
      warning: config.warningThreshold,
      critical: config.criticalThreshold
    }
  };
}

module.exports = {
  startMemoryMonitoring,
  getMemoryStatus,
  getMemoryInfo,
  getMemoryTrend,
  config
};
