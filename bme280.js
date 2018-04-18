'use strict';

module.exports = function(RED) {
  const BME280 = require('bme280-sensor');

  function Bme280(n) {
    RED.nodes.createNode(this,n);
    var node = this;
    //var context=this.context();

    node.bus=parseInt(n.bus);
    node.addr=parseInt(n.address,16);
    node.topic= n.topic || "";
    node.extra=n.extra || false;
    node.initialized=false;


    // init the sensor
    node.status({fill:"grey",shape:"ring",text:"Init..."});
    node.log("Initializing on bus" + node.bus +" addr:"+node.addr);
    node.sensor=new BME280({i2cBusNo:node.bus,i2cAddress:node.addr});
    node.sensor.init().then( function (ID) {
        node.initialized=true;
        node.type= ID==BME280.CHIP_ID_BME280() ? "BME280" : "BMP280";
        node.status({fill:"green",shape:"dot",text:node.type+" Initialized!"});
        node.log("Running " + node.type);
    }).catch(function(err) {
        node.status({fill:"red",shape:"ring",text: "" + err});
        node.log
    });
    // trigger measure
    node.on('input',function(_msg) {
       if(!node.initialized) return null;
       node.sensor.readSensorData().then(function(data){
         //var msg={_msgid:RED.util.generateId(),topic:"bme280",payload:data};
         _msg.payload=data;
         data.model=node.type;
         if(node.topic !== undefined && node.topic != "") _msg.topic=node.topic;
         if(node.extra) {
           var pl=msg.payload;
           pl.heatIndex=BME280.calculateHeatIndexCelcius(data.temperature_C,data.humidity);
           pl.dewPoint_C=BME280.calculateDewPointCelcius(data.temperature_C,data.humidity);
           pl.altitude_M=BME280.calculateAltitudeMeters(data.pressure_hPa,0);
           pl.temperature_F=BME280.convertCelciusToFahrenheit(data.temperature_C);
           pl.pressure_Hg=BME280.convertHectopascalToInchesOfMercury(data.pressure_hPa);
         }
         node.send(_msg);
         node.status({fill:"green",shape:"dot",text:node.type+" T:"+Math.floor(data.temperature_C)+"C/ H%:" + Math.floor(data.humidity) +"%"});
       }).catch(function(err) {
         node.status({fill:"red",shape:"ring",text:"Sensor reading failed"});
         node.error("Failed to read data ->" + err);
       });
       return null;
    });

  } // Bme280

  RED.nodes.registerType("Bme280",Bme280);
};
