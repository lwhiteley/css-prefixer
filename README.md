# css-prefixer

[![Build Status](https://travis-ci.org/medullan/css-prefixer.svg)](https://travis-ci.org/medullan/css-prefixer)

> prefixing css using rework

## Getting Started

```shell
npm install --save css-prefixer 
```

Once the package has been installed, it may be required with this line of JavaScript:

```js
var prefixer = require('css-prefixer');
```

### Overview
Below is a basic example

**example.css**
```css
h1#nice div.was h2 span .good {
    color: red;
}
@-webkit-keyframes shake {
    0%, 100% {
        -webkit-transform: translateX(0);
    }
}
.something.shake {
    -webkit-animation-name: shake;
    -moz-animation-name: shake;
    -o-animation-name: shake;
    animation-name: shake;
}
@media (min-width: 768px) {
    #pre-truth2.media-query-style .pre-good{
        font-size: 21px;
    }
}
```
**code:**
```js
var fs = require('fs');
var css = fs.readFileSync('./example.css', 'utf8')
var options= {
        prefix: 'pre-'
    };
    var result = prefixer( css, options );
    console.log(result)
```

**result:**
```css
h1#pre-nice div.pre-was h2 span .pre-good {
  color: red;
}
@-webkit-keyframes pre-shake {
  0%, 100% {
    -webkit-transform: translateX(0);
  }
}
.pre-something.pre-shake {
  -webkit-animation-name: pre-shake;
  -moz-animation-name: pre-shake;
  -o-animation-name: pre-shake;
  animation-name: pre-shake;
}
@media (min-width: 768px) {
  #pre-truth2.pre-media-query-style .pre-good {
    font-size: 21px;
  }
}
```

### Options

-------------------------
#### options.prefix
Type: `String` <br/>
Default value: `''`

Prefix any class name/id selector in the target file with this prefix.

-------------------------
#### options.ignore
Type: `[ '' ]` <br/>
Default value: `[ '{options.prefix}' ]`

An array of strings that will ignore selector names once it starts with any of the provided strings. 
The provided prefix is always added to this list by default.

-------------------------
#### options.processName
Type: `String` <br/>
Default value: `null`

process the prefixed class name with any of [underscore.string](https://github.com/epeli/underscore.string) methods

-------------------------
#### options.prefixIdSelectors
Type: `Boolean` <br/>
Default value: `true`

When true will prefix id selectors in the css.

----------------------

### What this library doesn't do currently
- Add vendor prefixes
- Attribute selectors are not prefixed eg. `[class=*"the-class-name"]`

## Credits
- To the author of [grunt-css-prefix](https://github.com/anasnakawa/grunt-css-prefix)

## Development
- Pull requests are welcome
- Only one commit will be accepted into master, [please squash commits](http://stackoverflow.com/questions/6934752/combining-multiple-commits-before-pushing-in-git)

## Release History

* 0.1.0: initial usage
* 0.1.1: documentation update
* 0.1.2: documentation update
* 0.1.3: npm publish cleanup