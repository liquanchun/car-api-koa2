const knex = require('../libraries/knex');

exports.findOne = where => knex('sys_user')
  .select('sys_user.*')
  .where(where)
  .first();

exports.findProfileById = id => knex('sys_user')
  .select('sys_user.*', knex.raw('row_to_json(tb_country) as country'))
  .leftJoin('tb_country', 'tb_country.id', '=', 'sys_user.country_id')
  .where('sys_user.id', id)
  .first();

exports.getList = () => knex('sys_user').select('sys_user.*');

exports.count = () => knex('sys_user').count().first();
