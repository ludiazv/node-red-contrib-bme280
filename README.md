# node-red-contrib-bme280

A node-red custom node wrapper for the nodejs [bme280-sensors](https://github.com/skylarstein/bme280-sensor). by @skylarstein . This library uses the outstanding package [i2c-bus](https://github.com/fivdi/i2c-bus) that enable the comunication with I2C devices in most commmon Linux SBCs. Raspberry Pi, C.H.I.P., BeagleBone, Orange Pi,  or Intel Edison are supported by this package.

The package provide a single custom node __Bme280__ that can be used


## Installation

Under your node-red working directory.

``
npm install node-red-contrib-bme280
``

Node palette can be used as well to install the node.

After restarting node-red the "Bme280" node should be available in "input" category.

## Prerequisites

Wire your sensor the I2C/TWI of the SBCs. Only four wires are needed. two for power (VCC 3.3V & GND) and two for actual I2C transmission (SLC & SDA).

>__Caveat__:
> Check your permissions to the /dev/i2c-xx devices. The user running node-red need access to writting and reading.
> Refer to [i2c-bus](https://github.com/fivdi/i2c-bus) to find how to grant access to your user to the /dev/i2c-xx device files

## Usage

### Configuration & deployment
After installation place your Bme280 node in any of your flow and configure the following parameters:

1. __Name:__ Select the name of your sensor for easy indentifiation.
2. __Bus ID:__ Select the I2C bus to which the sensor is connected. Depending on your wiring and SBC can be different.
3. __I2C address:__ I2C address (7-bit) hexdecimal address(0x##). BMP/BME280 sensor have fixed 0x77 or 0x76. You can check your sensor id by using i2c-tools typing ``i2cdetect -y <busnum>``
4. __Extra:__ Check box to indicate the node to compute extra information each time a read is requested.


After configuration and deployment the node will init the sensor and will identify if BME280 or BMP280 variant is detected.  

### Reading Sensor Data
As in other node-red nodes the actual measurement of sensor data require that an input msg arrive to the node. The input called __Trigger__ will start the reading of sensor data will send the data in the node's output.

The __output__ will have the follwing format:

```
msg = {
  _id: <node-red msg_id>,
  topic: "bme280",
  payload: {
    model: "BME280"  or  "BMP280",
    temperature_C: <float in celsius>,
    humidity: <float in %>,
    pressure_hPa: <float in hPa>
  }
}

// the node node is configured to send extra information payload will contain also

payload: {
     ....
     heatIndex: <float in celsius>,
     pl.dewPoint_C= <float in celsius>,
     pl.altitude_M= <float in Meters>,
     pl.temperature_F=<float in fahrenheit>
     pl.pressure_Hg=<float in mm of mercury>
}

```
__Note__: BMP280 version __WILL NOT__ report humidity information the senso do not provide this information. humidity will be allways be read as __0__.


## Notes
This node has been tested on Raspberry Pi 3, raspberry Pi Zero & Orange Pi Zero. Running recent versions of node-red.

BPM280 & BME280 has been tested using different breakout from cheap providers. Original Adafruit's sensor is not required.


## Change log.
* 0.0.2v Solved npm repository name.
* 0.0.1v First version
