'use strict';

/**
 * event service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::event.event', ({ strapi }) => ({
  async countScore(isu) {
    try {
      const events = await strapi.entityService.findMany('api::event.event', {
        filters: {
          isu: isu
        },
        fields: ['type', 'role', 'rank'],
      })
      const user = await strapi.query('api::general-info.general-info').findOne({
        where: { isu: isu },
        select: ['isu', 'full_name'],
        populate: {
          scoreCategory: true
        }
      });
      const scoreCategory = await strapi.entityService.findOne('api::type-event.type-event', 1, {
        populate: {
          event: true
        }
      })
      const scoreRole = await strapi.entityService.findMany('api::role-score.role-score', {
        fields: ['role', 'score']
      });
      const scoreRank = await strapi.entityService.findMany('api::rank-score.rank-score', {
        fields: ['rank', 'score']
      });
      for (let i = 0; i < events.length; i++) {
        let roleScore = 0, rankScore = 0;
        for (let j = 0; j < scoreRole.length; j++) {
          if (events[i].role === scoreRole[j].role) {
            roleScore = scoreRole[j].score;
          }
        }
        for (let j = 0; j < scoreRank.length; j++) {
          if (events[i].rank === scoreRank[j].rank) {
            rankScore = scoreRank[j].score;
          }
        }
        for (let j = 0; j < scoreCategory.event.length; j++) {
          if (events[i].type === scoreCategory.event[j].name) {
            const categoryScore = scoreCategory.event[j];
            if (categoryScore.BeHealthy > 0) {
              user.scoreCategory.BeHealthy += rankScore * (categoryScore.BeHealthy + roleScore)
            }
            if (categoryScore.BeFit > 0) {
              user.scoreCategory.BeFit += rankScore * (categoryScore.BeFit + roleScore)
            }
            if (categoryScore.BePro > 0) {
              user.scoreCategory.BePro += rankScore * (categoryScore.BePro + roleScore)
            }
            if (categoryScore.BeFriendly > 0) {
              user.scoreCategory.BeFriendly += rankScore * (categoryScore.BeFriendly + roleScore)
            }
            if (categoryScore.BeEco > 0) {
              user.scoreCategory.BeEco += rankScore * (categoryScore.BeEco + roleScore)
            }
            if (categoryScore.BeOpen > 0) {
              user.scoreCategory.BeOpen += rankScore * (categoryScore.BeOpen + roleScore)
            }
          }
        }
      }
      await strapi.entityService.update('plugin::users-permissions.user', user.id, {
        data: {
          scoreCategory: user.scoreCategory
        }
      })
      return ({
        user,
      });
    } catch (error) {
      throw error;
    }
  }
}));
