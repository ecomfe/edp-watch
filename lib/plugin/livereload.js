var tinylr = require( 'tiny-lr' );

var ports = [];

// TODO...
function LiveReload( options ) {
    this.port = options.port || 35729;
    
}

/**
 * 插件名
 * 
 * @type {string}
 */
exports.name = 'livereload';

/**
 * 插件入口
 * 
 * @param {Object} options 参数
 * @return {Function}
 */
exports.main = function ( options ) {
    return function ( context ) {
        console.log( 'do livereload: %s (TODO)', context.file );
    };
};
