#!/bin/bash

curl -s https://raw.githubusercontent.com/wd021/helpful-scripts/main/wd021.sh | bash

echo -e '\n\e[42mInstalling dependencies...\e[0m\n' && sleep 1
cd $HOME

sudo apt-get update
sudo apt-get install -y build-essential libssl-dev libcurl4-openssl-dev libjansson-dev libgmp-dev automake zlib1g-dev
sudo apt-get install -y ocl-icd-opencl-dev

# cuda opencl drivers
wget https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2004/x86_64/cuda-keyring_1.0-1_all.deb
sudo dpkg -i cuda-keyring_1.0-1_all.deb
sudo apt-get update
sudo apt-get -y install cuda

# zk
wget https://github.com/6block/ironfish-gpu-miner/releases/download/v2.0.1/zkwork_ironminer.tar.gz
tar -zxvf zkwork_ironminer.tar.gz

cd zkwork_ironminer