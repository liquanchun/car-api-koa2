const knex = require('../libraries/knex');

exports.getDataList =
  (viewname) => {
    return new Promise((resolve, reject) => {
      if (knex.schema.hasColumn(viewname, 'IsValid')) {
        resolve(knex(viewname).where('IsValid', 1).select(`${viewname}.*`));
      } else {
        resolve(knex(viewname).select(`${viewname}.*`));
      }
    });
  };

exports.getDataListByPage =
  (viewname, pagesize, pageindex) => {
    return new Promise((resolve, reject) => {
      if (knex.schema.hasColumn(viewname, 'IsValid')) {
        resolve(knex.select('*')
          .from(viewname)
          .where('IsValid', 1)
          .limit(pagesize)
          .offset((pageindex - 1) * pagesize));
      } else {
        resolve(knex.select('*')
          .from(viewname)
          .limit(pagesize)
          .offset((pageindex - 1) * pagesize));
      }
    });
  };

exports.getDataListWhereByPage =
  (viewname, wherekey, wherevalue, pagesize, pageindex) => knex.select('*')
    .from(viewname)
    .whereRaw(wherekey, wherevalue)
    .limit(pagesize)
    .offset((pageindex - 1) * pagesize);

exports.getDataListByPara =
  (viewname, keyname, keyvalue) => {
    return new Promise((resolve, reject) => {
      if (knex.schema.hasColumn(viewname, 'IsValid')) {
        resolve(knex(viewname).where('IsValid', 1).where(keyname, keyvalue));
      } else {
        resolve(knex(viewname).where(keyname, keyvalue));
      }
    });
  };

exports.getDataListByWhere =
  (viewname, wherekey, wherevalue) => knex(viewname).whereRaw(wherekey, wherevalue);

exports.updateData =
  (viewname, data) => knex(viewname).returning('id')
    .where('Id', data.Id)
    .update(data);

exports.addData =
  (viewname, data) => knex.returning('id').insert([data], 'id').into(viewname);

exports.firstData =
  (viewname, id) => knex(viewname).where('Id', id).first();

exports.dataCount =
  (tablename) => {
    return new Promise((resolve, reject) => {
      if (knex.schema.hasColumn(tablename, 'IsValid')) {
        resolve(knex(tablename).where('IsValid', 1).count('id as a'));
      } else {
        resolve(knex(tablename).count('id as a'));
      }
    });
  };

exports.maxid =
  tablename => knex(tablename).max('id as a');

exports.hasvaild =
  tablename => knex.schema.hasColumn(tablename, 'IsValid');


exports.deleteData =
  (viewname, id) => knex(viewname).where('Id', id).update('IsValid', 0);

exports.deleteDataAll =
  (viewname, id) => knex(viewname).where('Id', id).del();

exports.deleteByPara =
  (viewname, keyname, keyvalue) => knex(viewname).where(keyname, keyvalue).update('IsValid', 0);

exports.deleteallByPara =
  (viewname, keyname, keyvalue) => knex(viewname).where(keyname, keyvalue).del();

exports.deleteByWhere =
  (viewname, wherekey, wherevalue) => knex(viewname).whereRaw(wherekey, wherevalue).update('IsValid', 0);

exports.deleteallByWhere =
  (viewname, wherekey, wherevalue) => knex(viewname).whereRaw(wherekey, wherevalue).del();
