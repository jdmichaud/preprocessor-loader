var should = require('should');
var path = require('path');
var preprocessorLoader = require('../');

function run(resourcePath, query, content, expected) {
  content = content || new Buffer('1234');
  var file = null;
  var context = {
    resourcePath: resourcePath,
    query: `?${query}`,
    options: {
      context: '/this/is/the/context',
    },
    emitFile: function (url, content2) {
      content2.should.be.eql(expected);
      file = url;
    },
  };

  var result = preprocessorLoader.call(context, content);

  return result;
}

function test(expected, resourcePath, query, content) {
  run(resourcePath, query, content, expected);
}

describe('pprocessor-loader', () => {
  it('should replace __FILE__ by the file name', () => {
    const content = 'g__FILE_____ae643Y$%J&^55W#$^jh__FILE__s&^ERW%^U3__FILE__q4b';
    const filename = 'test.js';
    const result = `g${filename}___ae643Y$%J&^55W#$^jh${filename}s&^ERW%^U3${filename}q4b`;
    test(result, filename, '', content);
  });
  it('should replace backslahes by slahes in filename', () => {
    const content = 'g__FILE_____ae643';
    const filename = 'path\\in\\windows\\test.js';
    const result = 'gpath/in/windows/test.js___ae643';
    test(result, filename, '', content);
  });
  it('should replace __LINE__ by the line number', () => {
    const content = 'g__LINE_____ae\n3Y$%J&^55W#$^jh__LINE__s&^\n\nW%^\n3__LINE__q4b';
    const filename = 'test.js';
    const result = 'g1___ae\n3Y$%J&^55W#$^jh2s&^\n\nW%^\n35q4b';
    test(result, filename, '', content);
  });
  it('should replace a user defined macros by their definitions', () => {
    const content = 'This is a test\nMYMACRO\nEnd of file';
    const filename = 'test.js';
    const definition = 'Bla bla\n\n***';
    const result = `This is a test\n${definition}\nEnd of file`;
    test(result, filename, 'config=./test/basic.spec.json', content);
  });
  it('should replace a user defined macros without parameter by their definitions', () => {
    const content = 'This is a test\nNO_PARAM_MACRO()\nEnd of file';
    const filename = 'test.js';
    const definition = 'noParamMacro()';
    const result = `This is a test\n${definition}\nEnd of file`;
    test(result, filename, 'config=./test/basic.spec.json', content);
  });
  it('should replace a user defined macros with parameters by their definitions', () => {
    const content = 'This is a test\nqweqweMAX(5,9)\nEnd of file';
    const filename = 'test.js';
    const definition = '5 > 9 ? 5 : 9';
    const result = `This is a test\nqweqwe${definition}\nEnd of file`;
    test(result, filename, 'config=./test/basic.spec.json', content);
  });
  it('should be able to replace __FILE__ and __LINE__ within MACRO', () => {
    const content = '\n\n\nLOG_INFO("this is a " + variable)';
    const filename = 'test.js';
    const result = '\n\n\nconsole.log("this is a " + variable + \' (test.js:4)\');';
    test(result, filename, 'config=./test/basic.spec.json', content);
  });
  it('should accept buffer as content', () => {
    const content = 'This is a test\nMYMACRO\nEnd of file';
    const contentBuffer = new Buffer(content);
    const filename = 'test.js';
    const definition = 'Bla bla\n\n***';
    const result = `This is a test\n${definition}\nEnd of file`;
    test(result, filename, 'config=./test/basic.spec.json', contentBuffer);
  });
});
