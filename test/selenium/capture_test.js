const test = require('ava');
const { initWebdriverTests } = require('../helpers/webdriverSetup');
const { testCapture, compileFavicon } = require('../helpers/capture');

initWebdriverTests(test);

test('no 16 high quality', t => {
  return testCapture(t, 16,
    { w: 640, h: 480, t: 0.03, n: 204, s: 2 },
    { captureTimeout: 3 * 60 * 1000 });
});

test('no 16 med quality', t => {
  return testCapture(t, 16,
    { w: 480, h: 360, t: 0.03, n: 204, s: 2 },
    { captureTimeout: 3 * 60 * 1000 });
});

test('no 8 w defaults', t => {
  return testCapture(t, 8);
});

test('no 0 to favicon', t => {
  const no = 0;
  return testCapture(t, no, { w: 64, h: 64, n: 1, s: 0 })
    .then(() => testCapture(t, no, { w: 32, h: 32, n: 1, s: 0 }))
    .then(() => testCapture(t, no, { w: 24, h: 24, n: 1, s: 0 }))
    .then(() => testCapture(t, no, { w: 16, h: 16, n: 1, s: 0 }))
    .then(() => compileFavicon(t, no))
    .then(() => t.pass());
});
