const router = require('koa-router')();
const Dbview = require('../../models/dbview');
const _ = require('lodash');
/**
 * @api {post} /get data list
 * @apiVersion 1.0.0
 * @apiGroup DataBase
 * @apiName Datalist
 * @apiParam {String{1,255}} email user email
 * @apiParam {String{1,20}} password user password
 * @apiSampleRequest /api/select
 */
router.post('/api/select', async (ctx) => {
  const user = ctx.request.body.user;
  const view = ctx.request.body.view;
  const table = ctx.request.body.table;
  const paras = ctx.request.body.paras;

  const viewname = view || table;
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
        keysql.push(`${k} = ?`);
      }
      values.push(paras[k]);
    }
  });
  const hasvaild = Dbview.hasvaild(viewname);
  if (hasvaild) {
    keysql.push('isvalid');
    values.push(1);
  }
  const raw = _.join(keysql, ' and ');
  ctx.body = {
    ViewName: viewname,
    Data: await Dbview.getDataListByWhere(viewname, raw, values),
  };
});

/**
 * @api {post} /Edit data
 * @apiVersion 1.0.0
 * @apiGroup DataBase
 * @apiName Edit Data
 * @apiParam {String{1,255}} email user email
 * @apiParam {String{1,20}} password user password
 * @apiSampleRequest /api/update
 */
router.post('/api/update', async (ctx) => {
  const user = ctx.request.body.user;
  const table = ctx.request.body.table;
  const paras = ctx.request.body.paras;

  if (!paras.Id) {
    ctx.body = await Dbview.addData(table, paras);
  } else {
    const oldData = await Dbview.firstData(table, paras);
    if (!oldData) {
      ctx.body = {
        ViewName: table,
        Data: await Dbview.addData(table, paras),
      };
    } else {
      ctx.body = {
        ViewName: table,
        Data: await Dbview.updateData(table, paras),
      };
    }
  }
});

/**
 * @api {post} /api/delete Delete data by post params
 * @apiVersion 1.0.0
 * @apiName Delete Data By Where
 * @apiGroup DataBase
 * @apiSampleRequest /api/delete
 */
router.post('/api/delete', async (ctx) => {
  const user = ctx.request.body.user;
  const table = ctx.request.body.table;
  const paras = ctx.request.body.paras;

  const keys = _.keys(ctx.request.body);
  const keyword = [];
  const keysql = [];
  const values = [];
  keys.forEach((k) => {
    if (paras[k]) {
      if (k.includes('-')) {
        const kw = k.split('-')[0];
        if (keyword.includes(kw)) {
          keysql.push(k.split('-')[0] + ' <= ?');
        } else {
          keysql.push(k.split('-')[0] + ' >= ?');
        }
        keyword.push(kw);
      } else {
        keyword.push(k);
        keysql.push(k + ' = ?');
      }
      values.push(paras[k]);
    }
  });

  let raw = _.join(keysql, ' and ');
  ctx.body = {
    ViewName: table,
    Data: await Dbview.deleteByWhere(table, raw, values),
  };
});
