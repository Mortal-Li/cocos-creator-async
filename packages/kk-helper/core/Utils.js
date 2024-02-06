'use strict';

const Fs = require('fire-fs');
const Path = require('path');

async function createBundle(event, bundleName, priority) {
    let bundlePathUrl = "db://assets/" + bundleName;
    if (Editor.assetdb.exists(bundlePathUrl)) {
        Editor.warn(bundleName + " already exists");
    } else {
        let bundlePath = Path.join(Editor.Project.path, "assets", bundleName);
        Fs.mkdirSync(bundlePath);

        Fs.mkdirSync(Path.join(bundlePath, "Prefabs"));
        Fs.mkdirSync(Path.join(bundlePath, "Scripts"));
        Fs.mkdirSync(Path.join(bundlePath, "Textures"));

        await refreshAsyn(bundlePathUrl);
        let metaPath = bundlePath + '.meta';
        if (Fs.existsSync(metaPath)) {
            let meta = Fs.readJsonSync(metaPath);
            meta.isBundle = true;
            meta.priority = priority;
            Fs.outputJsonSync(metaPath, meta);
            refreshAsyn(bundlePathUrl);
            event.reply(null, bundleName);
        } else {
            Editor.warn('Can not find meta file!');
            return;
        }
    }
}

function getBundles(event) {
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

async function genUIUnit(typeName, uiName, bundleName) {
    let bundleUrl = "db://assets/" + bundleName;
    
    let typeDirUrl = `${bundleUrl}/Prefabs/${typeName}`;
    let typeDir = Editor.url(typeDirUrl);
    if (!Fs.existsSync(typeDir)) {
        Fs.mkdirSync(typeDir);
        await refreshAsyn(typeDirUrl);
    }

    let prefabUrl = `${typeDirUrl}/${uiName}.prefab`;
    let prefabPath = Editor.url(prefabUrl);
    if (Fs.existsSync(prefabPath)) {
        Editor.warn(uiName + " already exists");
    } else {
        let tsUrl = bundleUrl + "/Scripts/" + uiName + ".ts";
        let tsPath = Editor.url(tsUrl);
        Fs.copyFileSync(Editor.url(`packages://kk-helper/res/Template${typeName}.ts`), tsPath);
        Fs.copyFileSync(Editor.url("packages://kk-helper/res/TemplatePfb.prefab"), prefabPath);

        let tsStr = Fs.readFileSync(tsPath).toString();
        Fs.writeFileSync(tsPath, tsStr.replace("NewClass", uiName));

        await refreshAsyn(tsUrl);
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

            await refreshAsyn(prefabUrl);
            Editor.success(`${uiName} created!`);
        } else {
            Editor.error("Can not find in library/imports!");
        }
    }
}

function refreshAsyn(pathUrl) {
    return new Promise((resolve, reject) => {
        Editor.assetdb.refresh(pathUrl, (err, rst) => {
            err ? reject("refresh failed " + pathUrl) : resolve(rst);
        });
    });
}

exports.createBundle = createBundle;
exports.getBundles = getBundles;
exports.genUIUnit = genUIUnit;