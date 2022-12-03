'use strict';

const Utils = require('./core/Utils');

module.exports = {
  load () {
    
  },

  unload () {
    
  },

  // register your ipc messages here
  messages: {
    'open' () {
      Editor.Panel.open('sparrow-helper');
    },
    
    'create-bundle' (event, bundleName, priority) {
      Utils.createBundle(event, bundleName, priority);
    },

    'getBundles' (event) {
      Utils.getBundles(event);
    },

    'create-layer' (event, layerName, bundleName) {
      Utils.genUIUnit("Layer", layerName, bundleName);
    },

    'create-popup' (event, popupName, bundleName) {
      Utils.genUIUnit("Popup", popupName, bundleName);
    }

  },
};