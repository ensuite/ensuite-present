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
    'down(Period)': {
      command: 'toggle-slide-deck-state',
      commandArgs: { state: 'one', enabled: true },
    },
    'up(Period)': {
      command: 'toggle-slide-deck-state',
      commandArgs: { state: 'one', enabled: false },
    },
  }
})()
