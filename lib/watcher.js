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

    var monitor = fsmonitor.watch( dir, null, function( change ) {
        me.emit( 'all', change );

        // 分，还是不分？
        [
            'addedFiles',
            'modifiedFiles',
            'removedFiles',
            'addedFolders',
            'modifiedFolders',
            'removedFolders'
        ].forEach(function( type ) {
            if ( change[ type ].length > 0 ) {
                debug( 'event: %s, target: %s', type, change[ type ] );
                me.emit( type, change[ type ], change );
            }
        });
    });

    this.emit( 'ready', {} );
};

module.exports = Watcher;
