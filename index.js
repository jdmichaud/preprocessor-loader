/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author jean.daniel.michaud@gmail.com
*/
var loaderUtils = require("loader-utils");

module.exports = function(content) {
  this.cacheable && this.cacheable();
  if(!this.emitFile) throw new Error("emitFile is required from module system");

  var query = loaderUtils.parseQuery(this.query);
  var configKey = query.config || "preprocessorLoader";
  var options = this.options[configKey] || {};

  var config = {
  };

  // options takes precedence over config
  Object.keys(options).forEach(function(attr) {
    config[attr] = options[attr];
  });

  // query takes precedence over config and options
  Object.keys(query).forEach(function(attr) {
    config[attr] = query[attr];
  });

  // Replace __FILE__ by the file name
  content = content.replace(/__FILE__/g, '\'' + this.resourcePath + '\'');
  // Replace __LINE__ by the line number
  content = content
              .split('\n')
              .map(function (line, index) {
                return line.replace(/__LINE__/g, index + 1);
              })
              .join('\n');
  // TODO(JD): __FUNCTION__

  var url = loaderUtils.interpolateName(this, config.name, {
    context: config.context || this.options.context,
    content: content,
    regExp: config.regExp
  });
  if (query.emitFile === undefined || query.emitFile) {
    this.emitFile(url, content);
  }
  return content;
}
module.exports.raw = true;