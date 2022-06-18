// ==UserScript==
// @name         Bilibili quick collect
// @namespace    http://tampermonkey.net/
// @version      1.3.2
// @description  哔哩哔哩一键点赞并收藏
// @author       Zhou Haixian
// @license      GPL-3.0
// @match        https://www.bilibili.com/video/*
// @icon         https://www.bilibili.com/favicon.ico
// @updateURL    https://raw.githubusercontent.com/zhouhaixian/bilibili-quick-collect/main/dist/index.js
// @downloadURL  https://raw.githubusercontent.com/zhouhaixian/bilibili-quick-collect/main/dist/index.js
// @grant        none
// ==/UserScript==
(function () {
    "use strict";
    setTimeout(addQuickCollectButton, 5000);
})();
function addQuickCollectButton() {
    var toolbar = document.querySelector("#arc_toolbar_report > div.toolbar-left");
    toolbar.appendChild(createQuickCollectButton("一键收藏并点赞"));
    function createQuickCollectButton(title) {
        function synchronizeState() {
            var collectButton = document.querySelector("#arc_toolbar_report > div.toolbar-left > span.collect");
            var quickCollectButton = document.querySelector("#arc_toolbar_report > div.toolbar-left > span[title=".concat(title, "]"));
            if (collectButton.className.search(" on") === -1) {
                quickCollectButton.className = quickCollectButton.className.replace(" on", "");
            }
            else {
                quickCollectButton.className += " on";
            }
        }
        function handleClick() {
            like();
            collect();
            synchronizeState();
        }
        var collectIcon = document
            .querySelector("#arc_toolbar_report > div.toolbar-left > span.collect > svg")
            .cloneNode(true);
        var quickCollect = document.createElement("span");
        quickCollect.style.width = "13rem";
        quickCollect.className = "collect";
        quickCollect.title = title;
        quickCollect.appendChild(collectIcon);
        quickCollect.innerHTML += "\n      <span class=\"info-text\">".concat(title, "</span>\n    ");
        quickCollect.addEventListener("click", handleClick);
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
                if (element !== null)
                    return true;
                else
                    return false;
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
