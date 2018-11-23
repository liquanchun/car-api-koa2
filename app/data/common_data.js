const router = require('koa-router')();
const Dbview = require('../../models/dbview');
const Parameter = require('../../libraries/parameter');

/**
 * @api {get} /api/column/:table Get column by table name
 * @apiVersion 1.0.0
 * @apiGroup DataBase
 * @apiName Get column List
 * @apiSampleRequest /api/column/:table
 */
router.get('/api/column/:table', async (ctx) => {
  ctx.checkParams('table').notEmpty('table is required');
  const { table } = ctx.params;
  const sql = `select table_name,column_name,data_type,column_comment from information_schema.columns where table_schema='car_app' and column_name not in('Id','IsValid','UpdateTime','DmsCode') and table_name='${table}'`;
  const data = await Dbview.gettablelist(sql);
  ctx.body = {
    Data: data[0],
  };
});

/**
 * @api {get} /api/tablelist Get database table list
 * @apiVersion 1.0.0
 * @apiGroup DataBase
 * @apiName Get table List
 * @apiSampleRequest /api/tablelist
 */
router.get('/api/tablelist', async (ctx) => {
  const sql = "select table_name,table_comment from information_schema.tables where table_schema='car_app' and table_type='base table'";
  const data = await Dbview.gettablelist(sql);
  ctx.body = {
    Data: data[0],
  };
});
/**
 * @api {post} /get data list
 * @apiVersion 1.0.0
 * @apiGroup CommonData
 * @apiName Datalist
 * @apiSampleRequest /api/select
 */
router.post('/api/select', async (ctx) => {
  const { view, table, paras, andor } = ctx.request.body;

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
  const { table, paras } = ctx.request.body;

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
  const { table, paras, remove, andor } = ctx.request.body;
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

module.exports = router;
