const log4js = require('log4js');

log4js.configure({
  appenders: {
    ruleConsole: { type: 'console' },
    ruleFile: {
      type: 'dateFile',
      filename: 'logs/',
      pattern: 'yyyy-MM-dd.log',
      maxLogSize: 10 * 1000 * 1000,
      numBackups: 3,
      alwaysIncludePattern: true,
    }
  },
  categories: {
    default: { appenders: ['ruleConsole', 'ruleFile'], level: 'info' }
  }
});
// 去掉'out'。控制台不打印日志
exports.info = (message) => {
  const logger = log4js.getLogger('info');
  logger.info(message);
};
exports.error = (message) => {
  const logger = log4js.getLogger('error');
  logger.error(message);
};