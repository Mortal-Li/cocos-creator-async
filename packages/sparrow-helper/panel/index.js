// panel/index.js, this filename needs to match the one registered in package.json
let Fs = require('fs');
let path = require('path');

Editor.Panel.extend({
  // css style for panel
  style: Fs.readFileSync(Editor.url('packages://sparrow-helper/panel/index.css'), 'utf8'),

  // html template for panel
  template: Fs.readFileSync(Editor.url('packages://sparrow-helper/panel/index.html'), 'utf8'),

  // method executed when template and styles are successfully loaded and initialized
  ready () {
    const app = new window.Vue({
      el: this.shadowRoot,

      data() {
        return {
          bundleName: "",
          bundlePriority: "1",
          bundles: [],
          layerName: "",
          bundleChoice1: "",
          popupName: "",
          bundleChoice2: "",
          panelName: "",
          bundleChoice3: "",
        }
      },

      methods: {
        createBundle() {
          if (this.bundleName.length == 0) {
            Editor.warn("Bundle name is empty!");
          } else {
            Editor.Ipc.sendToMain("sparrow-helper:create-bundle", this.bundleName, this.bundlePriority, (err, name) => {
              this.bundles.push(name);
            });
          }
        },

        createLayer() {
          if (this.layerName.length == 0) {
            Editor.warn("Layer name is empty!");
          } else {
            Editor.Ipc.sendToMain("sparrow-helper:create-layer", this.layerName, this.bundleChoice1);
          }
        },

        createPopup() {
          if (this.popupName.length == 0) {
            Editor.warn("Popup name is empty!");
          } else {
            Editor.Ipc.sendToMain("sparrow-helper:create-popup", this.popupName, this.bundleChoice2);
          }
        },

        createPanel() {
          if (this.panelName.length == 0) {
            Editor.warn("Panel name is empty!");
          } else {
            Editor.Ipc.sendToMain("sparrow-helper:create-panel", this.panelName, this.bundleChoice3);
          }
        },

        initData() {
          Editor.Ipc.sendToMain('sparrow-helper:getBundles', (err, bundles) => {
            if (err || !bundles) return;
            this.bundles = bundles;
          });
        }
      }
    });

    app.initData();

  },

});