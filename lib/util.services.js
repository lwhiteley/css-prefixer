/**
 * Created by layton on 8/25/15.
 */
var _ = require( 'lodash');

var service = {};
service.const = {
    className: 'className',
    idSelector: 'idSelector',
    selectors:{
        className: '.',
        idSelector: '#'
    }
};
var startWithMatches = function(value, arr){
    if(_.isArray(arr)){
        for(var index in arr){
            if(_.isString(arr[index])){
                var result = _.startsWith(value, arr[index]);
                if(result) {
                    return result;
                }
            }
        }
    }
    return false;
};

service.modifyNames = function(rules, options, type){
    if(_.isArray(rules) && rules.length >  1){
        _.forEach(rules, function(rule, i){

            //prefix rule
            if(i > 0){

                if(!startWithMatches(rule, options.ignore)){
                    rules[i] = options.prefix + rule;
                }
            }

        });
    }
    var result = rules.join(service.const.selectors[type]);
    return result;
};

module.exports = service;
