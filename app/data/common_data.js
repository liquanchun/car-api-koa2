const router = require('koa-router')();
const Dbview = require('../../models/dbview');
const Parameter = require('../../libraries/parameter');

const _ = require('lodash');
/**
 * @api {post} /get data list
 * @apiVersion 1.0.0
 * @apiGroup CommonData
 * @apiName Datalist
 * @apiSampleRequest /api/select
 */
router.post('/api/select', async (ctx) => {
  const { user, view, table, paras, andor } = ctx.request.body;

  const viewname = view || table;
  const [raw, values] = Parameter.resolve(paras, andor);
  ctx.body = {
    ViewName: viewname,
    Data: await Dbview.getDataListByWhere(viewname, raw, values),
  };
});

/**
 * @api {post} /Edit data
 * @apiVersion 1.0.0
 * @apiGroup CommonData
 * @apiName Edit Data
 * @apiSampleRequest /api/update
 */
router.post('/api/update', async (ctx) => {
  const { user, table, paras } = ctx.request.body;

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
 * @apiGroup CommonData
 * @apiSampleRequest /api/delete
 */
router.post('/api/delete', async (ctx) => {
  const { user, table, paras, remove, andor } = ctx.request.body;
  const [raw, values] = Parameter.resolve(paras, andor);

  let result = 0;
  if (remove) {
    result = await Dbview.deleteallByWhere(table, raw, values);
  } else {
    result = await Dbview.deleteByWhere(table, raw, values);
  }
  ctx.body = {
    ViewName: table,
    Data: result,
  };
});
