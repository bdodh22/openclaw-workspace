// backend/src/services/achievementService.js
const { Achievement, User } = require('../models');

/**
 * 成就与积分服务
 */
class AchievementService {
  constructor() {
    // 成就配置
    this.achievementConfigs = {
      first_release: {
        title: '初发行善',
        description: '首次参与科学放生',
        icon: '🌱',
        merit: 10
      },
      release_count_10: {
        title: '善心居士',
        description: '累计放生 10 次',
        icon: '🙏',
        merit: 50
      },
      release_count_50: {
        title: '慈悲行者',
        description: '累计放生 50 次',
        icon: '🕊️',
        merit: 200
      },
      release_count_100: {
        title: '放生大师',
        description: '累计放生 100 次',
        icon: '🏆',
        merit: 500
      },
      species_collector: {
        title: '物种守护者',
        description: '了解 10 种放生物种',
        icon: '📚',
        merit: 30
      },
      zen_master: {
        title: '禅修达人',
        description: '连续签到 7 天',
        icon: '🧘',
        merit: 100
      },
      guardian: {
        title: '生态守护者',
        description: '参与保护 5 种濒危物种',
        icon: '🛡️',
        merit: 300
      },
      ambassador: {
        title: '善行大使',
        description: '成功邀请 10 位好友',
        icon: '🌟',
        merit: 500
      }
    };
  }

  /**
   * 检查并解锁成就
   */
  async checkAndUnlockAchievements(userId, action, metadata = {}) {
    const unlockedAchievements = [];

    try {
      // 根据行为类型检查成就
      switch (action) {
        case 'first_release':
          if (metadata.count === 1) {
            const achievement = await this.unlockAchievement(userId, 'first_release');
            if (achievement) unlockedAchievements.push(achievement);
          }
          break;

        case 'release_count':
          const count = metadata.totalReleases || 0;
          if (count >= 100) {
            const achievement = await this.unlockAchievement(userId, 'release_count_100');
            if (achievement) unlockedAchievements.push(achievement);
          } else if (count >= 50) {
            const achievement = await this.unlockAchievement(userId, 'release_count_50');
            if (achievement) unlockedAchievements.push(achievement);
          } else if (count >= 10) {
            const achievement = await this.unlockAchievement(userId, 'release_count_10');
            if (achievement) unlockedAchievements.push(achievement);
          }
          break;

        case 'species_viewed':
          const speciesCount = metadata.speciesCount || 0;
          if (speciesCount >= 10) {
            const achievement = await this.unlockAchievement(userId, 'species_collector');
            if (achievement) unlockedAchievements.push(achievement);
          }
          break;

        case 'check_in':
          const streak = metadata.streak || 0;
          if (streak >= 7) {
            const achievement = await this.unlockAchievement(userId, 'zen_master');
            if (achievement) unlockedAchievements.push(achievement);
          }
          break;
      }

      // 如果有新成就，更新用户积分
      if (unlockedAchievements.length > 0) {
        const totalMerit = unlockedAchievements.reduce((sum, a) => sum + a.merit, 0);
        await this.addMerit(userId, totalMerit, 'achievement_reward');
      }

      return unlockedAchievements;
    } catch (error) {
      console.error('Check achievements error:', error);
      return [];
    }
  }

  /**
   * 解锁成就
   */
  async unlockAchievement(userId, type) {
    try {
      // 检查是否已解锁
      const existing = await Achievement.findOne({
        where: { userId, type }
      });

      if (existing) {
        return null; // 已经解锁过
      }

      // 创建成就记录
      const config = this.achievementConfigs[type];
      if (!config) {
        console.warn(`Unknown achievement type: ${type}`);
        return null;
      }

      const achievement = await Achievement.create({
        userId,
        type,
        title: config.title,
        description: config.description,
        icon: config.icon,
        merit: config.merit
      });

      console.log(`✅ User ${userId} unlocked achievement: ${config.title}`);
      return achievement;
    } catch (error) {
      console.error('Unlock achievement error:', error);
      return null;
    }
  }

  /**
   * 添加积分
   */
  async addMerit(userId, amount, source = 'default') {
    try {
      const user = await User.findByPk(userId);
      if (!user) return null;

      user.totalMerit += amount;
      await user.save();

      console.log(`✅ Added ${amount} merit to user ${userId} (source: ${source})`);
      return user.totalMerit;
    } catch (error) {
      console.error('Add merit error:', error);
      return null;
    }
  }

  /**
   * 获取用户成就列表
   */
  async getUserAchievements(userId) {
    try {
      const achievements = await Achievement.findAll({
        where: { userId },
        order: [['unlockedAt', 'DESC']]
      });

      // 计算总成就和进度
      const totalTypes = Object.keys(this.achievementConfigs).length;
      const unlockedTypes = achievements.length;
      const progress = Math.round((unlockedTypes / totalTypes) * 100);

      return {
        achievements,
        total: totalTypes,
        unlocked: unlockedTypes,
        progress
      };
    } catch (error) {
      console.error('Get achievements error:', error);
      return null;
    }
  }

  /**
   * 获取所有成就配置（用于前端展示）
   */
  getAllAchievementConfigs() {
    return Object.values(this.achievementConfigs);
  }
}

module.exports = AchievementService;
