'use strict';

/**
 * general-info controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::general-info.general-info', ({ strapi }) => ({
  async scoreCategory(ctx) {
    // if (!ctx.state.user || !ctx.state.user.id) {
    //   return ctx.request.status = 401;
    // }
    try {
      const data = await strapi.service('api::general-info.general-info').scoreCategory(ctx.request.params.id);
      ctx.send({
        data
      })
    } catch (error) {
      return ctx.badRequest(error.message)
    }
  }
}));
