/**
 * Created by layton on 8/24/15.
 */
var test = require('tap').test;
var prefixer = require('../');
var fs = require('fs');
var _ = require('lodash');

var src = {
    mixed : fs.readFileSync(__dirname + '/files/test.css', 'utf8')
};


test('test styles are prefixed with basic settings', function (t) {
    var options= {
        prefix: 'pre-'
    };

    var result = prefixer( src.mixed, options );
    t.ok(_.contains(result, '.pre-foo.pre-bar'), 'test that .foo.bar is prefixed');
    t.ok(_.contains(result, 'h1.pre-nice '), 'test class with html element is prefixed properly');
    t.ok(_.contains(result, 'h1#pre-nice '), 'test id with html element is prefixed properly');
    t.ok(_.contains(result, '@-webkit-keyframes pre-shake'), 'test that keyframe is prefixed');
    t.ok(_.contains(result, '.pre-media-query-style'), 'test that media query styles are prefixed');
    t.ok(_.contains(result, '#pre-truth.pre-media-query-style'), 'test that media query styles with ids are prefixed');
    t.end();
});

test('test styles are prefixed with dasherize', function (t) {
    var options= {
        prefix: 'pre-',
        processName: 'dasherize'
    };

    var result = prefixer( src.mixed, options );
    t.ok(_.contains(result, '.pre-animated-nicely'), 'test that .animatedNicely is prefixed and dasherized');
    t.end();
});

test('test styles are prefixed with id prefixing toggled off', function (t) {
    var options= {
        prefix: 'pre-',
        processName: 'dasherize',
        prefixIdSelectors: false
    };

    var result = prefixer( src.mixed, options );
    t.ok(_.contains(result, 'h1#nice '), 'test id with html element is prefixed properly');
    t.ok(_.contains(result, '#truth.pre-media-query-style'), 'test that media query styles with ids are prefixed');
    t.end();
});

test('test styles are prefixed beforehand', function (t) {
    var options= {
        prefix: 'pre-'
    };

    var result = prefixer( src.mixed, options );
    fs.writeFileSync('./test/tmp/file.css',result, 'utf-8')
    t.ok(_.contains(result, '.pre-trouble #pre-anchor'), 'test regular styles already prefixed are ignored');
    t.ok(_.contains(result, '#pre-truth2.pre-media-query-style .pre-good'), 'test that media query styles already prefixed are ignored');
    t.end();
});

test('test ignoring styles', function (t) {
    var options= {
        prefix: 'pre-',
        ignore:['fa']
    };

    var result = prefixer( src.mixed, options );
    t.ok(_.contains(result, '.fa-icon .fa-anchor'), 'should ignore styles that start with fa');
    t.end();
});
