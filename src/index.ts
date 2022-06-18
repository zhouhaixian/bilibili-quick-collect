// ==UserScript==
// @name         Bilibili quick collect
// @namespace    http://tampermonkey.net/
// @version      1.4.2
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
  const toolbar = document.querySelector(
    "#arc_toolbar_report > div.toolbar-left"
  );
  toolbar.appendChild(createQuickCollectButton("单击左键收藏并点赞，单击右键仅收藏", "一键收藏并点赞"));

  function createQuickCollectButton(title: string, innerText: string) {
    async function synchronizeState() {
      const collectButton = document.querySelector(
        `#arc_toolbar_report > div.toolbar-left > span.collect`
      );
      const quickCollectButton = document.querySelector(
        `#arc_toolbar_report > div.toolbar-left > span[title=${title}]`
      );

      quickCollectButton.className = collectButton.className;
    }

    function handleClick() {
      like();
      collect();
    }

    function handleRightClick(e: MouseEvent) {
      collect();
      e.preventDefault();
    }

    const collectIcon = document
      .querySelector(
        "#arc_toolbar_report > div.toolbar-left > span.collect > svg"
      )
      .cloneNode(true);
    const quickCollect = document.createElement("span");
    quickCollect.style.width = "13rem";
    quickCollect.className = "collect";
    quickCollect.title = title;
    quickCollect.appendChild(collectIcon);
    quickCollect.innerHTML += `
      <span class="info-text">${innerText}</span>
    `;
    quickCollect.addEventListener("click", handleClick);
    quickCollect.addEventListener("contextmenu", handleRightClick);
    setInterval(synchronizeState, 200);

    return quickCollect;
  }
}

function like() {
  const likeButton = document.querySelector(
    "#arc_toolbar_report > div.toolbar-left > span.like"
  ) as HTMLElement;
  likeButton.click();
}

function collect() {
  const defaultFavoritesSelector =
    "#app > div.video-container-v1 > div.bili-dialog-m > div > div > div.content > div > ul > li > label > span.fav-title";
  const confirmButtonSelector =
    "#app > div.video-container-v1 > div.bili-dialog-m > div > div > div.bottom > button";
  const collectButton = document.querySelector(
    "#arc_toolbar_report > div.toolbar-left > span.collect"
  ) as HTMLElement;
  const dialogHandler = createDialogHandler();
  dialogHandler.hiddenDialog();
  collectButton.click();
  waitForSelector(defaultFavoritesSelector).then((el) => el.click());
  waitForAvailable(confirmButtonSelector).then((el) => el.click());
  waitForSelector(".bili-dialog-m", false).then(dialogHandler.unHideDialog);

  function createDialogHandler() {
    const styleElement = document.createElement("style");
    styleElement.innerHTML = `
      .bili-dialog-m {
        display: none;
      }
    `;

    function hiddenDialog() {
      document.body.appendChild(styleElement);
    }

    function unHideDialog() {
      document.body.removeChild(styleElement);
    }

    return {hiddenDialog, unHideDialog};
  }
}

function waitForSelector(selector: string, isExist = true) {
  return new Promise<HTMLElement>((resolve) => {
    const interval = setInterval(() => {
      const element = document.querySelector(selector);

      function detectExist() {
        return element !== null;
      }

      if (detectExist() === isExist) {
        clearInterval(interval);
        resolve(element as HTMLElement);
      }
    }, 200);
  });
}

function waitForAvailable(selector: string) {
  return new Promise<HTMLButtonElement>((resolve) => {
    const interval = setInterval(() => {
      const element = document.querySelector(selector) as HTMLButtonElement;
      if (element.disabled === false) {
        clearInterval(interval);
        resolve(element as HTMLButtonElement);
      }
    }, 200);
  });
}
