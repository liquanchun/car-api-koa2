const knex = require('../libraries/knex');

exports.getDataList = viewname => knex(viewname).where('IsValid', 1).select(`${viewname}.*`);

exports.getDataListById = (viewname, keyname, keyvalue) => knex(viewname).where(keyname, keyvalue).select(`${viewname}.*`);

exports.getDataListByWhere =
  (viewname, wherekey, wherevalue) => knex(viewname).whereRaw(wherekey, wherevalue);

exports.getDataById = (viewname, keyvalue) => knex(viewname).where('Id', keyvalue).select(`${viewname}.*`);

exports.updateData = (viewname, data) => knex(viewname).returning('id')
  .where('Id', data.Id)
  .update(data);

exports.addData = (viewname, data) => knex.returning('id').insert([data], 'id').into(viewname);

exports.deleteData = (viewname, id) => knex(viewname).where('Id', id).update('IsValid', 0);

exports.firstData = (viewname, id) => knex(viewname).where('Id', id).first();

exports.dataCount = tablename => knex(tablename).count('id as a');

exports.maxid = tablename => knex(tablename).max('id as a');
