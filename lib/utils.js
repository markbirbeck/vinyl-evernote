var Evernote = require('evernote').Evernote;

exports.getNotebookByName = function(noteStore, name, callback){

  /**
   * Search all of the notebooks in the user's account:
   */

  noteStore.listNotebooks(function(err, notebooks) {
    var notebook = null;

    for (var i in notebooks){
      if (notebooks[i].name === name){
        notebook = notebooks[i];
        break;
      }
    }
    return callback(null, notebook);
  });
};

var reBlankLines = new RegExp('(^(<div><br\/><\/div>)|(<br\/>))', 'gm');
var reRemoveENML = new RegExp(
  '(^<\\?xml version="1.0" encoding="UTF-8" standalone="no"\\?>[\r\n]?)' +
    '|(^<!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd">[\r\n]?)' +
    '|(^<en-note style="word-wrap: break-word; -webkit-nbsp-mode: space; -webkit-line-break: after-white-space;">[\r\n]?)' +
    '|(<span style="-evernote-last-insertion-point:true;"/>)' +
    '|(^<div[^>]*>)|(<\/div>$)' +
    '|(^<\/en-note>[\r\n]?)'
, 'gm'
);

exports.removeENML = function (s, callback){
  callback(null, s.replace(reBlankLines, '').replace(reRemoveENML, ''));
};

exports.checkVersion = function (client, cb){
  var userStore = client.getUserStore();

  userStore.checkVersion(
    'Evernote EDAMTest (Node.js)',
    Evernote.EDAM_VERSION_MAJOR,
    Evernote.EDAM_VERSION_MINOR,
    function(err, versionOk) {
      if (!err && !versionOk){
        err = new Error('Evernote module is not up-to-date');
      }
      return cb(err);
    }
  );
};

exports.search = function (query, noteStore, opts, next){
  var filter = new Evernote.NoteFilter();
  var spec = new Evernote.NotesMetadataResultSpec();

  filter.words = query;
  spec.includeTitle = true;
  spec.includeNotebookGuid = true;
  noteStore.findNotesMetadata(opts.token, filter, 0, 100, spec, function(err, notes){
    if (err){
      throw new Error( err );
    } else {
      if (!notes){
        next(null);
      } else {
        notes.notes.map(function (noteStub){
          noteStore.getNote(opts.token, noteStub.guid, true, false, false, false, next);
        });
      }
    }
  });
};