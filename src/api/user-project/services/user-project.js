'use strict';

/**
 * user-project service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::user-project.user-project', ({ strapi }) => ({
  async find(userId) {
    try {
      const user = await strapi.query('plugin::users-permissions.user').findOne({
        where: { id: userId },
        select: ['isu'],
      });
      const project = await strapi.entityService.findMany('api::user-project.user-project', {
        filters: {
          isu: user.isu,
        },
      });
      let idProject = [];
      for (let i = 0; i < project.length; i++) {
        idProject.push(project[i].project)
      }
      const projects = await strapi.entityService.findMany('api::project.project', {
        filters: {
          id: {
            $in: idProject
          }
        }
      });
      for (let i = 0; i < projects.length; i++) {
        projects[i].start_time = new Date(projects[i].start_time * 1000);
        projects[i].end_time = new Date(projects[i].end_time * 1000);
      }
      return ({
        projects
      })
    } catch (error) {
      throw error;
    }
  }
}));
