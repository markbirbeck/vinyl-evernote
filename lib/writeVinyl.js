var File = require('vinyl');

exports.writeVinyl = function(stream, note, notebook){
  var file = new File({
    path: note.guid
  , base: notebook
  , contents: new Buffer(note.content)
  });

  file.stat = {
    size: note.content.length
  };
  file.title = note.title;

  stream.write(file);
};