#!/bin/bash

curl -s https://raw.githubusercontent.com/wd021/helpful-scripts/main/wd021.sh | bash

if [[ "$1" != "" ]]; then
    graffiti="$1"
else
    echo -e "What's your graffiti?"
    read graffiti
fi

echo -e '\n\e[42mInstalling dependencies...\e[0m\n' && sleep 1
cd $HOME
sudo apt-get update -y
sudo apt update
sudo apt upgrade
sudo apt-get install -y build-essential
sudo apt install -y curl
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo bash -
sudo apt install -y nodejs
curl — proto ‘=https’ — tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
sudo npm install -global yarn

echo -e '\n\e[42mInstalling ironfish repo...\e[0m\n' && sleep 1
git clone https://github.com/iron-fish/ironfish
cd ironfish
yarn install