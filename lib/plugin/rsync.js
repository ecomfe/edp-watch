exports.name = 'rsync';

exports.main = function( options ) {
    return function ( context ) {
        console.log( 'do rsync: %s (TODO)', context.folder );
    };
};
