# Preprocessor for Webpack

## What it is?

A preprocessor is a tool parsing files and replacing a piece of text by another.

It is extensively used in the [C language](http://tigcc.ticalc.org/doc/cpp.html#SEC2) and in
the [Unix world](https://www.gnu.org/software/m4/m4.html) in general.

/!\ This is still the early stage of development. preprocessor-loader can only replace `__FILE__` and
`__LINE__` as of this writing.

## Ok so, what does it do??

Let's say you have a javascript called `index.js` like so:
``` javascript
1 'use strict';
2 console.log('This is a log (__FILE__:__LINE__)');
```

Once preprocessed, it will produce:

``` javascript
1 'use strict';
2 console.log('This is a log (index.js:2)');
```

## Usage

``` javascript
{
  test: /\.js$/,
  exclude: /node_modules/
  loader: 'preprocessor',
},
```
