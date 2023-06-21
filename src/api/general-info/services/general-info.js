'use strict';

/**
 * general-info service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::general-info.general-info', ({ strapi }) => ({
  async scoreCategory(id) {
    try {
      const user = await strapi.query('plugin::users-permissions.user').findOne({
        where: { id: id },
        select: ['isu'],
      });
      const generalInfor = await strapi.query('api::general-info.general-info').findOne({
        where: { isu: user.isu },
        select: ['isu', 'full_name'],
        populate: {
          scoreCategory: true
        }
      });
      const sumScore = generalInfor.scoreCategory.BeHealthy + generalInfor.scoreCategory.BeFit + generalInfor.scoreCategory.BePro + generalInfor.scoreCategory.BeFriendly + generalInfor.scoreCategory.BeEco + generalInfor.scoreCategory.BeOpen;
      generalInfor.scoreCategory.sumScore = sumScore;
      return generalInfor;
    } catch (error) {
      throw error;
    }
  }
}));
