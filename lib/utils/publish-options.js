'use strict';

module.exports = [
  { name: 'make', type: Boolean, default: true },
  { name: 'publish', type: Boolean, default: true },
  { name: 'configure', type: Boolean, default: false },
  { name: 'skipbuild', type: Boolean, default: false },
  { name: 'skipassemble', type: Boolean, default: false },
  { name: 'skippackage', type: Boolean, default: false }
];
