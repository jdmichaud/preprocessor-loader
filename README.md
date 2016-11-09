# Preprocessor for Webpack

## What it is?

A preprocessor is a tool parsing files and replacing a piece of text by another.

It is extensively used in the [C language](http://tigcc.ticalc.org/doc/cpp.html#SEC2) and in
the [Unix world](https://www.gnu.org/software/m4/m4.html) in general.

## Ok so, what does it do??

### `__FILE__` and `__LINE__` expansion

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

### User defined expansion

Configure webpack to load the preprocessor-loader and provide a configuration file:
``` javascript
{
  module: {
    loaders: [
      { test: /\.js$/,
        loader: 'pprocessor?config=pprocessor-loader.json',
        exclude: [/bower_components/, /node_modules/],
      },
    ],
  }
}
```

In the configuration file, you will defined your macros:

``` json
{
  "macros": [
    {
      "declaration" : "MAX (a,b)",
      "definition" : "a > b ? a : b"
    },
    {
      "declaration" : "LOG_INFO(message)",
      "definition" : "console.log(message + ' (__FILE__:__LINE__)');"
    }
  ]
}
```

Here is your javascript file called `main.js`:
``` javascript
1 'use strict';
2 const v = 42;
3 LOG_INFO("Your variable is " + 42);
```

After the execution of webpack, your file will contain:
``` javascript
1 'use strict';
2 const v = 42;
3 console.log("Your variable is " + 42 + ' (main.js:3)');
```

## Usage

``` javascript
{
  test: /\.js$/,
  exclude: /node_modules/
  loader: 'pprocessor',
},
```

An optional config object can be provided in the query string, and will contain a string representing the configuration file name:

``` javascript
{
  test: /\.js$/,
  exclude: /node_modules/
  loader: 'pprocessor?condig=./pprocessor-config.json',
},
```

## Configuration file

The configuration file contains an array of user defined macros:


``` json
{
  "macros": [
    {
      "declaration" : "MAX (a,b)",
      "definition" : "a > b ? a : b"
    },
    {
      "declaration" : "LOG_INFO(message)",
      "definition" : "console.log(message + ' (__FILE__:__LINE__)');"
    }
  ]
}
```
