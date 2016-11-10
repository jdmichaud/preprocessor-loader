/* eslint prefer-template: 0 */
/* eslint no-useless-escape: 0 */

/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author jean.daniel.michaud@gmail.com
*/
var fs = require('fs');
var loaderUtils = require('loader-utils');

function replaceFilename(content, filename) {
  return content.replace(/__FILE__/g, filename);
}

function replaceLinenumber(content) {
  return content
          .split('\n')
          .map((line, index) => line.replace(/__LINE__/g, index + 1))
          .join('\n');
}

function preprocessMacros(macros) {
  macros.forEach((macro) => {
    const split = macro.declaration.split(/[(),]/).filter(Boolean);
    macro.name = split[0].trim();
    macro.args = split.slice(1).map(arg => arg.trim());
  });
  return macros;
}

function buildSubstitution(expression, macro) {
  const split = expression.split(/[(),]/).filter(Boolean);
  let result = macro.definition;
  macro.args.forEach((arg, index) => {
    result = result.replace(new RegExp(arg, 'g'), split[index + 1]);
  });
  return result;
}

function replaceMacros(content, macros) {
  var result = content;
  macros.forEach((macro) => {
    if (macro.args.length === 0) {
      // Macro has no arguments, easy
      result = result.replace(new RegExp(macro.name + '\s*(\\(\\))?', 'g'),
                              macro.definition);
    } else {
      // Macro has arguments
      // First retrieve the expressions to replace
      const expressions = result.match(new RegExp(macro.name + '\s*\\([^\)]+\\)', 'g'));
      if (expressions) {
        // Then extract the parameters
        expressions.forEach((expression) => {
          // Build the definition with variable substitution
          const substitution = buildSubstitution(expression, macro);
          // Finally replace the declaration by the definition
          result = result.replace(expression, substitution);
        });
      }
    }
  });
  return result;
}

module.exports = function (content) {
  content = content.toString('utf-8');
  if (this.cacheable) this.cacheable();

  var query = loaderUtils.parseQuery(this.query);
  var config = {};

  // Load config files
  if (query.config !== undefined && query.config !== '') {
    config = JSON.parse(fs.readFileSync(query.config, 'utf8'));
  }

  // Replace user defined macros
  if (config.macros !== undefined && config.macros.length > 0) {
    config.macros = preprocessMacros(config.macros);
    content = replaceMacros(content, config.macros);
  }
  // Replace __FILE__ by the file name
  content = replaceFilename(content, this.resourcePath);
  // Replace __LINE__ by the line number
  content = replaceLinenumber(content);
  // TODO(JD): __FUNCTION__

  return content;
};
module.exports.raw = true;
