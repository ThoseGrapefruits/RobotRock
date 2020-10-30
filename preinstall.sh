#!/bin/sh

sudo -s

echo 'i2c-bcm2708\ni2c-dev\n' >> /etc/modules

echo '! Comment out blacklist for i2c-bcm2708 in /etc/modprobe.d/raspi-blacklist.conf'

echo 'Loading kernel module'
sudo modprobe i2c-bcm2708
sudo modprobe i2c-dev

echo 'Making device writable'
sudo chmod o+rw /dev/i2c*

echo 'Installing gcc'
sudo apt-get install gcc-4.8 g++-4.8
sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-4.6 60 --slave /usr/bin/g++ g++ /usr/bin/g++-4.6
sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-4.8 40 --slave /usr/bin/g++ g++ /usr/bin/g++-4.8
sudo update-alternatives --config gcc 