const router = require('koa-router')();
const Dbview = require('../../models/dbview');
const _ = require('lodash');
/**
 * @api {get} /api/data/:view_name Get Data List
 * @apiVersion 1.0.0
 * @apiGroup DataBase
 * @apiName GetDataList
 * @apiSampleRequest /api/data/:view_name
 */
router.get('/api/data/:view_name', async (ctx) => {
  ctx.checkParams('view_name').notEmpty('view_name is required');
  ctx.body = {
    ViewName: ctx.params.view_name,
    Data: await Dbview.getDataList(ctx.params.view_name),
  };
});

/**
 * @api {post} /api/datalist/:view_name get data list
 * @apiVersion 1.0.0
 * @apiName DataBase
 * @apiGroup DataBase
 * @apiParam {String{1,50}} InDate-1 入库起始日期
 * @apiParam {String{1,50}} InDate-2 入库截止日期
 * @apiParam {String{1,50}} Status 状态
 * @apiSampleRequest /api/datalist/:view_name
 */
router.post('/api/datalist/:view_name', async (ctx) => {
  ctx.checkParams('view_name').notEmpty('view_name is required');
  const keys = _.keys(ctx.request.body);
  const keyword = [];
  const keysql = [];
  const values = [];
  keys.forEach((k) => {
    if (ctx.request.body[k]) {
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
      values.push(ctx.request.body[k]);
    }
  });
  let raw = _.join(keysql, ' and ');
  console.log(raw);
  console.log(values);
  ctx.body = {
    ViewName: ctx.params.view_name,
    Data: await Dbview.getDataListByWhere(ctx.params.view_name, raw, values),
  };
});

/**
 * @api {get} /api/data/:view_name/:keyname/:keyvalue Get Data List by ID
 * @apiVersion 1.0.0
 * @apiGroup DataBase
 * @apiName GetDataListById
 * @apiSampleRequest /api/data/:view_name/:keyname/:keyvalue
 */
router.get('/api/data/:view_name/:keyname/:keyvalue', async (ctx) => {
  ctx.checkParams('view_name').notEmpty('view_name is required');
  ctx.checkParams('keyname').notEmpty('keyname is required');
  ctx.checkParams('keyvalue').notEmpty('keyvalue is required');
  ctx.body = {
    ViewName: ctx.params.view_name,
    Data: await Dbview.getDataListById(ctx.params.view_name, ctx.params.keyname, ctx.params.keyvalue),
  };
});

/**
 * @api {get} /api/data/:view_name/:keyvalue Get Data by ID
 * @apiVersion 1.0.0
 * @apiGroup DataBase
 * @apiName GetDataById
 * @apiSampleRequest /api/data/:view_name/:keyvalue
 */
router.get('/api/data/:view_name/:keyvalue', async (ctx) => {
  ctx.checkParams('view_name').notEmpty('view_name is required');
  ctx.checkParams('keyvalue').notEmpty('keyvalue is required');
  ctx.body = {
    ViewName: ctx.params.view_name,
    Data: await Dbview.getDataById(ctx.params.view_name, ctx.params.keyvalue),
  };
});

/**
 * @api {get} /api/datacount/:view_name Get Data count
 * @apiVersion 1.0.0
 * @apiGroup DataBase
 * @apiName GetDataCount
 * @apiSampleRequest /api/datacount/:view_name
 */
router.get('/api/datacount/:view_name', async (ctx) => {
  ctx.checkParams('view_name').notEmpty('view_name is required');
  const datacnt = await Dbview.dataCount(ctx.params.view_name);
  console.log(datacnt[0].a);
  ctx.body = {
    ViewName: ctx.params.view_name,
    Data: datacnt[0].a,
  };
});

/**
 * @api {get} /api/maxid/:view_name Get Data count
 * @apiVersion 1.0.0
 * @apiGroup DataBase
 * @apiName GetMaxid
 * @apiSampleRequest /api/maxid/:view_name
 */
router.get('/api/maxid/:view_name', async (ctx) => {
  ctx.checkParams('view_name').notEmpty('view_name is required');
  const datacnt = await Dbview.maxid(ctx.params.view_name);
  ctx.body = {
    ViewName: ctx.params.view_name,
    Data: datacnt[0].a,
  };
});

module.exports = router;
