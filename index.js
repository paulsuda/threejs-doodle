/* eslint-disable no-unused-vars */
const assert = require('assert');
const script = require('./src/script');
const css = require('./src/style.css');
const rootId = 'root';

const rootEl = document.getElementById(rootId); // eslint-disable-line no-undef
assert(rootEl);
script(rootEl);
