'use strict';

/**
 * user-publication service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::user-publication.user-publication', ({ strapi }) => ({
  async publicationUser(userId) {
    try {
      const user = await strapi.query('plugin::users-permissions.user').findOne({
        where: { id: userId },
        select: ['isu'],
      });
      const publication = await strapi.entityService.findMany('api::user-publication.user-publication', {
        filters: {
          isu: user.isu,
        },
      });
      let idpublication = [];
      for (let i = 0; i < publication.length; i++) {
        idpublication.push(publication[i].publication)
      }
      const publications = await strapi.entityService.findMany('api::publication.publication', {
        filters: {
          id: {
            $in: idpublication
          }
        }
      });
      return ({
        publications
      })
    } catch (error) {
      throw error;
    }
  }
}));
