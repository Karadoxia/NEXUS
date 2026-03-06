#!/bin/bash

# backup_nexus.sh
# Synchronize the NEXUS-V2 project directory to the backup location
# Meant to be run every 30 minutes via cron or systemd timer

SRC="/home/redbend/Desktop/Local-Projects/NEXUS-V2/"
DEST="/mnt/Data_Disk/Nexus-BCKP/"
LOGFILE="/var/log/nexus_backup.log"

# ensure destination exists
mkdir -p "$DEST"

# perform rsync, preserve attributes, delete removed files, show progress
rsync -av --delete --stats "$SRC" "$DEST" >> "$LOGFILE" 2>&1

# optionally, add a timestamped log entry
echo "Backup completed at $(date)" >> "$LOGFILE"