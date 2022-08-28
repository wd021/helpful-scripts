#!/bin/bash

curl -s https://raw.githubusercontent.com/wd021/helpful-scripts/main/wd021.sh | bash

echo -e '\n\e[42mInstalling dependencies...\e[0m\n' && sleep 1
cd $HOME
sudo apt-get update -y
sudo apt update
sudo apt upgrade -y
sudo apt-get install -y build-essential
sudo apt install -y curl
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo bash -
sudo apt install -y nodejs
curl — proto ‘=https’ — tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
source $HOME/.cargo/env
sudo npm install -global yarn

echo -e '\n\e[42mInstalling wd021-ironfish repo...\e[0m\n' && sleep 1
git clone https://github.com/wd021/ironfish
cd ironfish
git checkout rescan
yarn install
cd ironfish-cli
yarn start chain:download --confirm