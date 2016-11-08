var should = require("should");
var path = require("path");
var preprocessorLoader = require("../");

function run(resourcePath, query, content, expected) {
  content = content || new Buffer("1234");
  var file = null;
  var context = {
    resourcePath: resourcePath,
    query: "?" + query,
    options: {
      context: "/this/is/the/context"
    },
    emitFile: function(url, content2) {
      content2.should.be.eql(expected);
      file = url;
    }
  };

  var result = preprocessorLoader.call(context, content)

  return {
    file: file,
    result: result
  }
}

function test(expected, resourcePath, query, content) {
  run(resourcePath, query, content, expected).file.should.be.eql(resourcePath);
}

describe("preprocessor-loader", function() {
  it("should replace __FILE__ by the file name", function() {
    let content = 'g__FILE_____ae643Y$%J&^55W#$^jh__FILE__s&^ERW%^U3__FILE__q4b';
    let filename = 'test.js';
    let result = 'g\'' + filename + '\'___ae643Y$%J&^55W#$^jh\'' +
      filename + '\'s&^ERW%^U3\'' + filename + '\'q4b';
    test(result, filename, "", content);
  });
  it("should replace __LINE__ by the line number", function() {
    let content = 'g__LINE_____ae\n3Y$%J&^55W#$^jh__LINE__s&^\n\nW%^\n3__LINE__q4b';
    let filename = 'test.js';
    let result = 'g1___ae\n3Y$%J&^55W#$^jh2s&^\n\nW%^\n35q4b';
    test(result, filename, "", content);
  });
});
