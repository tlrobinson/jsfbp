var fbp = require('..')
  , path = require('path');

// --- define network ---
var reader = fbp.defProc('./components/reader.js');
var copier = fbp.defProc('./components/copier.js');
var recvr  = fbp.defProc('./components/recvr.js');

fbp.initialize(reader, 'FILE', path.resolve(__dirname, 'data/text.txt'));
fbp.connect(reader, 'OUT', copier, 'IN', 1);
fbp.connect(copier, 'OUT', recvr, 'IN', 1);

// --- run ---
fbp.run({ trace: true });