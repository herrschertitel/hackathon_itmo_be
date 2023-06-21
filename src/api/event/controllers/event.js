'use strict';

/**
 * event controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::event.event', ({strapi}) => ({
  async countScore(ctx) {
    try {
      const data = await strapi.service('api::event.event').countScore(ctx.request.body.isu);
      ctx.send({
        data : data
      })
      return data;
    } catch (error) {
      return ctx.badRequest(error.message);
    }
  }
}));
