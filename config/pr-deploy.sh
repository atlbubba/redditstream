#!/bin/sh

rm -rf ~/reddit-stream.com/*
cp -R ~/code/redditstream.git/* ~/reddit-stream.com/
cp  ~/code/redditstream.git/.htaccess ~/reddit-stream.com/
cp ~/code/config_backup/redditstream/esql.dbpass.php ~/reddit-stream.com/config/

# now we need to create the cat'ed js and css files

