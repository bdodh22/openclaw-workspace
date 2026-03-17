// utils/poster.js - 海报生成工具

/**
 * 生成祈福证书海报
 * @param {Object} certificateData - 证书数据
 * @returns {Promise<string>} - 海报图片临时路径
 */
async function generateCertificatePoster(certificateData) {
  const {
    userName = '善心居士',
    speciesName = '物命',
    blessingText = '祈愿众生离苦得乐',
    releaseDate = '吉日',
    meritPoints = 100,
    certificateNo = 'N/A'
  } = certificateData;

  try {
    // 创建 canvas 上下文
    const query = wx.createSelectorQuery();
    
    return new Promise((resolve, reject) => {
      wx.canvasToTempFilePath({
        canvasType: '2d',
        success: (res) => {
          resolve(res.tempFilePath);
        },
        fail: (err) => {
          console.error('Canvas to temp file path error:', err);
          reject(err);
        }
      });
    });
  } catch (error) {
    console.error('Generate poster error:', error);
    throw error;
  }
}

/**
 * 绘制海报背景
 * @param {CanvasRenderingContext2D} ctx - Canvas 上下文
 * @param {number} width - 画布宽度
 * @param {number} height - 画布高度
 */
function drawBackground(ctx, width, height) {
  // 渐变背景（黛绿色）
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, '#4A5D4E');
  gradient.addColorStop(1, '#3A4A3E');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // 装饰边框（暖沙金）
  ctx.strokeStyle = '#C9B037';
  ctx.lineWidth = 4;
  ctx.strokeRect(20, 20, width - 40, height - 40);

  // 内框
  ctx.strokeStyle = 'rgba(201, 176, 55, 0.3)';
  ctx.lineWidth = 2;
  ctx.strokeRect(30, 30, width - 60, height - 60);
}

/**
 * 绘制证书标题
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} width
 */
function drawTitle(ctx, width) {
  ctx.fillStyle = '#C9B037';
  ctx.font = 'bold 48px serif';
  ctx.textAlign = 'center';
  ctx.fillText('放生祈福证书', width / 2, 100);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.font = '24px sans-serif';
  ctx.fillText('功德无量 · 福泽绵长', width / 2, 140);
}

/**
 * 绘制证书内容
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} width
 * @param {Object} data
 */
function drawContent(ctx, width, data) {
  const startY = 220;
  const lineHeight = 60;

  ctx.fillStyle = '#EFEEE9';
  ctx.font = '28px sans-serif';
  ctx.textAlign = 'center';

  // 善信姓名
  ctx.fillText(`善信：${data.userName || '某某居士'}`, width / 2, startY);
  
  // 放生信息
  ctx.fillText(
    `于${data.releaseDate || '吉日'}放生${data.speciesName || '物命'}`,
    width / 2,
    startY + lineHeight
  );

  // 祈福心愿
  const blessing = data.blessingText || '祈愿众生离苦得乐，福慧增长';
  const lines = wrapText(ctx, blessing, width - 100);
  lines.forEach((line, index) => {
    ctx.fillText(line, width / 2, startY + lineHeight * 2 + index * 40);
  });
}

/**
 * 绘制底部信息
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} width
 * @param {number} height
 * @param {Object} data
 */
function drawFooter(ctx, width, height, data) {
  // 日期
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.font = '20px sans-serif';
  ctx.textAlign = 'left';
  const today = new Date().toLocaleDateString('zh-CN');
  ctx.fillText(`公元${today}`, 50, height - 80);

  // 功德编号
  ctx.textAlign = 'right';
  ctx.fillStyle = '#C9B037';
  ctx.font = 'bold 24px monospace';
  ctx.fillText(`编号：${data.certificateNo || 'N/A'}`, width - 50, height - 80);

  // 福报值
  ctx.fillStyle = '#C9B037';
  ctx.font = 'bold 32px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`+${data.meritPoints || 100} 福报`, width / 2, height - 40);

  // 印章
  drawSeal(ctx, width - 100, height - 120);
}

/**
 * 绘制印章
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x
 * @param {number} y
 */
function drawSeal(ctx, x, y) {
  const size = 80;
  
  // 印章外框
  ctx.strokeStyle = '#C9B037';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(x, y, size / 2, 0, Math.PI * 2);
  ctx.stroke();

  // 印章文字
  ctx.fillStyle = '#C9B037';
  ctx.font = 'bold 40px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('福', x, y);

  // 光晕效果
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
  gradient.addColorStop(0, 'rgba(201, 176, 55, 0.3)');
  gradient.addColorStop(1, 'transparent');
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(x, y, size / 2, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * 文本换行
 * @param {CanvasRenderingContext2D} ctx
 * @param {string} text
 * @param {number} maxWidth
 * @returns {string[]}
 */
function wrapText(ctx, text, maxWidth) {
  const lines = [];
  let currentLine = '';

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const testLine = currentLine + char;
    const metrics = ctx.measureText(testLine);
    
    if (metrics.width > maxWidth && currentLine !== '') {
      lines.push(currentLine);
      currentLine = char;
    } else {
      currentLine = testLine;
    }
  }
  
  if (currentLine !== '') {
    lines.push(currentLine);
  }
  
  return lines;
}

/**
 * 分享到朋友圈
 * @param {string} imagePath - 海报图片路径
 */
function shareToWeChat(imagePath) {
  wx.showShareMenu({
    withShareTicket: true,
    menus: ['shareAppMessage', 'shareTimeline']
  });

  // 保存到相册
  wx.saveImageToPhotosAlbum({
    filePath: imagePath,
    success: () => {
      wx.showToast({
        title: '已保存到相册',
        icon: 'success',
        duration: 2000
      });
    },
    fail: (err) => {
      console.error('Save image error:', err);
      wx.showModal({
        title: '提示',
        content: '请授权保存到相册',
        showCancel: false
      });
    }
  });
}

module.exports = {
  generateCertificatePoster,
  drawBackground,
  drawTitle,
  drawContent,
  drawFooter,
  drawSeal,
  wrapText,
  shareToWeChat
};
