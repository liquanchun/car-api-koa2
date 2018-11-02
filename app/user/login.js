const router = require('koa-router')();
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

  user.token = jwt.encode({ id: user.id });
  ctx.body = user;
});

module.exports = router;
