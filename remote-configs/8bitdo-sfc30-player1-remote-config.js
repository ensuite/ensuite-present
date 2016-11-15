(function () {

  'use strict';

  window.remoteConfigs = window.remoteConfigs || {}

  window.remoteConfigs['8bitdo-sfc30-player1'] = {
    'down(KeyK)': {
      command: 'go-to-previous-step',
      commandArgs: { secret: false },
    },
    'down(KeyE)': {
      command: 'go-to-previous-step',
      commandArgs: { secret: true },
    },
    'down(KeyM)': {
      command: 'go-to-next-step',
      commandArgs: { secret: false },
    },
    'down(KeyF)': {
      command: 'go-to-next-step',
      commandArgs: { secret: true },
    },
    'down(KeyN)': {
      command: ['reset-stopwatch', 'reset-timer'],
      commandArgs: {},
    },
    'down(KeyO)': {
      command: ['toggle-stopwatch', 'toggle-timer'],
      commandArgs: {},
    },
    'down(KeyC)': {
      command: 'move-notes',
      commandArgs: { amount: -90 },
    },
    'down(KeyD)': {
      command: 'move-notes',
      commandArgs: { amount: 90 },
    },
    'down(KeyI)': {
      command: 'toggle-slide-deck-state',
      commandArgs: { state: 'one', enabled: true },
    },
    'up(KeyI)': {
      command: 'toggle-slide-deck-state',
      commandArgs: { state: 'one', enabled: false },
    },
  }
})()
