#!/bin/bash
cd /home/admin/express-easy-server
git pull origin fb
npm i
npm run prod
pm2 restart fb2
exit
