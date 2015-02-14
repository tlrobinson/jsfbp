'use strict';

function delay() {
  var proc = fbp.getCurrentProc();
  var inport = InputPort.openInputPort('IN');
  var intvlport = InputPort.openInputPort('INTVL');
  var outport = OutputPort.openOutputPort('OUT');
  var intvl_ip = intvlport.receive();
  var intvl = intvl_ip.contents;
  IP.drop(intvl_ip);

  while (true) {
    var ip = inport.receive();
    if (ip === null) {
      break;
    }
    fbp.setCallbackPending(true);
    sleep(proc, intvl);
    fbp.setCallbackPending(false);
    outport.send(ip);
  }
};

function sleep(proc, ms) {
  console.log(proc.name + ' start sleep: ' + Math.round(ms * 100) / 100 + ' msecs');  
    var fiber = Fiber.current;
    setTimeout(function() {
        fbp.queueCallback(proc);
    }, ms);
    return Fiber.yield();
}

describe('delay', function() {
  it('should copy input to output', function(){
    var result = [];

    var senderA = fbp.defProc(MockSender(['100 (a)', '200 (a)', '300 (a)', '400 (a)']));
    var senderB = fbp.defProc(MockSender(['250 (b)', '500 (b)', '750 (b)', '1000 (b)']));
    var delayA = fbp.defProc(delay);
    var delayB = fbp.defProc(delay);
    var recvr  = fbp.defProc(MockReceiver(result));

    fbp.initialize(delayA, 'INTVL', 1000);
    fbp.initialize(delayB, 'INTVL', 2500);
    fbp.connect(senderA, 'OUT', delayA, 'IN', 5);
    fbp.connect(senderB, 'OUT', delayB, 'IN', 5);
    fbp.connect(delayA, 'OUT', recvr, 'IN', 5);
    fbp.connect(delayB, 'OUT', recvr, 'IN', 5);

    // try {
      fbp.run({ trace: true });
    // } catch (e) {
    //   console.warn(e);
    // }

    expect(result).to.deep.equal(['100 (a)', '200 (a)', '250 (b)', '300 (a)', '400 (a)', '500 (b)', '750 (b)', '1000 (b)']);
  });
});
