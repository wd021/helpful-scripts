#!/bin/bash

version=14.3.0

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

wget https://bzminer.com/downloads/bzminer_v${version}_linux.tar.gz
tar -xvf bzminer_v${version}_linux.tar.gz
cd bzminer_v${version}_linux

screen -S fishing -dm ./bzminer -a ironfish -w $walletAddress -p $poolAddress --nc 1
