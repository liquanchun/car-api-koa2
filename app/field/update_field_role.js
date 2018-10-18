const router = require('koa-router')();
const Field = require('../../models/field');
const _ = require('lodash');
/**
 * @api {post} /api/fieldrole Add field role
 * @apiVersion 1.0.0
 * @apiName AddFieldRole
 * @apiGroup Field
 * @apiParam {Int{11}} FieldIds 表单字段Id
 * @apiParam {Int{11}} RoleIds 角色Id
 * @apiParam {Boolen} CanRead 是否可见
 * @apiParam {Boolen} CanUpdate 是否可修改
 * @apiSampleRequest /api/fieldrole
 */
router.post('/api/fieldrole', async (ctx) => {
  ctx.checkParams('view_name').notEmpty('view_name is required');
  if (ctx.request.body.FieldIds && ctx.request.body.RoleIds) {
    const fids = ctx.request.body.FieldIds.split(',');
    const rids = ctx.request.body.RoleIds.split(',');
    const canread = ctx.request.body.CanRead == true ? 1 : 0;
    const canupdate = ctx.request.body.CanUpdate == true ? 1 : 0;
    const frs = [];
    _.each(fids, (f) => {
      _.each(rids, (r) => {
        frs.push({
          FieldId: f,
          RoleId: r,
          CanRead: canread,
          CanUpdate: canupdate,
        });
      });
    });
    await Field.deleteFieldRole(fids);

    ctx.body = await Field.addFieldRoles(frs);
  }
});

module.exports = router;
