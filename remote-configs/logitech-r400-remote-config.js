(function () {

  'use strict';

  window.remoteConfigs = window.remoteConfigs || {}

  window.remoteConfigs['logitech-r400'] = {
    'down(ArrowLeft)': {
      command: 'go-to-previous-step',
      commandArgs: { secret: false },
    },
    'down(ArrowRight)': {
      command: 'go-to-next-step',
      commandArgs: { secret: false },
    },
    'down(Escape)': {
      command: 'reset-stopwatch',
      commandArgs: {},
    },
    'down(F5)': {
      command: 'reset-stopwatch',
      commandArgs: {},
    },
    'down(Period)': {
      command: 'toggle-stopwatch',
      commandArgs: {},
    },
  }
})()
