exports.name = 'jshint';

exports.main = function( options ) {
    return function ( context ) {
        console.log( 'do jshint: %s (TODO)', context.file );
    };
};