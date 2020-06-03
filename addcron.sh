crontab -l > tmpcronjobfile
#echo new cron into cron file
echo "0 0 * * * cd $PWD && npm run jobs" >> tmpcronjobfile
#install new cron file
crontab tmpcronjobfile
rm tmpcronjobfile
