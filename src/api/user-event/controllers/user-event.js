'use strict';

/**
 * user-event controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::user-event.user-event', ({ strapi }) => ({
  async countScoreEvent(ctx) {
    try {
      const data = await strapi.service('api::user-event.user-event').countScoreEvent(ctx.request.body.isu);
      ctx.send({
        data
      })
    } catch (error) {
      return ctx.badRequest(error.message);
    }
  },

  async registeredEvents(ctx) {
    try {
      if (!ctx.state.user || !ctx.state.user.id) {
        return ctx.request.status = 401;
      }
      const data = await strapi.service('api::user-event.user-event').registeredEvents(ctx.state.user.id);
      ctx.send({
        data
      })
    } catch (error) {
      return ctx.badRequest(error.message);
    }
  },

  async notRegisteredEvents(ctx) {
    try {
      if (!ctx.state.user || !ctx.state.user.id) {
        return ctx.request.status = 401;
      }
      const data = await strapi.service('api::user-event.user-event').notRegisteredEvents(ctx.state.user.id);
      ctx.send({
        data
      })
    } catch (error) {
      return ctx.badRequest(error.message);
    }
  },

  async filterEvent(ctx) {
    try {
      if (!ctx.state.user || !ctx.state.user.id) {
        return ctx.request.status = 401;
      }
      const data = await strapi.service('api::user-event.user-event').filterEvent(ctx.request.body.category, ctx.request.body.type, ctx.state.user.id);
      ctx.send({
        data
      })
    } catch (error) {
      return ctx.badRequest(error.message);
    }
  }
}));
