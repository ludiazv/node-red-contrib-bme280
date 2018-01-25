# node-red-contrib-bme280

A node-red custom node wrapper for the nodejs [bme280-sensors](https://github.com/skylarstein/bme280-sensor). by @skylarstein . This library uses the outstanding package [i2c-bus](https://github.com/fivdi/i2c-bus) that enable the comunication with I2C devices in most commmon Linux SBCs. Raspberry Pi, C.H.I.P., BeagleBone, Orange Pi,  or Intel Edison are supported by this package.

The package provide a single custom node __Bme280__ that can be used


## Installation

Under your node-red working directory.
``
npm install node-red-contrib-bme280
``

## Prerequisites

Wire your sensor the I2C/TWI of the SBCs. Only four wires are needed. two for power (VCC 3.3V & GND) and two for actual I2C transmission (SLC & SDA).



>Caveat:
> Check your permissions to the /dev/i2c-xx devices. The user running node-red need access to writting and reading.
> Refer to [i2c-bus](https://github.com/fivdi/i2c-bus) to find how to grant




## Usage
After installation place your Bme280 node in any of your flow and configure the following parameters:
1. Name: Select the name of your sensor for easy indentifiation.
2. Bus ID: Select the I2C bus to which the sensor is connected. Depending on your wiring and SBC can be diferent refer to




## Notes
This node has been tested succesfully in Raspberry Pi 3, raspberry Pi Zero & Orange Pi Zero.

BPM280 & BME280 has been tested using different breakout from cheap providers. Orignal Adafruit's sensor is not required.


## Change log.
* 0.0.1v First version
