// ==UserScript==
// @name         Bilibili quick collect
// @namespace    http://tampermonkey.net/
// @version      1.4.3
// @description  哔哩哔哩一键点赞并收藏
// @Home
// @author       Zhou Haixian
// @license      GPL-3.0
// @match        https://www.bilibili.com/video/*
// @icon         https://www.bilibili.com/favicon.ico
// @updateURL    https://raw.githubusercontent.com/zhouhaixian/bilibili-quick-collect/main/dist/index.js
// @downloadURL  https://raw.githubusercontent.com/zhouhaixian/bilibili-quick-collect/main/dist/index.js
// @grant        none
// ==/UserScript==
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
(function () {
    "use strict";
    setTimeout(addQuickCollectButton, 5000);
})();
function addQuickCollectButton() {
    var toolbar = document.querySelector("#arc_toolbar_report > div.toolbar-left");
    toolbar.appendChild(createQuickCollectButton("单击左键收藏并点赞，单击右键仅收藏", "一键收藏并点赞"));
    function createQuickCollectButton(title, innerText) {
        var collectButton = document.querySelector("#arc_toolbar_report > div.toolbar-left > span.collect");
        var quickCollectButton = document.querySelector("#arc_toolbar_report > div.toolbar-left > span[title=".concat(title, "]"));
        function synchronizeState() {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    quickCollectButton.className = collectButton.className;
                    return [2 /*return*/];
                });
            });
        }
        function handleClick() {
            like();
            collect();
        }
        function handleRightClick(e) {
            collect();
            e.preventDefault();
        }
        var collectIcon = document
            .querySelector("#arc_toolbar_report > div.toolbar-left > span.collect > svg")
            .cloneNode(true);
        var quickCollect = document.createElement("span");
        quickCollect.style.width = "13rem";
        quickCollect.className = "collect";
        quickCollect.title = title;
        quickCollect.appendChild(collectIcon);
        quickCollect.innerHTML += "\n      <span class=\"info-text\">".concat(innerText, "</span>\n    ");
        quickCollect.addEventListener("click", handleClick);
        quickCollect.addEventListener("contextmenu", handleRightClick);
        setInterval(synchronizeState, 200);
        return quickCollect;
    }
}
function like() {
    var likeButton = document.querySelector("#arc_toolbar_report > div.toolbar-left > span.like");
    likeButton.click();
}
function collect() {
    var defaultFavoritesSelector = "#app > div.video-container-v1 > div.bili-dialog-m > div > div > div.content > div > ul > li > label > span.fav-title";
    var confirmButtonSelector = "#app > div.video-container-v1 > div.bili-dialog-m > div > div > div.bottom > button";
    var collectButton = document.querySelector("#arc_toolbar_report > div.toolbar-left > span.collect");
    var dialogHandler = createDialogHandler();
    dialogHandler.hiddenDialog();
    collectButton.click();
    waitForSelector(defaultFavoritesSelector).then(function (el) { return el.click(); });
    waitForAvailable(confirmButtonSelector).then(function (el) { return el.click(); });
    waitForSelector(".bili-dialog-m", false).then(dialogHandler.unHideDialog);
    function createDialogHandler() {
        var styleElement = document.createElement("style");
        styleElement.innerHTML = "\n      .bili-dialog-m {\n        display: none;\n      }\n    ";
        function hiddenDialog() {
            document.body.appendChild(styleElement);
        }
        function unHideDialog() {
            document.body.removeChild(styleElement);
        }
        return { hiddenDialog: hiddenDialog, unHideDialog: unHideDialog };
    }
}
function waitForSelector(selector, isExist) {
    if (isExist === void 0) { isExist = true; }
    return new Promise(function (resolve) {
        var interval = setInterval(function () {
            var element = document.querySelector(selector);
            function detectExist() {
                return element !== null;
            }
            if (detectExist() === isExist) {
                clearInterval(interval);
                resolve(element);
            }
        }, 200);
    });
}
function waitForAvailable(selector) {
    return new Promise(function (resolve) {
        var interval = setInterval(function () {
            var element = document.querySelector(selector);
            if (element.disabled === false) {
                clearInterval(interval);
                resolve(element);
            }
        }, 200);
    });
}
