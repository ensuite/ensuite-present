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

      socket.on('FOUR', function ({ command, commandArgs }) {

        console.log(command, commandArgs)

        if (commandArgs == null) {
          return
        }

        if (editor.getPath().endsWith('index.adoc') && commandArgs.slideLineno != null) {
          editor.setCursorBufferPosition([360, 0])
          setTimeout(() => {
            editor.setCursorBufferPosition([commandArgs.slideLineno - 1, 0])
          }, 5)
        }

        if (editor.getPath().endsWith('script.adoc') && commandArgs.notesLineno != null) {
          editor.setCursorBufferPosition([360, 0])
          setTimeout(() => {
            editor.setCursorBufferPosition([commandArgs.notesLineno - 1, 0])
          }, 5)
        }
      })

      // editor.onDidChangeCursorPosition(function ({ newBufferPosition }) {
      //
      //   let slideLineno = newBufferPosition.row + 1
      //
      //   socket.emit('ONE', {
      //     command: 'go-to-step',
      //     commandArgs: { slideLineno },
      //   })
      // })
    }
  }

};
