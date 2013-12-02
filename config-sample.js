/**
 * @file watch默认配置
 * @author firede[firede@firede.us]
 */

/**
 * 监视的根目录
 * 
 * @type {string}
 */
exports.baseDir = __dirname;

/**
 * 全局过滤器
 * 会先进行一次过滤，以减少监控文件的数量。否则会有fsmonitor crash的情况
 *
 * @inner
 * @namespace
 */
var globalFilters = {
    ignoreNodeModules: '!(node_modules/*|*/node_modules/*)',
    ignoreVCSFiles   : '!(*).(git|svn|idea)/*',
    ignoreIDEFiles   : '!(*).(DS_Store)',
    ignoreNodeConfig : '!(*)(.gitignore|packkage.json|*.md)'
};

exports.globalFilters = globalFilters;

/**
 * 任务配置
 * 
 * @type {Object}
 */
exports.getTasks = function() {
    return {
        'livereload': {
            filters: [
                '*.(html|js|coffee|less|styl|css)'
            ],
            events: [
                'addedFiles',
                'modifiedFiles'
            ],
            plugins: [livereload()],
            //任务执行最小间隔时间 milliseconds
            intervalTime: 1000
        },
        // 配置示例，相关插件还没开发
        // 'rsync': {
        //     filters: [
        //         '*.(js|css|html)',
        //         '!node_modules/*',
        //         '!.(git|svn)/*'
        //     ],
        //     events: [
        //         'addedFiles',
        //         'modifiedFiles',
        //         'deletedFiles'
        //     ],
        //     plugins: [
        //         jshint(),
        //         csslint(),
        //         htmlhint(),
        //         rsync()
        //     ]
        // }
    }
};

/**
 * 任务组配置
 * 
 * @return {Object}
 */
exports.getGroups = function() {
    return {
        'default': [ 'livereload' ]
    }
};

exports.injectPlugin = function( plugins ) {
    for ( var key in plugins ) {
        global[ key ] = plugins[ key ];
    }
};
