const router = require('koa-router')();
const Field = require('../../models/field');

/**
 * @api {post} /api/field Add field
 * @apiVersion 1.0.0
 * @apiName AddField
 * @apiGroup Field
 * @apiParam {String{1,50}} ViewName 表单名称
 * @apiParam {String{1,50}} FieldName 字段名称
 * @apiParam {String{1,50}} DataType 数据类型
 * @apiParam {String{1,50}} Default 默认值
 * @apiParam {String{1,50}} Title 表单Title
 * @apiParam {String{1,50}} CanAdd 新增时是否赋值
 * @apiParam {String{1,50}} CanUpdate 修改时是否赋值
 * @apiSampleRequest /api/field
 */
router.post('/api/field', async (ctx) => {
  const oldField = await Field.firstField({
    ViewName: ctx.request.body.ViewName,
    FieldName: ctx.request.body.FieldName,
  });
  if (!oldField) {
    ctx.body = await Field.addField(ctx.request.body);
  } else {
    ctx.body = await Field.updateField(ctx.request.body);
  }
});

/**
 * @api {post} /field/delete Delete field
 * @apiVersion 1.0.0
 * @apiName DeleteField
 * @apiGroup Field
 * @apiParam {String{1,50}} ViewName 表单名称
 * @apiParam {String{1,50}} FieldName 字段名称
 * @apiSampleRequest /field/delete
 */
router.post('/field/delete', async (ctx) => {
  ctx.body = await Field.deleteField({
    ViewName: ctx.request.body.ViewName,
    FieldName: ctx.request.body.FieldName,
  });
});


module.exports = router;
