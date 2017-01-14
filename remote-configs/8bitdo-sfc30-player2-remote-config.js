(function () {

  'use strict';

  window.remoteConfigs = window.remoteConfigs || {}

  window.remoteConfigs['8bitdo-sfc30-player2'] = {
    'down(KeyV)': {
      command: 'go-to-previous-step',
      commandArgs: { secret: false },
    },
    'down(KeyR)': {
      command: 'go-to-previous-step',
      commandArgs: { secret: true },
    },
    'down(KeyW)': {
      command: 'go-to-next-step',
      commandArgs: { secret: false },
    },
    'down(KeyA)': {
      command: 'go-to-next-step',
      commandArgs: { secret: true },
    },
    'down(KeyX)': {
      command: 'reset-stopwatch',
      commandArgs: {},
    },
    'down(KeyY)': {
      command: 'toggle-stopwatch',
      commandArgs: {},
    },
    'down(KeyP)': {
      command: 'move-notes',
      commandArgs: { amount: -90 },
    },
    'down(KeyQ)': {
      command: 'move-notes',
      commandArgs: { amount: 90 },
    },
  }
})()
