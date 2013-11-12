/**
 * @file 文件监视器
 * @author firede[firede@firede.us]
 */

var fsmonitor = require( 'fsmonitor' );
var EventEmitter = require( 'events' ).EventEmitter;
var util = require( 'util' );
var fs = require( 'fs' );
var log = require( './log' );

var debug = require( 'debug' )( 'monitor' );

/**
 * 文件监视器
 * 
 * @public
 * @constructor
 */
function Monitor() {
    EventEmitter.call( this );
}

util.inherits( Monitor, EventEmitter );

/**
 * 初始化监视器
 * 
 * @public
 * @param {string} dir 监视的目录
 */
Monitor.prototype.init = function( dir ) {
    var me = this;

    if ( !dir || !fs.existsSync( dir ) ) {
        log.error(
            '%s is not exist, please check your configuration!',
            log.code( 'baseDir' )
        );
        process.exit( 1 );
    }

    fsmonitor.watch( dir, null, function( change ) {
        me.emit( 'all', change );

        [
            'addedFiles',
            'modifiedFiles',
            'removedFiles',
            'addedFolders',
            'modifiedFolders',
            'removedFolders'
        ].forEach(function( type ) {
            if ( change[ type ].length > 0 ) {
                debug( 'emit#%s: %s', type, change[ type ] );
                me.emit( type, change[ type ], change );
            }
        });
    });

    debug( 'emit#ready' );
    this.emit( 'ready' );

    log.info( 'monitor -> %s', log.path( dir ) );
};

module.exports = Monitor;
