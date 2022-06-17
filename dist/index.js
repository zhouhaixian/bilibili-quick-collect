// ==UserScript==
// @name         Bilibili quick collect
// @namespace    http://tampermonkey.net/
// @version      1.3.0
// @description  哔哩哔哩一键点赞并收藏
// @author       Zhou Haixian
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=typescriptlang.org
// @updateURL    https://cdn.jsdelivr.net/gh/zhouhaixian/bilibili-quick-collect/dist/index.js
// @downloadURL  https://cdn.jsdelivr.net/gh/zhouhaixian/bilibili-quick-collect/dist/index.js
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
        function switchState() {
            var collectButton = document.querySelector("#arc_toolbar_report > div.toolbar-left > span.collect");
            var quickCollectButton = document.querySelector("#arc_toolbar_report > div.toolbar-left > span[title=".concat(title, "]"));
            if (collectButton.className.search(" on") === -1) {
                quickCollectButton.className += " on";
            }
            else {
                quickCollectButton.className = quickCollectButton.className.replace(" on", "");
            }
        }
        function handleClick() {
            like();
            collect();
            switchState();
        }
        var collectIcon = "\n      <svg width=\"28\" height=\"28\" viewBox=\"0 0 28 28\" xmlns=\"http://www.w3.org/2000/svg\" class=\"icon\" style=\"fill:;\">\n        <path \n          fill-rule=\"evenodd\" \n          clip-rule=\"evenodd\" \n          d=\"M19.8071 9.26152C18.7438 9.09915 17.7624 8.36846 17.3534 7.39421L15.4723 3.4972C14.8998 2.1982 13.1004 2.1982 12.4461 3.4972L10.6468 7.39421C10.1561 8.36846 9.25639 9.09915 8.19315 9.26152L3.94016 9.91102C2.63155 10.0734 2.05904 11.6972 3.04049 12.6714L6.23023 15.9189C6.96632 16.6496 7.29348 17.705 7.1299 18.7605L6.39381 23.307C6.14844 24.6872 7.62063 25.6614 8.84745 25.0119L12.4461 23.0634C13.4276 22.4951 14.6544 22.4951 15.6359 23.0634L19.2345 25.0119C20.4614 25.6614 21.8518 24.6872 21.6882 23.307L20.8703 18.7605C20.7051 17.705 21.0339 16.6496 21.77 15.9189L24.9597 12.6714C25.9412 11.6972 25.3687 10.0734 24.06 9.91102L19.8071 9.26152Z\"\n        >\n        </path>\n      </svg>\n    ";
        var quickCollect = document.createElement("span");
        quickCollect.style.width = "13rem";
        quickCollect.className = "collect";
        quickCollect.title = title;
        quickCollect.innerHTML = "\n      ".concat(collectIcon, "\n      <span class=\"info-text\">").concat(title, "</span>\n    ");
        quickCollect.addEventListener("click", handleClick);
        return quickCollect;
    }
}
function like() {
    var likeButton = document.querySelector("#arc_toolbar_report > div.toolbar-left > span.like");
    likeButton.click();
}
function collect() {
    var collectButton = document.querySelector("#arc_toolbar_report > div.toolbar-left > span.collect");
    var dialogHandler = createDialogHandler();
    dialogHandler.hiddenDialog();
    collectButton.click();
    setTimeout(clickDefaultFavorites, 450);
    setTimeout(clickConfirmButton, 550);
    setTimeout(dialogHandler.unHideDialog, 1000);
    function clickDefaultFavorites() {
        var defaultFavorites = document.querySelector("#app > div.video-container-v1 > div.bili-dialog-m > div > div > div.content > div > ul > li > label > span.fav-title");
        defaultFavorites.click();
    }
    function clickConfirmButton() {
        var confirmButton = document.querySelector("#app > div.video-container-v1 > div.bili-dialog-m > div > div > div.bottom > button");
        confirmButton.click();
    }
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
