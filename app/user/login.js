const router = require('koa-router')();
const Dbview = require('../../models/dbview');
const User = require('../../models/user');
const jwt = require('../../libraries/jwt');

const { BadRequest, Unauthorized } = require('../../libraries/error');
const string = require('../../libraries/string');


/**
 * @api {post} /login User Login
 * @apiVersion 1.0.0
 * @apiGroup Auth
 * @apiName UserLogin
 * @apiParam {String{1,255}} userid user userid
 * @apiParam {String{1,20}} password user password
 * @apiSampleRequest /login
 */
router.post('/api/login', async (ctx) => {
  ctx.checkBody('userid').notEmpty('userid field is required').len(4, 50, 'userid length must be between 4 and 50 characters');
  ctx.checkBody('password').notEmpty('Password field is required').len(4, 20, 'Password length must be between 4 and 20 characters');

  if (ctx.errors) throw new BadRequest(ctx.errors);

  const user = await User.findOne({
    userid: ctx.request.body.userid,
    password: string.generatePasswordHash(ctx.request.body.password),
  });

  if (!user) throw new Unauthorized('Invalid User Id');

  user.token = jwt.encode({ userid: user.userid });
  ctx.body = user;
});

/**
 * @api {post} /Add user account
 * @apiVersion 1.0.0
 * @apiGroup Auth
 * @apiName AddUser
 * @apiSampleRequest /api/account
 */
router.post('/api/account', async (ctx) => {
  ctx.checkBody('userid').notEmpty('userid field is required').len(4, 50, 'userid length must be between 4 and 50 characters');
  ctx.checkBody('password').notEmpty('Password field is required').len(4, 20, 'Password length must be between 4 and 20 characters');

  if (ctx.errors) throw new BadRequest(ctx.errors);
  const { table, paras } = ctx.request.body;
  const viewname = table || 'sys_user';
  if (paras.password) {
    paras.password = string.generatePasswordHash(ctx.request.body.password)
  }

  if (!paras.Id) {
    ctx.body = await Dbview.addData(viewname, paras);
  } else {
    const oldData = await Dbview.firstData(viewname, paras);
    if (!oldData) {
      ctx.body = {
        ViewName: viewname,
        Data: await Dbview.addData(viewname, paras),
      };
    } else {
      ctx.body = {
        ViewName: viewname,
        Data: await Dbview.updateData(viewname, paras),
      };
    }
  }
});

module.exports = router;
