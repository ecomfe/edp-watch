/**
 * @file 路径规则过滤器
 * @author firede[firede@firede.us]
 */

var extend = require( './util/extend' );
var pathToRegexp = require( 'path-to-regexp' );
var log = require( './log' );

var debug = require( 'debug' )( 'filter' );

/**
 * 过滤器
 * 
 * @public
 * @constructor
 * @param {Object|string} options 过滤规则
 */
function Filter( options ) {
    // 对字符串类型过滤规则进行处理
    if ( typeof options === 'string' ) {
        options = parserFilterString( options );
    }
    extend( this, options );

    this.parse();
}

/**
 * 将过滤规则解析为目标正则表达式
 * 
 * @private
 */
Filter.prototype.parse = function() {
    var regex;

    if ( this.pattern instanceof RegExp ) {
        regex = new RegExp( this.pattern.source );
    }

    // TODO: 考虑是否将keys分析好了传给processor
    var regex = pathToRegexp( this.pattern, null, {
        sensitive: true,
        strict: true
    });

    // 验证正则有效性
    var source = regex.source;
    if ( !source.match( /^\^.*\$$/) ) {
        // TODO: throw error
        if ( this.pattern instanceof RegExp ) {
            throw new Error( 'Unexpected regexp: ' + source );
        }
        else {
            throw new Error(
                'Unexpected regexp: "'
                + this.pattern
                + '" -> '
                + source
            );
        }
        process.exit( 0 );
    }
    this.re = regex;

    debug('#parse => pattern: %s, regex: %s', this.pattern, this.re.source );
};

/**
 * 检测路径是否匹配规则
 * 
 * @private
 * @param {string} path 路径
 * @param {boolean} isDir 是否为目录
 * @return {boolean}
 */
Filter.prototype.match = function( path, isDir ) {
    path = path.replace( /\\/g, '/' );
    return this.re.test( path ) || isDir && this.re.test( path + '/' );
};

/**
 * 格式化过滤器
 * 
 * @private
 * @param {Array} filters 过滤器元数据
 * @return {Array} 格式化后的过滤器
 */
function formatFilter( filters ) {
    return filters.map(function( filter ) {
        return new Filter( filter );
    });
}

/**
 * 获取匹配函数
 * 
 * @public
 * @param {Array} filters 过滤条件
 * @return {Function}
 */
function getMatcher( filters ) {
    filters = formatFilter( filters );

    return function match( file, isDir ) {
        // 需要匹配的路径是文件还是目录
        var ret = null;

        for ( var i = 0, filterLen = filters.length; i < filterLen; i++ ) {
            var filter = filters[ i ];

            debug(
                '# Match: %s\n\tisDir: %s, pattern: %s\n\ttype:%s, result: %s',
                file,
                isDir,
                filter.pattern,
                filter.type,
                filter.match( file, isDir )
            );

            if ( filter.match( file, isDir ) ) {
                ret = filter.type === 'include';
            }
        }

        if ( ret === null ) {
            ret = false;
        }

        if ( ret ) {
            log.info(
                'match %s -> %s',
                log.em( isDir ? 'directory' : 'file' ),
                log.code( file )
            );
        }

        return ret;
    };
}

/**
 * 字符串过滤规则解析
 * 
 * @private
 * @param {string} str 过滤规则
 * @return {Object} 过滤规则对象
 */
function parserFilterString( str ) {
    var obj = {};
    var isExclude = str.charAt( 0 ) === '!';

    obj.type = isExclude ? 'exclude' : 'include';
    obj.pattern = isExclude ? str.substr( 1 ) : str;

    return obj;
}

exports.Filter = Filter;
exports.getMatcher = getMatcher;
