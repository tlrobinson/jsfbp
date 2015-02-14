var chai = require('chai');

global.expect = chai.expect;
global.fbp = require('..');
global.Fiber = require('fibers');

global.IP = require('../core/IP');
global.InputPort = require('../core/InputPort');
global.InputPortArray = require('../core/InputPortArray');
global.OutputPort = require('../core/OutputPort');
global.OutputPortArray = require('../core/OutputPortArray');

global.MockSender = function(inputArray) {
  return function() {
    var outport = OutputPort.openOutputPort('OUT');
    inputArray.forEach(function(item) {
      outport.send(IP.create(item));
    });
  }
}

global.MockReceiver = function(outputArray) {
  return function() {
    var inport = InputPort.openInputPort('IN');
    var ip;
    while ((ip = inport.receive()) !== null) {
      outputArray.push(ip.contents);
      IP.drop(ip);
    }
  }
}
