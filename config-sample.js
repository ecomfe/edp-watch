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
 * 常用过滤器
 * 
 * @inner
 * @namespace
 */
var commonFilters = {
    ignoreNodeModules: '!node_modules/*',
    ignoreVCSFiles: '!.(git|svn)/*'
}

/**
 * 任务配置
 * 
 * @type {Object}
 */
exports.getTasks = function() {
    return {
        'livereload': {
            filters: [
                '*.(html|js|coffee|less|styl|css)',
                commonFilters.ignoreNodeModules,
                commonFilters.ignoreVCSFiles
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
