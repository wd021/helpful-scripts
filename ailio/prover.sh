#!/bin/bash

curl -s https://raw.githubusercontent.com/wd021/helpful-scripts/main/wd021.sh | bash

if [[ "$1" != "" ]]; then
    privateKey="$1"
else
    echo -e "What's your aleo prover pk?"
    read privateKey
fi

cd $HOME
git clone https://github.com/AleoHQ/snarkOS.git --depth 1
cd snarkOS
./build_ubuntu.sh
export PROVER_PRIVATE_KEY=$privateKey
screen -S proving -dm ./run-prover.sh
