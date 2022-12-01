#!/bin/bash

curl -s https://raw.githubusercontent.com/wd021/helpful-scripts/main/wd021.sh | bash

if [[ "$1" != "" ]]; then
    privateKey="$1"
else
    echo -e "What's your aleo prover pk?"
    read privateKey
fi

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
git clone https://github.com/AleoHQ/snarkOS.git --depth 1
cd snarkOS
source ./build_ubuntu.sh
cargo install --path .
screen -S proving -dm source PROVER_PRIVATE_KEY=$privateKey ./run-prover.sh
