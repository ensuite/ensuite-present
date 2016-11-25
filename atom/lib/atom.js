'use babel';

import AtomView from './atom-view';
import { CompositeDisposable } from 'atom';
import io from 'socket.io-client';

var socket = io.connect('http://localhost:9999');

export default {

  atomView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.atomView = new AtomView(state.atomViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.atomView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.atomView.destroy();
  },

  serialize() {
    return {
      atomViewState: this.atomView.serialize()
    };
  },

  toggle() {

    let editor
    if (editor = atom.workspace.getActiveTextEditor()) {
      editor.onDidChangeCursorPosition(function ({ newScreenPosition }) {
        let rowNb = newScreenPosition.row
        let line = editor.lineTextForBufferRow(rowNb)

        let matches = /\[#([^.,]*)(.*)\]/.exec(line)
        if (matches != null) {
          socket.emit('ONE', { command: 'go-to-step', commandArgs: { cursor: matches[1] } })
          return console.log('FOUND', matches[1])
        }

        while (!line.match(/=+ /) && rowNb >= 0) {
          rowNb -= 1
          line = editor.lineTextForBufferRow(rowNb)
        }

        if (line.match(/=+ /)) {
          rowNb -= 1
          line = editor.lineTextForBufferRow(rowNb)

          let matches = /\[#([^.,]*)(.*)\]/.exec(line)
          if (matches != null) {
            socket.emit('ONE', { command: 'go-to-step', commandArgs: { cursor: matches[1] } })
            return console.log('FOUND', matches[1])
          }
        }
      })
    }
  }

};
