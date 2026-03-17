// backend/tests/setup.js - Jest 测试配置

// 设置测试环境变量
process.env.NODE_ENV = 'test';
process.env.DB_PASSWORD = process.env.DB_PASSWORD || 'SrUser2026!';

// 全局测试超时
jest.setTimeout(10000);

// 全局 mock
global.testData = {};
