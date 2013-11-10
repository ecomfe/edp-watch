/**
 * @file 文件监视器
 * @author firede[firede@firede.us]
 */

var fsmonitor = require( 'fsmonitor' );
var EventEmitter = require( 'events' ).EventEmitter;
var util = require( 'util' );
var debug = require( 'debug' )( 'watcher' );

/**
 * 文件监视器
 * 
 * @constructor
 */
function Watcher() {
    EventEmitter.call( this );
}

util.inherits( Watcher, EventEmitter );

/**
 * 初始化监视器
 * 
 * @param {string} dir 监视的目录
 */
Watcher.prototype.init = function( dir ) {
    var me = this;

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
};

module.exports = Watcher;
