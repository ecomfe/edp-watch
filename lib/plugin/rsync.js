var spawn = require( 'child_process' ).spawn;
var util = require( 'util' );
var _ = require( 'lodash' );
var log = require( '../log' );

var defaults = {
    src: './',
    args: [ '-av' ]
};

var parseFilters = function(filters) {
    var include = [],
        exclude = [];

    filters.forEach( function ( filter ) {
        if (filter.charAt( 0 ) === '!') {
            include.push( filter.substr( 1 ) );
        } else {
            exclude.push( filter );
        }
    } );

    return {
        include: include,
        exclude: exclude
    };
};

var rsync = function ( options, callback ) {
    options = options || {};

    if (typeof options.src === 'undefined') {
        throw(new Error( '\'src\' directory is missing from options' ));
    }

    if (typeof options.dest === 'undefined') {
        throw(new Error( '\'dest\' directory is missing from options' ));
    }

    var dest = options.dest;

    if (typeof options.host !== 'undefined') {
        dest = options.host + ':' + options.dest;
    }

    if (!Array.isArray( options.src )) {
        options.src = [options.src];
    }

    var args = [].concat( options.src );

    args.push( dest );

    if (( typeof options.host !== 'undefined' ) || ( options.ssh )) {
        args.push( '--rsh' );
        var rshCmd = 'ssh';
        if (typeof options.port !== 'undefined') {
            rshCmd += ' -p ' + options.port;
        }
        if (typeof options.privateKey !== 'undefined') {
            rshCmd += ' -i ' + options.privateKey;
        }
        args.push( rshCmd );
    }

    if (options.recursive === true) {
        args.push( '--recursive' );
    }

    if (options.syncDest === true) {
        args.push( '--delete' );
        args.push( '--delete-excluded' );
    }

    if (options.syncDestIgnoreExcl === true) {
        args.push( '--delete' );
    }

    if (options.dryRun === true) {
        args.push( '--dry-run' );
        args.push( '--verbose' );
    }

    if (typeof options.exclude !== 'undefined' && util.isArray( options.exclude )) {
        options.exclude.forEach( function ( value, index ) {
            args.push( '--exclude=' + value );
        } );
    }

    if (typeof options.include !== 'undefined' && util.isArray( options.include )) {
        options.include.forEach( function ( value, index ) {
            args.push( '--include=' + value );
        } );
    }

    switch (options.compareMode) {
        case 'sizeOnly':
            args.push( '--size-only' );
            break;
        case 'checksum':
            args.push( '--checksum' );
            break;
    }

    if (typeof options.args !== 'undefined' && util.isArray( options.args )) {
        args = _.union( args, options.args );
    }

    args = _.unique( args );

    var onStdout = options.onStdout;
    var onStderr = options.onStderr;

    var cli = options.cmd || 'rsync';
    var cmd = cli + ' ';

    args.forEach( function ( arg ) {
        if (arg.substr( 0, 4 ) === 'ssh ') {
            arg = ('"' + arg + '"');
        }
        cmd += arg + ' ';
    } );

    cmd = cmd.trim();

    if (options.noExec) {
        callback( null, null, null, cmd );
    } else {
        try {
            var process = spawn( cli, args );
            var stdoutBuffer = '';
            var stderrBuffer = '';

            process.stdout.on( 'data', function ( data ) {
                stdoutBuffer += data;
                if (onStdout && typeof onStdout === 'function') {
                    onStdout( data.toString( 'utf8' ) );
                }
            } );

            process.stderr.on( 'data', function ( data ) {
                stderrBuffer += data;
                if (onStderr && typeof onStderr === 'function') {
                    onStderr( data.toString( 'utf8' ) );
                }
            } );

            process.on( 'exit', function ( code ) {
                callback(
                    code === 0 ? null : new Error( 'rsync exited with code ' + code + '. ' + stderrBuffer ),
                    stdoutBuffer.toString( 'utf-8' ),
                    stderrBuffer.toString( 'utf-8' ),
                    cmd
                );
            } );
        } catch (error) {
            callback( error, null, null, cmd );
        }
    }
};

exports.name = 'rsync';

exports.main = function ( options ) {
    options = _.defaults( options || {}, defaults );
    options.src === '' ? options.src = defaults.src + options.src : void( 0 );

    return function ( context ) {
        rsync( options, function ( error, stdout, stderr, cmd ) {
            log.info( 'Command line:\n%s', cmd );
            if (!error) {
                log.info( 'Rsync success:\n%s', stdout );
            } else {
                log.error( 'Rsync fail:\n%s', stderr );
            }
        } );
    };
};
