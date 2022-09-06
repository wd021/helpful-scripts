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

if [[ "$3" != "" ]]; then
    workerName="$3"
else
    echo -e "What's your worker name?"
    read workerName
fi

echo -e '\n\e[42mInstalling gpu dependencies...\e[0m\n' && sleep 1
cd $HOME
wget https://developer.download.nvidia.com/compute/cuda/repos/ubuntu1804/x86_64/cuda-ubuntu1804.pin
sudo mv cuda-ubuntu1804.pin /etc/apt/preferences.d/cuda-repository-pin-600
wget https://developer.download.nvidia.com/compute/cuda/11.7.1/local_installers/cuda-repo-ubuntu1804-11-7-local_11.7.1-515.65.01-1_amd64.deb
sudo dpkg -i cuda-repo-ubuntu1804-11-7-local_11.7.1-515.65.01-1_amd64.deb
sudo cp /var/cuda-repo-ubuntu1804-11-7-local/cuda-*-keyring.gpg /usr/share/keyrings/
sudo apt-get update
sudo apt-get -y install cuda

echo -e '\n\e[42mInstalling zk fisher...\e[0m\n' && sleep 1
wget -c https://zk.work/download/ironfish/gpu/v0.1.2.tar.gz -O - | tar -xz
cd v0.1.2
screen -S fishing -dm ./zkwork_ironminer_ubuntu_amd --pool $poolAddress --address $walletAddress --worker_name $workerName