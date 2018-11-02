const router = require('koa-router')();
const Dbview = require('../../models/dbview');
const Parameter = require('../../libraries/parameter');
const _ = require('lodash');

/**
 * @api {get} /api/dataall/:view_name Get data all by table name
 * @apiVersion 1.0.0
 * @apiGroup DataBase
 * @apiName Get Data List
 * @apiSampleRequest /api/dataall/:view_name
 */
router.get('/api/dataall/:view_name', async (ctx) => {
  ctx.checkParams('view_name').notEmpty('view_name is required');
  ctx.body = {
    ViewName: ctx.params.view_name,
    Data: await Dbview.getDataList(ctx.params.view_name),
  };
});

/**
 * @api {get} /api/databypara/:view_name/:keyname/:keyvalue Get data list by keyvalue
 * @apiVersion 1.0.0
 * @apiGroup DataBase
 * @apiName Get Data By Params
 * @apiSampleRequest /api/databypara/:view_name/:keyname/:keyvalue
 */
router.get('/api/databypara/:view_name/:keyname/:keyvalue', async (ctx) => {
  ctx.checkParams('view_name').notEmpty('view_name is required');
  ctx.checkParams('keyname').notEmpty('keyname is required');
  ctx.checkParams('keyvalue').notEmpty('keyvalue is required');

  ctx.body = {
    ViewName: ctx.params.view_name,
    Data: await Dbview.getDataListByPara(ctx.params.view_name, ctx.params.keyname, ctx.params.keyvalue),
  };
});

/**
 * @api {get} /api/databyid/:view_name/:keyvalue Get first row by id
 * @apiVersion 1.0.0
 * @apiGroup DataBase
 * @apiName GetDataById
 * @apiSampleRequest /api/databyid/:view_name/:keyvalue
 */
router.get('/api/databyid/:view_name/:keyvalue', async (ctx) => {
  ctx.checkParams('view_name').notEmpty('view_name is required');
  ctx.checkParams('keyvalue').notEmpty('keyvalue is required');
  ctx.body = {
    ViewName: ctx.params.view_name,
    Data: await Dbview.firstData(ctx.params.view_name, ctx.params.keyvalue),
  };
});

/**
 * @api {get} /api/datacount/:view_name Get table data count
 * @apiVersion 1.0.0
 * @apiGroup DataBase
 * @apiName GetDataCount
 * @apiSampleRequest /api/datacount/:view_name
 */
router.get('/api/datacount/:view_name', async (ctx) => {
  ctx.checkParams('view_name').notEmpty('view_name is required');
  const datacnt = await Dbview.dataCount(ctx.params.view_name);
  ctx.body = {
    ViewName: ctx.params.view_name,
    Data: datacnt[0].a,
  };
});

/**
 * @api {get} /api/maxid/:view_name Get table max id
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

/**
 * @api {get} /api/maxid/:view_name Get data page
 * @apiVersion 1.0.0
 * @apiGroup DataBase
 * @apiName Get data by page
 * @apiSampleRequest /api/datapage/:view_name/:pagesize/:pageindex
 */
router.get('/api/datapage/:view_name/:pagesize/:pageindex', async (ctx) => {
  ctx.checkParams('view_name').notEmpty('view_name is required');
  ctx.checkParams('pagesize').notEmpty('pagesize is required');
  ctx.checkParams('pageindex').notEmpty('pageindex is required');

  const datacnt = await Dbview.dataCount(ctx.params.view_name);
  ctx.body = {
    ViewName: ctx.params.view_name,
    Data: await Dbview.getDataListByPage(ctx.params.view_name, ctx.params.pagesize, ctx.params.pageindex),
    Count: datacnt[0].a,
  };
});

/**
 * @api {post} /api/maxid/:view_name Get data page
 * @apiVersion 1.0.0
 * @apiGroup DataBase
 * @apiName Get data by page
 * @apiSampleRequest /api/datapage/:view_name/:pagesize/:pageindex
 */
router.post('/api/datapage/:view_name/:pagesize/:pageindex', async (ctx) => {
  ctx.checkParams('view_name').notEmpty('view_name is required');
  ctx.checkParams('pagesize').notEmpty('pagesize is required');
  ctx.checkParams('pageindex').notEmpty('pageindex is required');

  const { user, paras, andor } = ctx.request.body;

  const [raw, values] = Parameter.resolve(paras, andor);

  const datacnt = await Dbview.dataCount(ctx.params.view_name);
  ctx.body = {
    ViewName: ctx.params.view_name,
    Data: await Dbview.getDataListWhereByPage(ctx.params.view_name, raw, values, ctx.params.pagesize, ctx.params.pageindex),
    Count: datacnt[0].a,
  };
});

module.exports = router;
