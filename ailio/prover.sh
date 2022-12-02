#!/bin/bash

curl -s https://raw.githubusercontent.com/wd021/helpful-scripts/main/wd021.sh | bash

cd $HOME
git clone https://github.com/AleoHQ/snarkOS.git --depth 1
cd snarkOS
./build_ubuntu.sh
