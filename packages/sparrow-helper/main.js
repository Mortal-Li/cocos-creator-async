'use strict';

const Fs = require('fire-fs');
const Path = require('path');

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
      let path = "db://assets/" + bundleName;
      if (Editor.assetdb.exists(path)) {
        Editor.warn(bundleName + " already exists");
      } else {
        let bundlePath = Editor.Project.path + "/assets";
        Fs.mkdirSync(Path.join(bundlePath, bundleName));

        bundlePath += '/' + bundleName;
        Fs.mkdirSync(Path.join(bundlePath, "Prefabs"));
        Fs.mkdirSync(Path.join(bundlePath, "Scripts"));
        Fs.mkdirSync(Path.join(bundlePath, "Textures"));
        Fs.mkdirSync(Path.join(bundlePath + "/Prefabs", "Popup"));
        Fs.mkdirSync(Path.join(bundlePath + "/Prefabs", "Layer"));

        Editor.assetdb.refresh(path, (err, result) => {
          if (err) {
            Editor.assetdb.error('Failed to refresh, %s', err.stack);
            return;
          }

          let metaPath = path + '.meta';
          if (Fs.existsSync(Editor.url(metaPath))) {
            let meta = Fs.readJsonSync(Editor.url(metaPath));
            meta.isBundle = true;
            meta.priority = priority;
            Fs.outputJsonSync(Editor.url(metaPath), meta);
            Editor.assetdb.refresh(path);
            event.reply(null, bundleName);
          } else {
            Editor.warn('Failed to set Bundle Info');
            return;
          }
        });
      }

    },

    'getBundles' (event) {
      let bundles = [];
      let dirPath = Editor.Project.path + "/assets";
      Fs.readdirSync(dirPath).map(itemName => {
        let abPath = Path.join(dirPath, itemName);
        if (Fs.statSync(abPath).isDirectory()) {
          let meta = Fs.readJsonSync(abPath + ".meta");
          if (meta.isBundle) {
            bundles.push(itemName);
          }
        }
      });
      event.reply(null, bundles);
    },

    'create-layer' (event, layerName, bundleName) {
      let bundleUrl = "db://assets/" + bundleName;
      let prefabPath = Editor.url(bundleUrl + "/Prefabs/Layer/" + layerName + ".prefab");
      if (Fs.existsSync(prefabPath)) {
        Editor.warn(layerName + " already exists");
      } else {
        try {
          let tsPath = Editor.url(bundleUrl + "/Scripts/" + layerName + ".ts");
          Fs.copyFileSync(Editor.url("packages://sparrow-helper/res/TemplateLayer.ts"), tsPath);
          Fs.copyFileSync(Editor.url("packages://sparrow-helper/res/TemplatePfb.prefab"), prefabPath);

          let prefab = Fs.readJsonSync(prefabPath);
          prefab[1]._name = layerName;
          Fs.outputJsonSync(prefabPath, prefab);

          let tsStr = Fs.readFileSync(tsPath).toString();
          Fs.writeFileSync(tsPath, tsStr.replace("NewClass", layerName));

          Editor.assetdb.refresh(bundleUrl);
        } catch (err) {
          Editor.error(err);
        }
      }
    },

    'create-popup' (event, popupName, bundleName) {
      let bundleUrl = "db://assets/" + bundleName;
      let prefabPath = Editor.url(bundleUrl + "/Prefabs/Popup/" + popupName + ".prefab");
      if (Fs.existsSync(prefabPath)) {
        Editor.warn(popupName + " already exists");
      } else {
        try {
          let tsPath = Editor.url(bundleUrl + "/Scripts/" + popupName + ".ts");
          Fs.copyFileSync(Editor.url("packages://sparrow-helper/res/TemplatePopup.ts"), tsPath);
          Fs.copyFileSync(Editor.url("packages://sparrow-helper/res/TemplatePfb.prefab"), prefabPath);

          let prefab = Fs.readJsonSync(prefabPath);
          prefab[1]._name = popupName;
          Fs.outputJsonSync(prefabPath, prefab);

          let tsStr = Fs.readFileSync(tsPath).toString();
          Fs.writeFileSync(tsPath, tsStr.replace("NewClass", popupName));

          Editor.assetdb.refresh(bundleUrl);
        } catch (err) {
          Editor.error(err);
        }
      }
    }

  },
};