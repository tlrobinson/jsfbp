'use strict';

var InputPort = require('../core/InputPort')
  , OutputPort = require('../core/OutputPort')

// same as copier, but written as a non-looper

module.exports = function copier_nonlooper() {
  var inport = InputPort.openInputPort('IN');
  var outport = OutputPort.openOutputPort('OUT');
  var ip = inport.receive();
  var i = ip.contents;
  outport.send(ip);
};