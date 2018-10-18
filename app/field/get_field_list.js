const router = require('koa-router')();
const Field = require('../../models/field');
const DbView = require('../../models/dbview');
const _ = require('lodash');
const async = require('async');
/**
 * @api {get} /api/fields Get field List
 * @apiVersion 1.0.0
 * @apiGroup Field
 * @apiName GetFieldList
 * @apiSampleRequest /api/fields
 */
router.get('/api/fields', async (ctx) => {
  ctx.body = { ViewName: 'form_ListField', Data: await Field.getFieldList() };
});

/**
 * @api {get} /api/fieldsd Get field List test
 * @apiVersion 1.0.0
 * @apiGroup Field
 * @apiName GetFieldList test
 * @apiSampleRequest /api/fieldsd
 */
router.get('/api/fieldsd', async (ctx) => {
  const dataList = await Field.getFieldList();
  _.each(dataList, (d) => {
    if (d.DataSource) {
      console.log(d.DataSource);
    }
  });
  ctx.body = { ViewName: 'form_ListField', Data: await Field.getFieldListd() };
});

/**
 * @api {get} /api/fields/:view_name Get field List by view_name
 * @apiVersion 1.0.0
 * @apiGroup Field
 * @apiName GetFieldList by Name
 * @apiSampleRequest /api/fields/:view_name
 */
router.get('/api/fields/:view_name', async (ctx) => {
  ctx.checkParams('view_name').notEmpty('view_name is required');

  const dataList = await Field.getFieldListByName(ctx.params.view_name);
  ctx.body = { ViewName: 'form_ListField', Data: dataList };
});

module.exports = router;
