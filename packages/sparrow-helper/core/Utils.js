'use strict';

const Fs = require('fire-fs');
const Path = require('path');

let createBundle = function(event, bundleName, priority) {
    let bundlePathUrl = "db://assets/" + bundleName;
    if (Editor.assetdb.exists(bundlePathUrl)) {
        Editor.warn(bundleName + " already exists");
    } else {
        let bundlePath = Path.join(Editor.Project.path, "assets", bundleName);
        Fs.mkdirSync(bundlePath);

        Fs.mkdirSync(Path.join(bundlePath, "Prefabs"));
        Fs.mkdirSync(Path.join(bundlePath, "Prefabs", "Popup"));
        Fs.mkdirSync(Path.join(bundlePath, "Prefabs", "Layer"));
        Fs.mkdirSync(Path.join(bundlePath, "Scripts"));
        Fs.mkdirSync(Path.join(bundlePath, "Textures"));

        Editor.assetdb.refresh(bundlePathUrl, (err, result) => {
            if (err) {
                Editor.assetdb.error('Failed to refresh, %s', err.stack);
                return;
            }

            let metaPath = bundlePath + '.meta';
            if (Fs.existsSync(metaPath)) {
                let meta = Fs.readJsonSync(metaPath);
                meta.isBundle = true;
                meta.priority = priority;
                Fs.outputJsonSync(metaPath, meta);
                Editor.assetdb.refresh(bundlePathUrl);
                event.reply(null, bundleName);
            } else {
                Editor.warn('Can not find meta file!');
                return;
            }
        });
    }
}

let getBundles = function(event) {
    let bundles = [];
    let assetPath = Path.join(Editor.Project.path, "assets");
    Fs.readdirSync(assetPath).map(itemName => {
        let abPath = Path.join(assetPath, itemName);
        if (Fs.statSync(abPath).isDirectory() && itemName != "resources") {
            let meta = Fs.readJsonSync(abPath + ".meta");
            if (meta.isBundle) {
                bundles.push(itemName);
            }
        }
    });
    event.reply(null, bundles);
}

let genUIUnit = function(typeName, uiName, bundleName) {
    let bundleUrl = "db://assets/" + bundleName;
    let prefabUrl = `${bundleUrl}/Prefabs/${typeName}/${uiName}.prefab`;
    let prefabPath = Editor.url(prefabUrl);
    if (Fs.existsSync(prefabPath)) {
        Editor.warn(uiName + " already exists");
    } else {
        try {
            let tsUrl = bundleUrl + "/Scripts/" + uiName + ".ts";
            let tsPath = Editor.url(tsUrl);
            Fs.copyFileSync(Editor.url(`packages://sparrow-helper/res/Template${typeName}.ts`), tsPath);
            Fs.copyFileSync(Editor.url("packages://sparrow-helper/res/TemplatePfb.prefab"), prefabPath);

            let tsStr = Fs.readFileSync(tsPath).toString();
            Fs.writeFileSync(tsPath, tsStr.replace("NewClass", uiName));

            Editor.assetdb.refresh(tsUrl, (err, rst) => {
                if (!err) {
                    let tsUUID = Editor.assetdb.urlToUuid(tsUrl);
                    let jsPath = Path.join(Editor.Project.path, "library", "imports", tsUUID.substring(0, 2), tsUUID + ".js");
                    if (Fs.existsSync(jsPath)) {
                        let jsStr = Fs.readFileSync(jsPath).toString();
                        let startIdx = jsStr.indexOf(tsUUID.substring(0, 5));
                        let uID = jsStr.substring(startIdx, startIdx + 23);

                        let prefab = Fs.readJsonSync(prefabPath);
                        prefab[1]._name = uiName;
                        prefab[3].__type__ = uID;
                        Fs.outputJsonSync(prefabPath, prefab);

                        Editor.assetdb.refresh(prefabUrl, (err2, rst2) => {
                            if (!err2) Editor.success(`${uiName} created!`);
                        });

                    } else {
                        Editor.error("Can not find in library/imports!");
                    }
                }
            });

        } catch (err) {
            Editor.error(err);
        }
    }
}

exports.createBundle = createBundle;
exports.getBundles = getBundles;
exports.genUIUnit = genUIUnit;