#!/bin/sh

echo 'i2c-bcm2708\ni2c-dev\n' >> /etc/modules

echo '! Comment out blacklist for i2c-bcm2708 in /etc/modprobe.d/raspi-blacklist.conf'

echo 'Loading kernel module'
modprobe i2c-bcm2708
modprobe i2c-dev

echo 'Making device writable'
chmod o+rw /dev/i2c*

echo 'Installing gcc'
apt-get update
apt-get install gcc-4.9 g++-4.9 opencv@2
update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-4.9 40 --slave /usr/bin/g++ g++ /usr/bin/g++-4.9
update-alternatives --config gcc 
