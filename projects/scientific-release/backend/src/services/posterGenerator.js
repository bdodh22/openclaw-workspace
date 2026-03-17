// backend/src/services/posterGenerator.js
const fs = require('fs');
const path = require('path');

/**
 * 分享海报生成服务
 * 生成高端设计感的放生分享海报
 */
class PosterGeneratorService {
  constructor() {
    this.posterDir = path.join(__dirname, '../../posters');
    this.fontDir = path.join(__dirname, '../../fonts');
    
    // 确保目录存在
    if (!fs.existsSync(this.posterDir)) {
      fs.mkdirSync(this.posterDir, { recursive: true });
    }
  }

  /**
   * 生成放生证书分享海报
   * @param {object} certificate - 证书信息
   * @param {object} user - 用户信息
   * @returns {string} 海报文件路径
   */
  async generateCertificatePoster(certificate, user) {
    const canvas = require('canvas');
    const { createCanvas, loadImage, registerFont } = canvas;

    // 注册字体（使用系统字体）
    try {
      registerFont(path.join(this.fontDir, 'STSong.ttf'), { family: 'STSong' });
    } catch (e) {
      console.log('Font not found, using default');
    }

    // 创建画布 (750x1334 - 手机屏幕比例)
    const width = 750;
    const height = 1334;
    const ctx = createCanvas(width, height).getContext('2d');

    // 1. 绘制背景 - 米宣纸色渐变
    const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
    bgGradient.addColorStop(0, '#F9F8F4');
    bgGradient.addColorStop(1, '#F2F0E9');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // 2. 绘制顶部装饰 - 黛绿色块
    ctx.fillStyle = '#4A5D4E';
    ctx.fillRect(0, 0, width, 200);

    // 3. 绘制标题
    ctx.fillStyle = '#C9A961'; // 暖沙金
    ctx.font = 'bold 48px STSong, serif';
    ctx.textAlign = 'center';
    ctx.fillText('放生功德证书', width / 2, 120);

    // 4. 绘制物种图标/图片
    if (certificate.speciesImage) {
      try {
        const speciesImg = await loadImage(certificate.speciesImage);
        const imgSize = 200;
        const imgX = (width - imgSize) / 2;
        const imgY = 240;
        
        // 圆形遮罩
        ctx.save();
        ctx.beginPath();
        ctx.arc(width / 2, imgY + imgSize / 2, imgSize / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        
        ctx.drawImage(speciesImg, imgX, imgY, imgSize, imgSize);
        ctx.restore();
      } catch (e) {
        console.log('Load species image failed:', e.message);
      }
    }

    // 5. 绘制证书内容
    const startY = 520;
    const lineHeight = 60;

    // 用户昵称
    ctx.fillStyle = '#3D3D3D';
    ctx.font = '32px STSong, sans-serif';
    ctx.fillText(`${user.nickname || '善心居士'}`, width / 2, startY);

    // 放生信息
    ctx.font = '28px STSong, sans-serif';
    ctx.fillStyle = '#6B6B6B';
    ctx.fillText(`于今日放生 ${certificate.speciesName || '物命'} ${certificate.quantity || 1} 只`, width / 2, startY + lineHeight);

    // 祈福愿文
    if (certificate.blessing) {
      ctx.font = 'italic 26px STSong, sans-serif';
      ctx.fillStyle = '#4A5D4E';
      
      const blessingLines = this.wrapText(ctx, certificate.blessing, width - 100);
      blessingLines.forEach((line, index) => {
        ctx.fillText(line, width / 2, startY + lineHeight * 2 + index * 40);
      });
    }

    // 6. 绘制功德编号
    ctx.font = 'bold 24px monospace';
    ctx.fillStyle = '#C9A961';
    ctx.fillText(`功德编号：${certificate.id || 'N/A'}`, width / 2, height - 300);

    // 7. 绘制日期
    ctx.font = '24px STSong, sans-serif';
    ctx.fillStyle = '#9A9A9A';
    const date = new Date().toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    ctx.fillText(date, width / 2, height - 250);

    // 8. 绘制二维码占位符（实际使用时替换为真实二维码）
    const qrSize = 120;
    const qrX = (width - qrSize) / 2;
    const qrY = height - 180;
    
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(qrX, qrY, qrSize, qrSize);
    ctx.strokeStyle = '#4A5D4E';
    ctx.lineWidth = 2;
    ctx.strokeRect(qrX, qrY, qrSize, qrSize);
    
    ctx.font = '16px sans-serif';
    ctx.fillStyle = '#4A5D4E';
    ctx.fillText('扫码参与', width / 2, qrY + qrSize + 20);

    // 9. 保存文件
    const filename = `certificate_${certificate.id}_${Date.now()}.png`;
    const filepath = path.join(this.posterDir, filename);
    
    const buffer = ctx.canvas.toBuffer('image/png');
    fs.writeFileSync(filepath, buffer);

    console.log(`✅ Poster generated: ${filepath}`);
    return filepath;
  }

  /**
   * 文本自动换行
   */
  wrapText(ctx, text, maxWidth) {
    const words = text.split('');
    const lines = [];
    let currentLine = '';

    for (const char of words) {
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
   * 生成日签分享海报
   */
  async generateDailyQuotePoster(quote, author) {
    const canvas = require('canvas');
    const { createCanvas } = canvas;

    const width = 750;
    const height = 1334;
    const ctx = createCanvas(width, height).getContext('2d');

    // 背景
    const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
    bgGradient.addColorStop(0, '#4A5D4E');
    bgGradient.addColorStop(1, '#2D3A32');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // 标题
    ctx.fillStyle = '#C9A961';
    ctx.font = 'bold 40px STSong, serif';
    ctx.textAlign = 'center';
    ctx.fillText('每日禅语', width / 2, 150);

    // 正文
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '36px STSong, sans-serif';
    
    const lines = this.wrapText(ctx, quote, width - 120);
    const startY = (height - lines.length * 60) / 2;
    
    lines.forEach((line, index) => {
      ctx.fillText(line, width / 2, startY + index * 60);
    });

    // 作者
    if (author) {
      ctx.font = '28px STSong, sans-serif';
      ctx.fillStyle = '#C9A961';
      ctx.fillText(`—— ${author}`, width / 2, startY + lines.length * 60 + 80);
    }

    // 保存
    const filename = `daily_quote_${Date.now()}.png`;
    const filepath = path.join(this.posterDir, filename);
    
    const buffer = ctx.canvas.toBuffer('image/png');
    fs.writeFileSync(filepath, buffer);

    return filepath;
  }
}

module.exports = PosterGeneratorService;
