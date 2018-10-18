const router = require('koa-router')();
const Dbview = require('../../models/dbview');

/**
 * @api {post} /api/data/:view_name Add data
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
      ctx.body = await Dbview.addData(ctx.params.view_name, ctx.request.body);
    } else {
      ctx.body = await Dbview.updateData(ctx.params.view_name, ctx.request.body);
    }
  }
});

/**
 * @api {post} /api/delete/:view_name Delete Data
 * @apiVersion 1.0.0
 * @apiName DeleteData
 * @apiGroup DataBase
 * @apiParam {Int{11}} Id 主键Id
 * @apiSampleRequest /api/delete/:view_name
 */
router.post('/api/delete/:view_name/:id', async (ctx) => {
  ctx.checkParams('view_name').notEmpty('view_name is required');
  ctx.checkParams('id').notEmpty('id is required');
  ctx.body = await Dbview.deleteData(ctx.params.view_name, ctx.params.id);
});

/**
 * @api {delete} /api/delete/:view_name Delete Data
 * @apiVersion 1.0.0
 * @apiName DeleteData
 * @apiGroup DataBase
 * @apiParam {Int{11}} Id 主键Id
 * @apiSampleRequest /api/delete/:view_name
 */
router.del('/api/delete/:view_name/:id', async (ctx) => {
  ctx.checkParams('view_name').notEmpty('view_name is required');
  ctx.checkParams('id').notEmpty('id is required');
  ctx.body = await Dbview.deleteData(ctx.params.view_name, ctx.params.id);
});
module.exports = router;
