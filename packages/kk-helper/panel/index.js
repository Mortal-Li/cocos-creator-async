// panel/index.js, this filename needs to match the one registered in package.json
let Fs = require('fs');
let path = require('path');

Editor.Panel.extend({
  // css style for panel
  style: Fs.readFileSync(Editor.url('packages://kk-helper/panel/index.css'), 'utf8'),

  // html template for panel
  template: Fs.readFileSync(Editor.url('packages://kk-helper/panel/index.html'), 'utf8'),

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
          widgetName: "",
          bundleChoice4: "",
        }
      },

      methods: {
        createBundle() {
          if (this.bundleName.length == 0) {
            Editor.warn("Bundle name is empty!");
          } else {
            if (!this.bundleName.endsWith("Bundle")) this.bundleName += "Bundle";
            Editor.Ipc.sendToMain("kk-helper:create-bundle", this.bundleName, this.bundlePriority, (err, name) => {
              this.bundles.push(name);
            });
          }
        },

        createLayer() {
          if (this.layerName.length == 0) {
            Editor.warn("Layer name is empty!");
          } else {
            if (!this.layerName.endsWith("Layer")) this.layerName += "Layer";
            Editor.Ipc.sendToMain("kk-helper:create-layer", this.layerName, this.bundleChoice1);
          }
        },

        createPopup() {
          if (this.popupName.length == 0) {
            Editor.warn("Popup name is empty!");
          } else {
            if (!this.popupName.endsWith("Popup")) this.popupName += "Popup";
            Editor.Ipc.sendToMain("kk-helper:create-popup", this.popupName, this.bundleChoice2);
          }
        },

        createPanel() {
          if (this.panelName.length == 0) {
            Editor.warn("Panel name is empty!");
          } else {
            if (!this.panelName.endsWith("Panel")) this.panelName += "Panel";
            Editor.Ipc.sendToMain("kk-helper:create-panel", this.panelName, this.bundleChoice3);
          }
        },

        createWidget() {
          if (this.widgetName.length == 0) {
            Editor.warn("Widget name is empty!");
          } else {
            if (!this.widgetName.endsWith("Widget")) this.widgetName += "Widget";
            Editor.Ipc.sendToMain("kk-helper:create-widget", this.widgetName, this.bundleChoice4);
          }
        },

        initData() {
          Editor.Ipc.sendToMain('kk-helper:getBundles', (err, bundles) => {
            if (err || !bundles) return;
            this.bundles = bundles;
          });
        }
      }
    });

    app.initData();

  },

});