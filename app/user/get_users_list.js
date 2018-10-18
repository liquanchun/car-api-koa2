const router = require('koa-router')();
const User = require('../../models/user');

/**
 * @api {get} /users Get User List
 * @apiVersion 1.0.0
 * @apiGroup User
 * @apiName GetUserList
 * @apiSampleRequest /users
 */
router.get('/api/users', async (ctx) => {
  ctx.body = await User.getList();
});

module.exports = router;
