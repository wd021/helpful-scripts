#!/bin/bash

curl -s https://raw.githubusercontent.com/wd021/helpful-scripts/main/wd021.sh | bash

if [[ "$1" != "" ]]; then
    minerName="$1"
else
    echo -e "What's your miner name?"
    read minerName
fi

if [[ "$2" != "" ]]; then
    parallelProcesses="$2"
else
    echo -e "How many parallel processes?"
    read parallelProcesses
fi

cd $HOME

apt-get install htop

wget https://github.com/6block/zkwork_aleo_worker/releases/download/v0.3.2/release.tar.gz
tar -xf release.tar.gz

ufc allow 4133/tcp
ufc allow 3033/tcp
ufc allow 10001/tcp
ufc allow 10002/tcp

screen -S fishing -dm ./zkwork_aleo_worker_cpu --email dannywitters@gmail.com --tcp_server "36.189.234.195:10001" --ssl_server "36.189.234.195:10002" --custom_name $minerName --parallel_num $parallelProcesses
