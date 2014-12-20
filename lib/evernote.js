var Evernote = require('evernote').Evernote;

var through2 = require('through2');

var utils = require('./utils');
var writeVinyl = require('./writeVinyl').writeVinyl;

module.exports = {
  utils: utils
, src: function (query, opts){
    opts = opts || {};

    var client = new Evernote.Client(opts);
    var stream = through2.obj();

    utils.checkVersion(client, function (err){
      if (err){
        throw new Error (err);
      }

      var noteStore = client.getNoteStore();
      var notebookGuids = {};

      utils.search(query, noteStore, opts, function (err, note){
        if (err){
          throw new Error(err);
        }
        var notebookName = notebookGuids[note.notebookGuid];

        if (!notebookName){
          noteStore.getNotebook(opts.token, note.notebookGuid, function (err, nb){
            if (err){
              throw new Error(err);
            }
            notebookGuids[note.notebookGuid] = nb.name;
            notebookName = nb.name;
            writeVinyl(stream, note, notebookName);
          });
        } else {
          writeVinyl(stream, note, notebookName);
        }
      });
    });

    return stream;
  }
};
