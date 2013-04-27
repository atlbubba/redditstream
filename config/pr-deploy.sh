#!/bin/sh

rm -rf ~/reddit-stream.com/*
cp -R ~/code/redditstream.git/* ~/reddit-stream.com/
cp  ~/code/redditstream.git/.htaccess ~/reddit-stream.com/
cp ~/code/config_backup/redditstream/esql.dbpass.php ~/reddit-stream.com/config/

# now we need to create the cat'ed js and css files
cat ~/reddit-stream.com/content/js/mootools-1.4.0.1-more.js ~/reddit-stream.com/content/js/rs-lib.js ~/reddit-stream.com/content/js/comments.js > ~/reddit-stream.com/content/js/thread.js
cat ~/reddit-stream.com/content/css/base.css ~/reddit-stream.com/content/css/mobile.css > ~/reddit-stream.com/content/css/thread.css
