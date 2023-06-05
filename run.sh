#!/bin/bash

cleanup() { 
    echo -e "\033[31mTerminating background processes...\033[0m"
    pkill -P $$ 
    exit 0
}

trap cleanup EXIT

echo -e "\033[34mInstalling required dependecies...\033[0m" 
source ~/.nvm/nvm.sh
nvm install
nvm use
npm install
pip install -r requirements.txt

echo -e "\033[34mMaking migrations...\033[0m"
python manage.py makemigrations 

echo -e "\033[34mMigrating...\033[0m"
python manage.py migrate 

echo -e "\033[34mSetting up logs files...\033[0m"
mkdir -p logs

echo -e "\033[34mStarting Django development server...\033[0m" 
python manage.py runserver 0.0.0.0:8000 > logs/dev_logs.out 2>&1 &

echo -e "\033[34mStarting Webpack...\033[0m" 
npm run dev > logs/webpack_logs.out 2>&1 &



serverUp="\033[32mDev server should be up at: \033[34mhttp://127.0.0.1:8000/\033[0m"
warnMessage="\033[33mRemember to check logs for any errors!\033[0m"
noitceMessage="\033[33mRestart upon any edits to webpack config!\033[0m"
len=${#serverUp}
bar=$(printf '=%.0s' $(seq 1 $len))


echo "+-$bar-+"
echo -e " $serverUp "
echo -e " $warnMessage "
echo -e " $noitceMessage "
echo "+-$bar-+"


wait 
