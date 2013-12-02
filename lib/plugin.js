/**
 * @file 插件机制
 * @author firede[firede@firede.us]
 */

var fs = require( 'fs' );
var path = require( 'path' );
var log = require( './log' );

var debug = require( 'debug' )( 'plugin' );

/**
 * 插件容器
 * 
 * @namespace
 */
var plugins = {};

/**
 * 初始化所有插件
 * 
 * @private
 */
function initAll() {
    if ( Object.getOwnPropertyNames( plugins ).length !== 0 ) {
        return false;
    }

    fs.readdirSync(
        path.resolve( __dirname, './plugin' )
    ).forEach( function( file ) {
        var plugin = require( path.resolve( __dirname, './plugin', file ) );

        if ( plugin.name && plugin.main ) {
            debug( 'register plugin -> %s', plugin.name );
            plugins[ plugin.name ] = plugin.main;
        }
    });

    log( 'all plugins have been loaded.' );
}

/**
 * 向配置模块注入插件
 * 
 * @public
 * @param {Object} conf 配置插件
 */
exports.injectPlugin = function( conf ) {
    initAll();

    if ( conf && conf.injectPlugin ) {
        conf.injectPlugin( plugins );
    }
};
