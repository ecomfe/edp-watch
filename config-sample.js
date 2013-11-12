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
 * 任务配置
 * 
 * @type {Object}
 */
exports.getTasks = function() {
    return {
        'dev': {
            filters: [
                '*.js',
                '!node_modules/',
                '!.(git|svn)/'
            ],
            events: [
                'addedFiles',
                'modifiedFiles',
                'deletedFiles'
            ],
            plugins: [
                jshint(),
                livereload()
            ]
        },
        'rsync': {
            filters: [
                '*/',
                '!node_modules/',
                '!.(git|svn)'
            ],
            events: [
                'addedFolders',
                'modifiedFolders',
                'deletedFolders'
            ],
            plugins: [ rsync() ]
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
        'default': [ 'dev', 'rsync' ]
    }
};

exports.injectPlugin = function( plugins ) {
    for ( var key in plugins ) {
        global[ key ] = plugins[ key ];
    }
};
