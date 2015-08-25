/**
 * Created by layton on 8/24/15.
 */
'use strict';

// --------------------------
// attempt to process all css
// selectors, and prefix them
// with a given string
// --------------------------

// external modules
var rework = require( 'rework' ),
    mixin = require('rework-plugin-mixin'),
    _ = require( 'lodash' ),
    util = require( './lib/util.services.js' ),
    str = require( 'underscore.string' )

// Class definition
//
// * **param:** {string}   file    content of the file
// * **param:** {object}   options
    , Prefixer = function( file, options ) {
        this.file = file;
        this.options = options;
    };

// Helper method to register prefixer handler
//
// * **param:** {string}   ruleName
// * **param:** {function} handler
Prefixer.registerRuleHandler = function( ruleName, handler ) {
    Prefixer.prototype[ ruleName + 'RuleHandler' ] = handler;
};

// call target rule handler
//
// * **param:** {object} rule
Prefixer.prototype.processRule = function( rule ) {
    return this.getRuleHandler( rule ).call( this, rule );
};

// get target rule handler if exist
//
// * **param:** {object} rule
Prefixer.prototype.getRuleHandler = function( rule ) {
    if( rule && rule.type ) {
        return this[ rule.type + 'RuleHandler' ];
    }
};

// check wither a handler exist for current rule
//
// * **param:** {object} rule
Prefixer.prototype.isHandlerExist = function( rule ) {
    return typeof this.getRuleHandler( rule ) === 'function';
};

// Prefixer main method that will iterate over all rules
Prefixer.prototype.processFile = function() {
    var self = this;
    return function( styles ) {
        styles.rules.forEach( function( rule ) {
            // call out our rule handler
            if( self.isHandlerExist( rule ) ) {
                self.processRule( rule );
            }
        });
    }
};

// process a given name with `undersocre.string` methods
//
// * **param:** {string} name
Prefixer.prototype.processName = function( name ) {
    if(this.options.processName && str[ this.options.processName ] !== null ) {
        // trick to keep all spaces
        name = name.replace( / /g, '/' );
        name = str[ this.options.processName ]( name );
        name = name.replace( /\//g, ' ' );
    }
    return name;
};

// generate a mixin specific for `rework` for a given property
// without any vendor prefix
//
// * **param:** {string} propName   css property name to generate the mixin for
Prefixer.prototype.mixin = function( propName ) {
    var self = this,
        temp   = {},
        vendorfn = function( name ) {
            return function( type ) {
                var prop = {};
                prop[ name ] = self.options.prefix + self.processName( type );
                return prop;
            };
        };

    temp[ '-webkit-' + propName ] = vendorfn('-webkit-' + propName);
    temp[    '-moz-' + propName ] = vendorfn('-moz-' + propName);
    temp[     '-ms-' + propName ] = vendorfn('-ms-' + propName);
    temp[      '-o-' + propName ] = vendorfn('-o-' + propName);
    temp[              propName ] = vendorfn(propName);

    return temp;
};

// rule handlers
// -------------
Prefixer.registerRuleHandler( 'rule', function( rule ) {
    for( var i = 0, len = rule.selectors.length; i < len; i++ ) {
        // strip
        if( this.options.strip &&  this.options.strip.length > 0) {
            rule.selectors[ i ] = rule.selectors[ i ].split( this.options.strip ).join( '' );
        }

        // adding prefix
        var classNames = util.modifyNames(
            this.processName( rule.selectors[ i ] ).split( '.' ),
            this.options,
            util.const.className);
        rule.selectors[ i ] = classNames;

        if(this.options.prefixIdSelectors){
            var idSelectors = util.modifyNames(
                this.processName( rule.selectors[ i ] ).split( '#' ),
                this.options,
                util.const.idSelector);
            rule.selectors[ i ] = idSelectors;
        }

    }
});

Prefixer.registerRuleHandler( 'keyframes', function( rule ) {
    /*
     *
     * Cranch for rework-visit issue ( while this patch isn't in NPM repository )
     * https://github.com/reworkcss/rework-visit/commit/c8cebd42e31cf638238f64b36fbecdf10214fa1b
     *
     */
    for (var i=0; i<rule.keyframes.length; i++ ) {
        var keyframe = rule.keyframes[ i ];
        if ( keyframe.type === 'comment' ) {
            keyframe.declarations = [];
        }
    }
    // prefixing keyframe names
    rule.name = this.options.prefix + this.processName( rule.name );
});

// Unwrap media queries and process their attached rules
Prefixer.registerRuleHandler( 'media', function( rule ) {

    for( var i = 0; i < rule.rules.length; i++ ) {
        var childRule = rule.rules[i];
        if( this.isHandlerExist( childRule ) ) {
            //console.log(childRule)
            this.processRule(childRule);
        }
    }
});

module.exports = function( file, options ) {
    var _options= {
        prefix: '',
        punctuation: '',
        separator: '',
        strip: '',
        ignore: [],
        prefixIdSelectors: true,
        vendor: [ '-webkit-', '-moz-', '-ms-', '-o-' ]
    };

    options = _.merge(_options, options);
    if(!_.isArray(options.ignore)){
        options.ignore = [];
    }
    options.ignore.push(options.prefix);

    var prefixerInstance = new Prefixer( file, options ),
        reworkInstance = rework( file );

    //console.log(prefixes);
    reworkInstance
        .use( prefixerInstance.processFile() )
        .use( mixin( prefixerInstance.mixin( 'animation-name' ) ) );

    return reworkInstance.toString();
};
