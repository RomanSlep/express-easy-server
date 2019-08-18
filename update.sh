#!/bin/bash

cd /home/admin/express-easy-server
git pull origin poker
npm run prod
pm2 restart server
