/**
 * @file 任务
 * @author firede[firede@firede.us]
 */

var getMatcher = require( './filter' ).getMatcher;
var extend = require( './util/extend' );
var log = require( './log' );

/**
 * 文件相关的事件
 * 
 * @inner
 * @type {Array}
 */
var fileEvents = [
    'addedFiles',
    'modifiedFiles',
    'deletedFiles'
];

/**
 * 文件夹相关的事件
 * 
 * @inner
 * @type {Array}
 */
var folderEvents = [
    'addedFolders',
    'modifiedFolders',
    'deletedFolders'
];

/**
 * 任务
 * 
 * @constructor
 * @param {string} id 任务ID
 * @param {Monitor} monitor 相关联的monitor
 * @param {Object} conf 配置
 */
function Task( id, monitor, conf ) {
    extend( this, conf );

    this.id = id;
    this.monitor = monitor;
    this.matcher = getMatcher( this.filters );

    // 当只有一个Function时，包装成数组
    if ( typeof this.plugins === 'function' ) {
        this.plugins = [ this.plugins ];
    }

    this.bindEvents();
}

/**
 * 绑定事件
 * 
 * @todo 当Task过多时有相同自定义事件绑定10个的风险
 * @private
 */
Task.prototype.bindEvents = function() {
    var me = this;

    // 若为字符串，则认为只监听一个事件
    if ( typeof this.events === 'string' ) {
        this.events = [ this.events ];
    }

    this.events.forEach( function( eventName ) {
        if ( ~fileEvents.indexOf( eventName ) ) {
            // 文件变化事件
            me.monitor.on( eventName, me.fileChangeHandler.bind( me ) );
        }
        else if ( ~folderEvents.indexOf( eventName ) ) {
            // 文件夹变化事件
            me.monitor.on( eventName, me.folderChangeHandler.bind( me ) );
        }
        else {
            log.warn(
                'task %s: the `%s` event is unknown, %s it!',
                log.code( me.id ),
                log.code( eventName ),
                log.em( 'skip' )
            );
        }
    });
};

/**
 * 文件变化事件处理
 * 
 * @private
 * @param {Array} files 变化的文件列表
 */
Task.prototype.fileChangeHandler = function( files ) {
    var me = this;

    files.forEach( function( file ) {
        if ( me.matcher( file, false ) ) {
            me.plugins.forEach( function( plugin ) {
                // TODO: context api 设计
                plugin({
                    file: file,
                    files: files
                });
            } );
        }
    });
};

/**
 * 文件夹变化事件处理
 * 
 * @private
 * @param {Array} folders 变化的文件夹列表
 */
Task.prototype.folderChangeHandler = function( folders ) {
    var me = this;

    folders.forEach( function( folder ) {
        if ( me.matcher( folder, true ) ) {
            me.plugins.forEach( function( plugin ) {
                // TODO: context api 设计
                plugin({
                    folder: folder,
                    folders: folders
                });
            } );
        }
    });
};

module.exports = Task;
