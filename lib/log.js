/**
 * @file 日志输出封装
 * @author firede[firede@firede.us]
 */

var chalk = require( 'chalk' );

/**
 * 获取时间
 * 
 * @inner
 * @return {string}
 */
function getTime() {
    var time = ( new Date() ).toLocaleTimeString();
    var str = chalk.bgBlack.white( time ) + ' ';

    return str;
}

/**
 * 普通日志
 * 
 * @public
 * @return {string}
 */
var log = function () {
    var args = Array.prototype.map.call( arguments, function( arg ) {
        return chalk.stripColor( arg );
    });
    args[ 0 ] = getTime() + chalk.gray( args[ 0 ] );

    return console.log.apply( this, args );
};

/**
 * 错误
 * 
 * @public
 * @return {string}
 */
log.error = function () {
    var args = arguments;
    args[ 0 ] = getTime() + chalk.red( '[ERROR] ' ) + args[ 0 ];

    return console.error.apply( this, args );
};

/**
 * 警告
 * 
 * @public
 * @return {string}
 */
log.warn = function () {
    var args = arguments;
    args[ 0 ] = getTime() + chalk.yellow( '[WARN] ' ) + args[ 0 ];

    return console.warn.apply( this, args );
};

/**
 * 信息
 * 
 * @public
 * @return {string}
 */
log.info = function () {
    var args = arguments;
    args[ 0 ] = getTime() + chalk.green( '[INFO] ' ) + args[ 0 ];

    return console.info.apply( this, args );
};

/**
 * 重点部分
 * 
 * @public
 * @type {string}
 */
log.em = chalk.green;

/**
 * 路径或链接
 * 
 * @public
 * @desc 主要用于标记可以 command + 单击 直接访问的地址
 * @type {string}
 */
log.path = chalk.blue.underline;

/**
 * 代码
 * 
 * @public
 * @type {string}
 */
log.code = chalk.cyan;

module.exports = log;
