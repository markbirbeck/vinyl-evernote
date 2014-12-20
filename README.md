# Evernote to Vinyl

Run a query against an Evernote account and convert the returned notes to the Vinyl absract file format. This allows Evernote notes to be used in Gulp pipelines.

## Using the Module

The module provides a `src()` method that can be used to begin a Gulp pipeline in much the same way that `gulp.src()` is normally used:

```javascript
var evernote = require('vinyl-evernote');

gulp.task('default', function (){
  return evernote.src(query, config)
    .pipe(gulp.dest('posts'));

```

The query parameter uses the [Evernote Search Grammar](https://dev.evernote.com/doc/articles/search_grammar.php). So an example might be:

```
notebook:"Mark Birbeck's Blog" updated:month-1
```

which would retrieve all notes that have been updated in the last month, from the notebook called "Mark Birbeck's Blog".

The configuration parameter contains a [developer token](https://dev.evernote.com/doc/articles/authentication.php#devtoken) and a value to indicate whether this token applies to the sandbox testing environment, or to the normal Evernote area. An example might be:

```json
{
  token: "S=xxx:U=xxxxxx:E=xxxxxxxxxxx:C=xxxxxxxxxx:P=xxx:A=en-devtoken:V=x:H=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  sandbox: false
}
```

## An Example

An example might be to:
* take notes from a particular folder;
* remove any Evernote Markup (ENML);
* treat the remaining text as Markdown and convert to HTML, and then;
* push to S3:

```javascript
var gulp = require('gulp');
var es = require('event-stream');
var config = require('config');

var Buffer = require('buffer').Buffer;

var evernote = require('evernote-to-vinyl');
var marked = require('gulp-markdown');
var s3 = require('gulp-s3');

gulp.task('default', function (){
  return evernote.src(config.evernote.query, config.evernote)
    .pipe(es.map(function (file, cb){
      evernote.utils.removeENML(file.contents.toString(), function(err, plainText){
        file.contents = new Buffer(plainText);
        cb(null, file);
      });
    }))
    .pipe(marked({
      gfm: true,
      tables: false,
      breaks: true,
      pedantic: false,
      sanitize: false,
      smartLists: true,
      smartypants: false,
    }))
    .pipe(s3(config.aws));
});
```

This could be run as a cron job on Heroku to provide a backup of notes.