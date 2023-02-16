#!/bin/bash

if ! grep -q 'i2c-bcm2708' /etc/modules; then
  sudo sh -c 'echo "i2c-bcm2708\ni2c-dev\n" >> /etc/modules'
fi

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
sudo apt-get install build-essential -y
sudo apt-get install cmake -y
sudo apt-get install pkg-config -y
sudo apt-get install libpng12-0 libpng12-dev libpng++-dev libpng-dev -y
sudo apt-get install libpnglite-dev libpngwriter0-dev libpngwriter0c2 -y
sudo apt-get install zlib1g-dbg zlib1g zlib1g-dev -y
sudo apt-get install pngtools libtiff4-dev libtiff4 libtiffxx0c2 libtiff-tools -y
sudo apt-get install libjpeg8 libjpeg8-dev libjpeg8-dbg libjpeg-progs -y
sudo apt-get install ffmpeg libavcodec-dev libavcodec52 libavformat52 libavformat-dev -y
sudo apt-get install libgstreamer0.10-0-dbg libgstreamer0.10-0 libgstreamer0.10-dev -y
sudo apt-get install libxine1-ffmpeg  libxine-dev libxine1-bin -y
sudo apt-get install libunicap2 libunicap2-dev -y
sudo apt-get install libdc1394-22-dev libdc1394-22 libdc1394-utils -y
sudo apt-get install swig -y
sudo apt-get install libv4l-0 libv4l-dev -y
# sudo apt-get install python-numpy -y
sudo apt-get install libpython2.6 python-dev python2.6-dev -y
sudo apt-get install libgtk2.0-dev pkg-config -y

if [ ! -e opencv.zip ]; then
  wget https://github.com/opencv/opencv/archive/2.4.13.6.zip -O opencv.zip
fi

if [ ! -d opencv-2.4.13.6 ]; then
  unzip -d . opencv.zip
fi

cd opencv-2.4.13.6
sed \
  -i 's/\bCODEC_FLAG_GLOBAL_HEADER/AV_CODEC_FLAG_GLOBAL_HEADER/g' \
  modules/highgui/src/cap_ffmpeg_impl.hpp

mkdir build
cd build
cmake \
  -D CMAKE_BUILD_TYPE=RELEASE \
  -D CMAKE_INSTALL_PREFIX=/usr/local \
  -D INSTALL_PYTHON_EXAMPLES=ON \
  -D INSTALL_C_EXAMPLES=ON \
  -D OPENCV_EXTRA_MODULES_PATH=~/opencv_contrib/modules \
  -D BUILD_EXAMPLES=ON \
  ..

# Keep 1 core open for other stuff
make -j $((`nproc` - 1))
sudo make install
sudo ldconfig

sudo update-alternatives \
  --install /usr/bin/gcc gcc /usr/bin/gcc-4.9 40 \
  --slave '/usr/bin/g++' 'g++' /usr/bin/g++-4.9
sudo update-alternatives --config gcc 

echo 'Preinstall complete.'
echo 'If this is your first time running install, you may need to reboot.'
