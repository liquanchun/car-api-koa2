const router = require('koa-router')();
const Dbview = require('../../models/dbview');
const Parameter = require('../../libraries/parameter');
const _ = require('lodash');
/**
 * @api {post} /api/data/:view_name Add/Update data
 * @apiVersion 1.0.0
 * @apiName DataBase
 * @apiGroup DataBase
 * @apiSampleRequest /api/data/:view_name
 */
router.post('/api/data/:view_name', async (ctx) => {
  ctx.checkParams('view_name').notEmpty('view_name is required');

  if (!ctx.request.body.Id) {
    ctx.body = await Dbview.addData(ctx.params.view_name, ctx.request.body);
  } else {
    const oldData = await Dbview.firstData(ctx.params.view_name, ctx.request.body.Id);
    if (!oldData) {
      ctx.body = {
        ViewName: ctx.params.view_name,
        Data: await Dbview.addData(ctx.params.view_name, ctx.request.body),
      };
    } else {
      ctx.body = {
        ViewName: ctx.params.view_name,
        Data: await Dbview.updateData(ctx.params.view_name, ctx.request.body),
      };
    }
  }
});

/**
 * @api {post} /api/delete/:view_name Delete data by post params
 * @apiVersion 1.0.0
 * @apiName Delete Data By Where
 * @apiGroup DataBase
 * @apiSampleRequest /api/delete/:view_name
 */
router.post('/api/delete/:view_name', async (ctx) => {
  const [raw, values] = Parameter.resolve(ctx.request.body);
  ctx.body = {
    ViewName: ctx.params.view_name,
    Data: await Dbview.deleteByWhere(ctx.params.view_name, raw, values),
  };
});

/**
 * @api {post} /api/deleteall/:view_name Delete all data  by post params
 * @apiVersion 1.0.0
 * @apiName Delete all data by where
 * @apiGroup DataBase
 * @apiSampleRequest /api/deleteall/:view_name
 */
router.post('/api/deleteall/:view_name', async (ctx) => {
  const [raw, values] = Parameter.resolve(ctx.request.body);
  ctx.body = {
    ViewName: ctx.params.view_name,
    Data: await Dbview.deleteAllByWhere(ctx.params.view_name, raw, values),
  };
});

/**
 * @api {delete} /api/delete/:view_name/:id Delete data by id
 * @apiVersion 1.0.0
 * @apiName Delete data by id
 * @apiGroup DataBase
 * @apiSampleRequest /api/delete/:view_name/:id
 */
router.del('/api/delete/:view_name/:id', async (ctx) => {
  ctx.checkParams('view_name').notEmpty('view_name is required');
  ctx.checkParams('id').notEmpty('id is required');
  ctx.body = {
    ViewName: ctx.params.view_name,
    Data: await Dbview.deleteData(ctx.params.view_name, ctx.params.id)
  };
});

/**
 * @api {delete} /api/deleteall/:view_name/:id Delete all data by id
 * @apiVersion 1.0.0
 * @apiVersion 1.0.0
 * @apiName Delete all data by id
 * @apiGroup DataBase
 * @apiSampleRequest /api/deleteall/:view_name/:id
 */
router.del('/api/deleteall/:view_name/:id', async (ctx) => {
  ctx.checkParams('view_name').notEmpty('view_name is required');
  ctx.checkParams('id').notEmpty('id is required');
  ctx.body = {
    ViewName: ctx.params.view_name,
    Data: await Dbview.deleteDataAll(ctx.params.view_name, ctx.params.id),
  };
});

/**
 * @api {delete} /api/deletebypara/:view_name/:keyname/:keyvalue Delete data list by keyvalue
 * @apiVersion 1.0.0
 * @apiGroup DataBase
 * @apiName Delete Data By Params
 * @apiSampleRequest /api/deletebypara/:view_name/:keyname/:keyvalue
 */
router.get('/api/deletebypara/:view_name/:keyname/:keyvalue', async (ctx) => {
  ctx.checkParams('view_name').notEmpty('view_name is required');
  ctx.checkParams('keyname').notEmpty('keyname is required');
  ctx.checkParams('keyvalue').notEmpty('keyvalue is required');

  ctx.body = {
    ViewName: ctx.params.view_name,
    Data: await Dbview.deleteByPara(ctx.params.view_name, ctx.params.keyname, ctx.params.keyvalue),
  };
});

/**
 * @api {delete} /api/deleteallbypara/:view_name/:keyname/:keyvalue Delete all data list by keyvalue
 * @apiVersion 1.0.0
 * @apiGroup DataBase
 * @apiName Delete all Data By Params
 * @apiSampleRequest /api/deleteallbypara/:view_name/:keyname/:keyvalue
 */
router.get('/api/deleteallbypara/:view_name/:keyname/:keyvalue', async (ctx) => {
  ctx.checkParams('view_name').notEmpty('view_name is required');
  ctx.checkParams('keyname').notEmpty('keyname is required');
  ctx.checkParams('keyvalue').notEmpty('keyvalue is required');

  ctx.body = {
    ViewName: ctx.params.view_name,
    Data: await Dbview.deleteallByPara(ctx.params.view_name, ctx.params.keyname, ctx.params.keyvalue),
  };
});

module.exports = router;
