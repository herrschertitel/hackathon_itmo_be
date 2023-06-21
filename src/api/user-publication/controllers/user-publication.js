'use strict';

/**
 * user-publication controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::user-publication.user-publication', ({ strapi }) => ({
  async publicationUser(ctx) {
    // if (!ctx.state.user || !ctx.state.user.id) {
    //   return ctx.request.status = 401;
    // }
    try {
      const data = await strapi.service('api::user-publication.user-publication').publicationUser(ctx.request.params.id);
      ctx.send({
        data
      })
    } catch (error) {
      return ctx.badRequest(error.message)
    }
  }
}));
