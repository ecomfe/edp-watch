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

var commonFilters = {
    staticFiles: '*.(tpl|html|js|coffee|less|styl|css|xml)',
    mediaFiles: '*.(gif|jpg|jpeg|png|swf|fla|mp3)'
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
                commonFilters.staticFiles,
                commonFilters.mediaFiles
            ],
            events: [
                'addedFiles',
                'modifiedFiles'
            ],
            plugins: [/*livereload()*/],
            //任务执行最小间隔时间 milliseconds
            intervalTime: 3000
        },

        'rsync': {
            filters: [
                '*'
            ],
            events: [
                'addedFiles',
                'modifiedFiles',
                'addedFolders',
                'modifiedFolders'
            ],
            plugins: [
                rsync( {
                    //If rsync command is not in default path
//                    cmd: '/usr/local/bin/rsync',
                    //Relative to './' path
//                    src: '',
                    //Destination server, eg: rsync://[USER@]HOST[:PORT]/DEST
                    dest: '',
                    include: [],
                    exclude: [
                        '.*',
                        'node_modules/'
                    ]
                } )
            ],
            intervalTime: 3000
        }
    }
};

/**
 * 任务组配置
 *
 * @return {Object}
 */
exports.getGroups = function() {
    return {
        'default': [ 'livereload' ],
        'rsync': [ 'rsync' ]
    }
};

exports.injectPlugin = function( plugins ) {
    for ( var key in plugins ) {
        global[ key ] = plugins[ key ];
    }
};
