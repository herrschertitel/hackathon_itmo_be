'use strict';

/**
 * user-project controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::user-project.user-project', ({ strapi }) => ({
  async projectUser(ctx) {
    // if (!ctx.state.user || !ctx.state.user.id) {
    //   return ctx.request.status = 401;
    // }
    try {
      const data = await strapi.service('api::user-project.user-project').projectUser(ctx.request.params.id);
      ctx.send({
        data
      })
    } catch (error) {
      return ctx.badRequest(error.message)
    }
  }
}));
