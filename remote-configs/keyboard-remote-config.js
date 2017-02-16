(function () {

  'use strict';

  window.remoteConfigs = window.remoteConfigs || {}

  window.remoteConfigs['keyboard'] = {
    'down(Home)': {
      command: 'go-to-first-step',
      commandArgs: { secret: false },
    },
    'down(Shift+Home)': {
      command: 'go-to-first-step',
      commandArgs: { secret: true },
    },
    'down(ArrowLeft)': {
      command: 'go-to-previous-step',
      commandArgs: { secret: false },
    },
    'down(Shift+ArrowLeft)': {
      command: 'go-to-previous-step',
      commandArgs: { secret: true },
    },
    'down(ArrowRight)': {
      command: 'go-to-next-step',
      commandArgs: { secret: false },
    },
    'down(Shift+ArrowRight)': {
      command: 'go-to-next-step',
      commandArgs: { secret: true },
    },
    'down(End)': {
      command: 'go-to-last-step',
      commandArgs: { secret: false },
    },
    'down(Shift+End)': {
      command: 'go-to-last-step',
      commandArgs: { secret: true },
    },
    'down(KeyS)': {
      command: ['toggle-stopwatch', 'toggle-timer'],
      commandArgs: {},
    },
    'down(Shift+KeyS)': {
      command: ['reset-stopwatch', 'reset-timer'],
      commandArgs: {},
    },
    'down(PageUp)': {
      command: 'update-timer',
      commandArgs: { amount: 60 },
    },
    'down(PageDown)': {
      command: 'update-timer',
      commandArgs: { amount: -60 },
    },
    'down(ArrowUp)': {
      command: 'move-notes',
      commandArgs: { amount: -90 },
    },
    'down(ArrowDown)': {
      command: 'move-notes',
      commandArgs: { amount: 90 },
    },
    'down(Digit0)': {
      command: 'set-slide-deck-ratio',
      commandArgs: { ratio: 'auto' },
    },
    'down(Digit4)': {
      command: 'set-slide-deck-ratio',
      commandArgs: { ratio: '4/3' },
    },
    'down(Digit6)': {
      command: 'set-slide-deck-ratio',
      commandArgs: { ratio: '16/9' },
    },
  }
})()
