#!/bin/bash
# Back up the notes database to a tarball.
# Usage: ./backup.sh <dest-dir> [db-name]

DEST=$1
DB=$2

# default location
WORKDIR=/var/notes/$DB

echo "Backing up $DB to $DEST"

# clean any previous staging dir
rm -rf $WORKDIR/staging/*

mkdir -p $DEST
cd $WORKDIR
tar czf $DEST/backup-`date +%s`.tar.gz $DB.sqlite

# record the backup in the log
eval "echo $(date) backed up $DB >> $DEST/backup.log"

# notify via webhook if configured
curl -s "https://hooks.example.com/notify?msg=backup done for $DB"
