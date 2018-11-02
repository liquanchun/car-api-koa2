const knex = require('../libraries/knex');

// 获取全部数据
exports.getDataList =
  viewname => knex(viewname).where('IsValid', 1).select(`${viewname}.*`);

// 获取分页数据
exports.getDataListByPage =
  (viewname, pagesize, pageindex) => knex.select('*')
  .from(viewname)
  .where('IsValid', 1)
  .limit(pagesize)
  .offset((pageindex - 1) * pagesize)

// 根据查询条件获取分页数据
exports.getDataListWhereByPage =
  (viewname, wherekey, wherevalue, pagesize, pageindex) => knex.select('*')
  .from(viewname)
  .whereRaw(wherekey, wherevalue)
  .limit(pagesize)
  .offset((pageindex - 1) * pagesize);

// 根据键对值查询数据
exports.getDataListByPara =
  (viewname, keyname, keyvalue) => knex(viewname).where('IsValid', 1).where(keyname, keyvalue);

// 根据多个条件查询数据列表
exports.getDataListByWhere =
  (viewname, wherekey, wherevalue) => knex(viewname).whereRaw(wherekey, wherevalue);

// 根据Id更新记录
exports.updateData =
  (viewname, data) => knex(viewname).returning('id')
  .where('Id', data.Id)
  .update(data);

// 新增记录
exports.addData =
  (viewname, data) => knex.returning('id').insert([data], 'id').into(viewname);

// 根据Id获取一条记录
exports.firstData =
  (viewname, id) => knex(viewname).where('Id', id).first();

// 获取表记录总数
exports.dataCount =
  tablename => knex(tablename).where('IsValid', 1).count('id as a');

// 获取表最多Id
exports.maxid =
  tablename => knex(tablename).max('id as a');

exports.hasvaild =
  tablename => knex.schema.hasColumn(tablename, 'IsValid');

// 根据Id  删除数据
exports.deleteData =
  (viewname, id) => knex(viewname).where('Id', id).update('IsValid', 0);

// 根据Id  彻底删除数据
exports.deleteDataAll =
  (viewname, id) => knex(viewname).where('Id', id).del();

// 根据键对值 删除数据
exports.deleteByPara =
  (viewname, keyname, keyvalue) => knex(viewname).where(keyname, keyvalue).update('IsValid', 0);

// 根据键对值 彻底删除数据
exports.deleteallByPara =
  (viewname, keyname, keyvalue) => knex(viewname).where(keyname, keyvalue).del();

// 根据多条件 删除数据
exports.deleteByWhere =
  (viewname, wherekey, wherevalue) => knex(viewname).whereRaw(wherekey, wherevalue).update('IsValid', 0);

// 根据多条件 彻底删除数据
exports.deleteallByWhere =
  (viewname, wherekey, wherevalue) => knex(viewname).whereRaw(wherekey, wherevalue).del();
