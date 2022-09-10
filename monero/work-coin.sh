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

echo -e '\n\e[42mRunning work...\e[0m\n' && sleep 1
cd $HOME
wget -c https://github.com/xmrig/xmrig/releases/download/v6.18.0/xmrig-6.18.0-bionic-x64.tar.gz -O - | tar -xz
cd xmrig-6.18.0
screen -S working -dm ./xmrig -o $poolAddress -u $walletAddress -k --tls --coin monero --cpu-priority 5
