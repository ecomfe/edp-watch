/**
 * @file 文件监视器
 * @author firede[firede@firede.us]
 */

var Monitor = require( './lib/monitor' );
var Task = require( './lib/task' );
var plugin = require( './lib/plugin' );
var log = require( './lib/log' );
var _ = require( 'lodash' );

/**
 * 启动入口
 * 
 * @public
 * @param {Object} conf 配置文件
 * @param {string} groupId 启动的任务组
 */
function watch( conf, groupId ) {
    // init monitor
    var monitor = new Monitor();
    var filters = _.values( conf.globalFilters );

    monitor.init( {
        dir    : conf.baseDir,
        filters: filters
    } );

    // init plugins
    plugin.injectPlugin( conf );

    var tasks = conf.getTasks();
    var groups = conf.getGroups();
    // 如未指定，使用 `default` 任务组
    var targetGroup = groups[ groupId || 'default' ];

    targetGroup.forEach( function( taskId ) {
        var taskConf = tasks[ taskId ];
        if ( taskConf ) {
            new Task( taskId, monitor, taskConf );
        }
        else {
            log.warn(
                'task %s: it\'s not defined, %s it!',
                log.code( taskId ),
                log.em( 'skip' )
            );
        }
    });
};

module.exports = watch;
