#!/bin/sh

sudo echo 'i2c-bcm2708\ni2c-dev\n' >> /etc/modules

echo '! Comment out blacklist for i2c-bcm2708 in /etc/modprobe.d/raspi-blacklist.conf'

echo 'Loading kernel module'
sudo modprobe i2c-bcm2708
sudo modprobe i2c-dev

echo 'Making device writable'
sudo chmod o+rw /dev/i2c*

echo 'Installing gcc'
sudo apt-get update
sudo apt-get install gcc-4.9 g++-4.9 -y

echo 'Installing OpenCV'
pip install numpy

if [ ! -d opencv ]; then
  if [ ! -e opencv.zip ]; then
    wget https://github.com/opencv/opencv/archive/2.4.13.6.zip -O opencv.zip
  fi

  rm -rf opencv-2.4.13.6 
  unzip -d . opencv.zip
  cd opencv-2.4.13.6 && mkdir build && cd build
  cmake \
    -D CMAKE_BUILD_TYPE=RELEASE \
    -D CMAKE_INSTALL_PREFIX=/usr/local \
    -D INSTALL_PYTHON_EXAMPLES=ON \
    -D INSTALL_C_EXAMPLES=ON \
    -D OPENCV_EXTRA_MODULES_PATH=~/opencv_contrib/modules \
    -D BUILD_EXAMPLES=ON \
    ..
  make -j `nproc`
  sudo make install
  sudo ldconfig
fi

sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-4.9 40 --slave /usr/bin/g++ g++ /usr/bin/g++-4.9
sudo update-alternatives --config gcc 
