const _ = require('lodash');
const Dbview = require('../models/dbview');
// 解析post 参数
exports.resolve = (paras, andor = 'and') => {
  const keys = _.keys(paras);
  const keyword = [];
  const keysql = [];
  const values = [];
  keys.forEach((k) => {
    if (paras[k]) {
      if (k.includes('-')) {
        const kw = k.split('-')[0];
        if (keyword.includes(kw)) {
          keysql.push(`${k.split('-')[0]} <= ?`);
        } else {
          keysql.push(`${k.split('-')[0]} >= ?`);
        }
        keyword.push(kw);
      } else {
        keyword.push(k);
        keysql.push(`${k} like ?`);
      }
      values.push(paras[k]);
    }
  });

  const raw = `(${_.join(keysql, ` ${andor} `)}) And (IsValid = 1)`;
  return [raw, values];
};
