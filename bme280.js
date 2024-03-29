'use strict';

module.exports = function (RED) {
    const BME280 = require('bme280-sensor');
    const MAX_INIT_ERRORS=50;

    function Bme280(n) {
        RED.nodes.createNode(this, n);
        var node = this;

        node.bus = parseInt(n.bus);
        node.addr = parseInt(n.address, 16);
        node.topic = n.topic || "";
        node.extra = n.extra || false;
        node.preasure= parseFloat(n.preasure) || 1013.25;
        node.initialized = false;
        node.init_errors= 0;
        node.isBME = false;

        // init the sensor
        node.status({ fill: "grey", shape: "ring", text: "Init..." });
        node.log("Initializing on bus" + node.bus + " addr:" + node.addr);
        node.sensor = new BME280({ i2cBusNo: node.bus, i2cAddress: node.addr });
        var fnInit= function() {
            node.sensor.init().then(function (ID) {
                node.initialized = true;
                node.type = ID == BME280.CHIP_ID_BME280() ? "BME280" : "BMP280";
                node.isBME = (node.type == "BME280");
                node.status({ fill: "green", shape: "dot", text: node.type + " ready" });
                node.log("Sensor " + node.type + " initialized.");
            }).catch(function (err) {
                node.initialized=false;
                node.init_errors++;
                node.status({ fill: "red", shape: "ring", text: "Sensor Init Failed" });
                node.error("Sensor Init failed [" + node.init_errors + "]-> " + err);
                if(node.init_errors > MAX_INIT_ERRORS) {
                    node.error("Init failed more than " + MAX_INIT_ERRORS + " times. The senser will remain in failed stated.");
                }
            });
        };
        // Init
        fnInit();
        // trigger measure
        node.on('input', function (_msg) {
            if (!node.initialized) {
                //try to reinit node until no sensor is found with max retries
                if(node.init_errors <= MAX_INIT_ERRORS) fnInit();
            }
            if (!node.initialized) {
                node.send(_msg); // msg bypass
            } else {
                node.sensor.readSensorData().then(function (data) {
                    _msg.payload = data;
                    data.model = node.type;
                    if (!node.isBME && _msg.payload.humidity !== undefined) delete _msg.payload.humidity;
                    if (node.topic !== undefined && node.topic != "") _msg.topic = node.topic;
                    if (node.extra) {
                        var pl = _msg.payload;
                        if (node.isBME) {
                            pl.heatIndex = BME280.calculateHeatIndexCelcius(data.temperature_C, data.humidity);
                            pl.dewPoint_C = BME280.calculateDewPointCelcius(data.temperature_C, data.humidity);
                        }
                        pl.altitude_M = BME280.calculateAltitudeMeters(data.pressure_hPa, node.preasure);
                        pl.temperature_F = BME280.convertCelciusToFahrenheit(data.temperature_C);
                        pl.pressure_Hg = BME280.convertHectopascalToInchesOfMercury(data.pressure_hPa);
                    }
                    node.send(_msg);
                    var sText = node.type + "[Tcº:" + Math.round(data.temperature_C);
                    if (node.isBME) sText += ("/H%:" + Math.round(data.humidity));
                    node.status({ fill: "green", shape: "dot", text: sText + "]" });
                }).catch(function (err) {
                    node.status({ fill: "red", shape: "ring", text: "Sensor reading failed" });
                    node.error("Failed to read data ->" + err);
                    node.send(_msg); // msg bypass
                });
            }
            return null;
        });

    } // Bme280

    RED.nodes.registerType("Bme280", Bme280);
};
