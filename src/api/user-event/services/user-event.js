'use strict';

/**
 * user-event service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::user-event.user-event', ({ strapi }) => ({
  async countScoreEvent(isu) {
    try {
      const user = await strapi.query('api::general-info.general-info').findOne({
        where: { isu: isu, },
        select: ['isu', 'full_name',],
        populate: {
          scoreCategory: true,
        }
      });
      const events = await strapi.entityService.findMany('api::user-event.user-event', {
        filters: {
          isu: isu,
        },
      });
      const scoreCategory = await strapi.entityService.findOne('api::type-event.type-event', 1, {
        populate: {
          event: true,
        }
      });
      const scoreRole = await strapi.entityService.findMany('api::role-score.role-score', {
        fields: ['role', 'score'],
      });
      const scoreRank = await strapi.entityService.findMany('api::rank-score.rank-score', {
        fields: ['rank', 'score'],
      });
      for (let i = 0; i < events.length; i++) {
        const detailEvent = await strapi.entityService.findOne('api::event.event', events[i].event, {
          fields: ['end_time', 'type']
        });
        if (detailEvent.end_time < 1687381200) {
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
            if (detailEvent.type === scoreCategory.event[j].name) {
              const categoryScore = scoreCategory.event[j];
              if (categoryScore.BeHealthy > 0) {
                user.scoreCategory.BeHealthy += rankScore * (categoryScore.BeHealthy + roleScore);
              }
              if (categoryScore.BeFit > 0) {
                user.scoreCategory.BeFit += rankScore * (categoryScore.BeFit + roleScore);
              }
              if (categoryScore.BePro > 0) {
                user.scoreCategory.BePro += rankScore * (categoryScore.BePro + roleScore);
              }
              if (categoryScore.BeFriendly > 0) {
                user.scoreCategory.BeFriendly += rankScore * (categoryScore.BeFriendly + roleScore);
              }
              if (categoryScore.BeEco > 0) {
                user.scoreCategory.BeEco += rankScore * (categoryScore.BeEco + roleScore);
              }
              if (categoryScore.BeOpen > 0) {
                user.scoreCategory.BeOpen += rankScore * (categoryScore.BeOpen + roleScore);
              }
              break;
            }
          }
        }
      }
      await strapi.entityService.update('api::general-info.general-info', user.id, {
        data: {
          scoreCategory: user.scoreCategory,
        }
      })
      return ({
        user,
      });
    } catch (error) {
      throw error;
    }
  },

  async registeredEvents(id) {
    try {
      // let eventsHappended = [], eventsNotHappended = [];
      const user = await strapi.query('plugin::users-permissions.user').findOne({
        where: { id: id },
        select: ['isu'],
      });
      const events = await strapi.entityService.findMany('api::user-event.user-event', {
        filters: {
          isu: user.isu,
        },
      });
      let idEvents = [];
      for (let i = 0; i < events.length; i++) {
        idEvents.push(events[i].event)
      }
      const eventsHappended = await strapi.entityService.findMany('api::event.event', {
        fields: ['name', 'start_time', 'end_time', 'type',],
        filters: {
          $and: [
            {
              id: {
                $in: idEvents
              }
            }, {
              end_time: {
                $lt: 1687381200
              }
            },
          ]
        }
      });
      const eventsNotHappended = await strapi.entityService.findMany('api::event.event', {
        fields: ['name', 'start_time', 'end_time', 'type',],
        filters: {
          $and: [
            {
              id: {
                $in: idEvents
              }
            }, {
              start_time: {
                $gt: 1687381200
              }
            },
          ]
        }
      });
      const scoreCategory = await strapi.entityService.findOne('api::type-event.type-event', 1, {
        populate: {
          event: true,
        }
      });
      for (let i = 0; i < eventsHappended.length; i++) {
        eventsHappended[i].start_time = new Date(eventsHappended[i].start_time * 1000);
        eventsHappended[i].end_time = new Date(eventsHappended[i].end_time * 1000);
        for (let j = 0; j < scoreCategory.event.length; j++) {
          let categoryEvent = [];
          if (eventsHappended[i].type === scoreCategory.event[j].name) {
            const categoryScore = scoreCategory.event[j];
            if (categoryScore.BeHealthy > 0) {
              categoryEvent.push('BeHealthy');
            }
            if (categoryScore.BeFit > 0) {
              categoryEvent.push('BeFit');
            }
            if (categoryScore.BePro > 0) {
              categoryEvent.push('BePro');
            }
            if (categoryScore.BeFriendly > 0) {
              categoryEvent.push('BeFriendly');
            }
            if (categoryScore.BeEco > 0) {
              categoryEvent.push('BeEco');
            }
            if (categoryScore.BeOpen > 0) {
              categoryEvent.push('BeOpen');
            }
            eventsHappended[i].categoryEvent = categoryEvent;
            break;
          }
        }
      }
      for (let i = 0; i < eventsNotHappended.length; i++) {
        eventsNotHappended[i].start_time = new Date(eventsNotHappended[i].start_time * 1000);
        eventsNotHappended[i].end_time = new Date(eventsNotHappended[i].end_time * 1000);
        for (let j = 0; j < scoreCategory.event.length; j++) {
          let categoryEvent = [];
          if (eventsNotHappended[i].type === scoreCategory.event[j].name) {
            const categoryScore = scoreCategory.event[j];
            if (categoryScore.BeHealthy > 0) {
              categoryEvent.push('BeHealthy');
            }
            if (categoryScore.BeFit > 0) {
              categoryEvent.push('BeFit');
            }
            if (categoryScore.BePro > 0) {
              categoryEvent.push('BePro');
            }
            if (categoryScore.BeFriendly > 0) {
              categoryEvent.push('BeFriendly');
            }
            if (categoryScore.BeEco > 0) {
              categoryEvent.push('BeEco');
            }
            if (categoryScore.BeOpen > 0) {
              categoryEvent.push('BeOpen');
            }
            eventsNotHappended[i].categoryEvent = categoryEvent;
            break;
          }
        }
      }
      return ({
        eventsHappended,
        eventsNotHappended,
      })
    } catch (error) {
      throw error;
    }
  },

  async notRegisteredEvents(userId) {
    try {
      let id = [];
      const user = await strapi.query('plugin::users-permissions.user').findOne({
        where: { id: userId },
        select: ['isu'],
      });
      const events = await strapi.entityService.findMany('api::user-event.user-event', {
        filters: {
          isu: user.isu,
        },
      });
      for (let i = 0; i < events.length; i++) {
        id.push(events[i].event)
      }

      const eventsNotHappend = await strapi.entityService.findMany('api::event.event', {
        fields: ['name', 'start_time', 'end_time', 'type'],
        filters: {
          $and: [
            {
              id: {
                $notIn: id
              }
            }, {
              start_time: {
                $gt: 1687381200
              }
            },
          ]
        }
      });
      const scoreCategory = await strapi.entityService.findOne('api::type-event.type-event', 1, {
        populate: {
          event: true,
        }
      });
      for (let i = 0; i < eventsNotHappend.length; i++) {
        eventsNotHappend[i].start_time = new Date(eventsNotHappend[i].start_time * 1000);
        eventsNotHappend[i].end_time = new Date(eventsNotHappend[i].end_time * 1000);
        for (let j = 0; j < scoreCategory.event.length; j++) {
          let categoryEvent = [];
          if (eventsNotHappend[i].type === scoreCategory.event[j].name) {
            const categoryScore = scoreCategory.event[j];
            if (categoryScore.BeHealthy > 0) {
              categoryEvent.push('BeHealthy');
            }
            if (categoryScore.BeFit > 0) {
              categoryEvent.push('BeFit');
            }
            if (categoryScore.BePro > 0) {
              categoryEvent.push('BePro');
            }
            if (categoryScore.BeFriendly > 0) {
              categoryEvent.push('BeFriendly');
            }
            if (categoryScore.BeEco > 0) {
              categoryEvent.push('BeEco');
            }
            if (categoryScore.BeOpen > 0) {
              categoryEvent.push('BeOpen');
            }
            eventsNotHappend[i].categoryEvent = categoryEvent;
            break;
          }
        }
      }
      return ({
        eventsNotHappend,
      })
    } catch (error) {
      throw error;
    }
  },

  async filterEvent(category, type, userId) {
    try {
      if (typeof (category) === 'string') {
        category = category.split(" ")
      }
      if (typeof (type) === 'string') {
        type = type.split(" ")
      }
      let id = [];
      const user = await strapi.query('plugin::users-permissions.user').findOne({
        where: { id: userId },
        select: ['isu'],
      });
      const events = await strapi.entityService.findMany('api::user-event.user-event', {
        filters: {
          isu: user.isu,
        },
      });
      for (let i = 0; i < events.length; i++) {
        id.push(events[i].event)
      }
      const eventsHappended = await strapi.entityService.findMany('api::event.event', {
        fields: ['name', 'start_time', 'end_time', 'type',],
        filters: {
          $and: [
            {
              id: {
                $in: id
              }
            }, {
              end_time: {
                $lt: 1687381200
              }
            },
          ]
        }
      });
      const eventsRegistered = await strapi.entityService.findMany('api::event.event', {
        fields: ['name', 'start_time', 'end_time', 'type',],
        filters: {
          $and: [
            {
              id: {
                $in: id
              }
            }, {
              start_time: {
                $gt: 1687381200
              }
            },
          ]
        }
      });
      const eventsNotRegistered = await strapi.entityService.findMany('api::event.event', {
        fields: ['name', 'start_time', 'end_time', 'type'],
        filters: {
          $and: [
            {
              id: {
                $notIn: id
              }
            }, {
              start_time: {
                $gt: 1687381200
              }
            },
          ]
        }
      });
      const scoreCategory = await strapi.entityService.findOne('api::type-event.type-event', 1, {
        populate: {
          event: true,
        }
      });
      if (category === null || category === undefined) {
        category = ['BeHealthy', 'BeFit', 'BePro', 'BeFriendly', 'BeEco', 'BeOpen'];
      }
      if (type === null || type === undefined) {
        type = [];
        for (let i = 0; i < scoreCategory.event.length; i++) {
          type.push(scoreCategory.event[i].name);
        }
      }
      for (let i = 0; i < eventsHappended.length; i++) {
        eventsHappended[i].start_time = new Date(eventsHappended[i].start_time * 1000);
        eventsHappended[i].end_time = new Date(eventsHappended[i].end_time * 1000);
        for (let j = 0; j < scoreCategory.event.length; j++) {
          let categoryEvent = [];
          if (eventsHappended[i].type === scoreCategory.event[j].name) {
            const categoryScore = scoreCategory.event[j];
            if (categoryScore.BeHealthy > 0) {
              categoryEvent.push('BeHealthy');
            }
            if (categoryScore.BeFit > 0) {
              categoryEvent.push('BeFit');
            }
            if (categoryScore.BePro > 0) {
              categoryEvent.push('BePro');
            }
            if (categoryScore.BeFriendly > 0) {
              categoryEvent.push('BeFriendly');
            }
            if (categoryScore.BeEco > 0) {
              categoryEvent.push('BeEco');
            }
            if (categoryScore.BeOpen > 0) {
              categoryEvent.push('BeOpen');
            }
            eventsHappended[i].categoryEvent = categoryEvent;
            break;
          }
        }
      }
      for (let i = 0; i < eventsRegistered.length; i++) {
        eventsRegistered[i].start_time = new Date(eventsRegistered[i].start_time * 1000);
        eventsRegistered[i].end_time = new Date(eventsRegistered[i].end_time * 1000);
        for (let j = 0; j < scoreCategory.event.length; j++) {
          let categoryEvent = [];
          if (eventsRegistered[i].type === scoreCategory.event[j].name) {
            const categoryScore = scoreCategory.event[j];
            if (categoryScore.BeHealthy > 0) {
              categoryEvent.push('BeHealthy');
            }
            if (categoryScore.BeFit > 0) {
              categoryEvent.push('BeFit');
            }
            if (categoryScore.BePro > 0) {
              categoryEvent.push('BePro');
            }
            if (categoryScore.BeFriendly > 0) {
              categoryEvent.push('BeFriendly');
            }
            if (categoryScore.BeEco > 0) {
              categoryEvent.push('BeEco');
            }
            if (categoryScore.BeOpen > 0) {
              categoryEvent.push('BeOpen');
            }
            eventsRegistered[i].categoryEvent = categoryEvent;
            break;
          }
        }
      }
      for (let i = 0; i < eventsNotRegistered.length; i++) {
        eventsNotRegistered[i].start_time = new Date(eventsNotRegistered[i].start_time * 1000);
        eventsNotRegistered[i].end_time = new Date(eventsNotRegistered[i].end_time * 1000);
        for (let j = 0; j < scoreCategory.event.length; j++) {
          let categoryEvent = [];
          if (eventsNotRegistered[i].type === scoreCategory.event[j].name) {
            const categoryScore = scoreCategory.event[j];
            if (categoryScore.BeHealthy > 0) {
              categoryEvent.push('BeHealthy');
            }
            if (categoryScore.BeFit > 0) {
              categoryEvent.push('BeFit');
            }
            if (categoryScore.BePro > 0) {
              categoryEvent.push('BePro');
            }
            if (categoryScore.BeFriendly > 0) {
              categoryEvent.push('BeFriendly');
            }
            if (categoryScore.BeEco > 0) {
              categoryEvent.push('BeEco');
            }
            if (categoryScore.BeOpen > 0) {
              categoryEvent.push('BeOpen');
            }
            eventsNotRegistered[i].categoryEvent = categoryEvent;
            break;
          }
        }
      }
      let eventsHappendedResult = [], eventsRegisteredResult = [], eventsNotRegisteredResult = [];
      for (let i = 0; i < eventsHappended.length; i++) {
        if (type.includes(eventsHappended[i].type)) {
          for (let j = 0; j < eventsHappended[i].categoryEvent.length; j++) {
            if (category.includes(eventsHappended[i].categoryEvent[j])) {
              eventsHappendedResult.push(eventsHappended[i]);
              break
            }
          }
          continue;
        }
      }
      for (let i = 0; i < eventsRegistered.length; i++) {
        if (type.includes(eventsRegistered[i].type)) {
          for (let j = 0; j < eventsRegistered[i].categoryEvent.length; j++) {
            if (category.includes(eventsRegistered[i].categoryEvent[j])) {
              eventsRegisteredResult.push(eventsRegistered[i]);
              break
            }
          }
          continue;
        }
      }
      for (let i = 0; i < eventsNotRegistered.length; i++) {
        if (type.includes(eventsNotRegistered[i].type)) {
          for (let j = 0; j < eventsNotRegistered[i].categoryEvent.length; j++) {
            if (category.includes(eventsNotRegistered[i].categoryEvent[j])) {
              eventsNotRegisteredResult.push(eventsNotRegistered[i]);
              break
            }
          }
          continue;
        }
      }
      return ({
        eventsHappendedResult,
        eventsRegisteredResult,
        eventsNotRegisteredResult
      })
    } catch (error) {
      throw error;
    }
  }
}));
