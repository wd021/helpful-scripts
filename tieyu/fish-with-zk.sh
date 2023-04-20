#!/bin/bash

curl -s https://raw.githubusercontent.com/wd021/helpful-scripts/main/wd021.sh | bash

if [[ "$1" != "" ]]; then
    poolAddress="$1"
else
    echo -e "What's your pool address?"
    read poolAddress
fi

if [[ "$2" != "" ]]; then
    walletAddress="$2"
else
    echo -e "What's your wallet address?"
    read walletAddress
fi

echo -e '\n\e[42mInstalling dependencies...\e[0m\n' && sleep 1
cd $HOME
sudo apt-get update
sudo apt-get install -y build-essential libssl-dev libcurl4-openssl-dev libjansson-dev libgmp-dev automake zlib1g-dev
sudo apt-get install -y ocl-icd-opencl-dev

wget https://github.com/6block/ironfish-gpu-miner/releases/download/v0.1.8/zkwork_ironminer.tar.gz
tar -zxvf zkwork_ironminer.tar.gz

cd zkwork_ironminer

screen -S fishing -dm ./zkwork_ironminer --pool $poolAddress --address $walletAddress
