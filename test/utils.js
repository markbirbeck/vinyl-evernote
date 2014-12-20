var utils = require('../lib/utils');

require('should');

var fixture = [
  '<?xml version="1.0" encoding="UTF-8" standalone="no"?>'
, '<!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd">'
, '<en-note style="word-wrap: break-word; -webkit-nbsp-mode: space; -webkit-line-break: after-white-space;">'
, '<div style="font-family: &quot;Courier&quot;; font-size: 13px; font-style: normal; font-weight: normal;">'
  + 'Hello, World!'
  + '</div>'
, '<div style="font-family: &quot;Courier&quot;; font-size: 13px; font-style: normal; font-weight: normal;">'
  + '<br/>'
  + '</div>'
, '<div style="font-family: &quot;Courier&quot;; font-size: 13px; font-style: normal; font-weight: normal;">'
  + '> To be or not to be,'
  + '</div>'
, '<div style="font-family: &quot;Courier&quot;; font-size: 13px; font-style: normal; font-weight: normal;">'
  + '> That is the question.'
  + '</div>'
, '</en-note>'
].join('\n');

describe('Utils', function(){
  it('should convert from ENML to plaintext', function(done){
    utils.removeENML(fixture, function(err, s){
      s.should.equal([
        'Hello, World!'
      , ''
      , '> To be or not to be,'
      , '> That is the question.'
      , ''
      ].join('\n'));
      done();
    });
  });
});
