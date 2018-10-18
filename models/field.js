const knex = require('../libraries/knex');

exports.findOne = where => knex('form_ListField')
  .select('form_ListField.*')
  .where(where)
  .first();

exports.getFieldList = () => knex('form_ListField')
  .where('IsValid', 1)
  .select('form_ListField.*')
  .orderByRaw('ViewName,OrderInd desc');

exports.getFieldListd = () => knex.select('FieldName').from('form_ListField').limit(10);

exports.getFieldListByName = viewname => knex('form_ListField')
  .where({ IsValid: 1, ViewName: viewname })
  .select('form_ListField.*')
  .orderByRaw('ViewName,OrderInd desc');

exports.getFieldRoleList = () => knex('form_FieldRole').where('IsValid', 1).select('form_FieldRole.*');

exports.addField = fields => knex.returning('id').insert([fields], 'id').into('form_ListField');

exports.addFieldRole = fields => knex.returning('id').insert([fields], 'id').into('form_FieldRole');

exports.addFieldRoles = fieldRole => knex('form_FieldRole').insert(fieldRole);

exports.updateField = fields => knex('form_ListField').returning('id')
  .where({ ViewName: fields.ViewName, FieldName: fields.FieldName })
  .update(fields);

exports.updateFieldRole = fields => knex('form_FieldRole').returning('id')
  .where({ FieldId: fields.FieldId, RoleId: fields.RoleId })
  .update(fields);

exports.firstField = where => knex('form_ListField').where(where).first();

exports.firstFieldRole = where => knex('form_FieldRole').where(where).first();

exports.deleteFieldRole = ids => knex('form_FieldRole').whereIn('FieldId', ids).del();

exports.deleteField = where => knex('form_ListField').where(where).del();
