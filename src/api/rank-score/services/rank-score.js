'use strict';

/**
 * rank-score service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::rank-score.rank-score');
