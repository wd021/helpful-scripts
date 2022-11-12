#!/bin/bash

curl -s https://raw.githubusercontent.com/wd021/helpful-scripts/main/wd021.sh | bash

if [[ "$1" != "" ]]; then
    privateKey="$1"
else
    echo -e "What's your aleo prover pk?"
    read privateKey
fi

cd $HOME
curl — proto ‘=https’ — tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
source $HOME/.cargo/env
git clone https://github.com/AleoHQ/snarkOS.git --depth 1
cd snarkOS
./build_ubuntu.sh
cargo install --path .
screen -S proving -dm PROVER_PRIVATE_KEY=$privateKey ./run-prover.sh
