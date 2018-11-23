const knex = require('../libraries/knex');

exports.findOne = where => knex('sys_user')
  .select('sys_user.*')
  .where(where)
  .first();

exports.getList = () => knex('sys_user').select('sys_user.*');

exports.count = () => knex('sys_user').count().first();
