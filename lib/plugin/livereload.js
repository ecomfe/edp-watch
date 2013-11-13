var tinylr = require( 'tiny-lr' );
var extend = require( '../util/extend' );
var log = require( '../log' );

/**
 * 插件名
 * 
 * @type {string}
 */
exports.name = 'livereload';

var servers = {};

var defaults = { port: 35729 };

function LiveReload( options ) {
    options = options || defaults;

    if ( typeof options === 'number' ) {
        options = { port: options };
    }
    else {
        options = extend( options, defaults );
    }

    if ( servers[ options.port ] ) {
        this.server = servers[ options.port ];
    }
    else {
        this.server = tinylr( options );

        // rewrite error handler
        this.server.server.removeAllListeners( 'error' );
        this.server.server.on( 'error', function( err ) {
            if ( err.code === 'EADDRINUSE' ) {
                log.error(
                    '%s: port %s is already in use by another process.',
                    log.code( exports.name ),
                    log.code( options.port )
                );
            }
            else {
                log.error( '%s: %s', exports.name, err );
            }
            process.exit( 1 );
        });

        this.server.listen( options.port, function( err ) {
            if ( err ) {
                log.error( '%s: %s', exports.name, err );
            }

            log.info(
                '%s: server started on %s port',
                log.code( exports.name ),
                log.code( options.port )
            );

            servers[ options.port ] = this.server;
        });
    }
}

LiveReload.prototype.trigger = function( files ) {
    log.info( 'live reloading %s', log.code( files ) );
    this.server.changed({
        body: {
            files: files
        }
    });
};


/**
 * 插件入口
 * 
 * @param {Object} options 参数
 * @return {Function}
 */
exports.main = function ( options ) {
    var lr = new LiveReload( options );

    return function ( context ) {
        lr.trigger( context.files );
    };
};
