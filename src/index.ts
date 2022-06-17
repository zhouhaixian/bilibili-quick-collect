// ==UserScript==
// @name         Bilibili quick collect
// @namespace    http://tampermonkey.net/
// @version      1.0.7
// @description  哔哩哔哩一键点赞并收藏
// @author       Zhou Haixian
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=typescriptlang.org
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  setTimeout(() => {
    const toolbar = document.querySelector(
      "#arc_toolbar_report > div.toolbar-left"
    );

    const collectIcon = `<svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg" class="icon" style="fill:;">
      <path 
        fill-rule="evenodd" 
        clip-rule="evenodd" 
        d="M19.8071 9.26152C18.7438 9.09915 17.7624 8.36846 17.3534 7.39421L15.4723 3.4972C14.8998 2.1982 13.1004 2.1982 12.4461 3.4972L10.6468 7.39421C10.1561 8.36846 9.25639 9.09915 8.19315 9.26152L3.94016 9.91102C2.63155 10.0734 2.05904 11.6972 3.04049 12.6714L6.23023 15.9189C6.96632 16.6496 7.29348 17.705 7.1299 18.7605L6.39381 23.307C6.14844 24.6872 7.62063 25.6614 8.84745 25.0119L12.4461 23.0634C13.4276 22.4951 14.6544 22.4951 15.6359 23.0634L19.2345 25.0119C20.4614 25.6614 21.8518 24.6872 21.6882 23.307L20.8703 18.7605C20.7051 17.705 21.0339 16.6496 21.77 15.9189L24.9597 12.6714C25.9412 11.6972 25.3687 10.0734 24.06 9.91102L19.8071 9.26152Z"
      >
      </path>
    </svg>`;

    const quickCollect = document.createElement("span");
    quickCollect.style.width = "13rem"
    quickCollect.className = "collect";
    quickCollect.title = "一键点赞并收藏";
    quickCollect.innerHTML = `
      ${collectIcon}
      <span class="info-text">一键点赞并收藏</span>
    `;
    quickCollect.addEventListener("click", () => {
      const likeButton = document.querySelector(
        "#arc_toolbar_report > div.toolbar-left > span.like"
      ) as HTMLElement;
      likeButton.click();

      const collectButton = document.querySelector(
        "#arc_toolbar_report > div.toolbar-left > span.collect"
      ) as HTMLElement;
      collectButton.click();

      setTimeout((_: any) => {
        const defaultFavorites = document.querySelector(
          "#app > div.video-container-v1 > div.bili-dialog-m > div > div > div.content > div > ul > li > label > span.fav-title"
        ) as HTMLElement;
        defaultFavorites.click();
      }, 450);

      setTimeout((_: any) => {
        const confirmButton = document.querySelector(
          "#app > div.video-container-v1 > div.bili-dialog-m > div > div > div.bottom > button"
        ) as HTMLElement;
        confirmButton.click();
      }, 550);

      const quickCollectElement = document.querySelector(
        "#arc_toolbar_report > div.toolbar-left > span[title='一键点赞并收藏']"
      );
      if (quickCollectElement.className.search(" on") === -1) {
        quickCollectElement.className += " on";
      } else {
        quickCollectElement.className = quickCollectElement.className.replace(
          " on",
          ""
        );
      }
    });

    toolbar.appendChild(quickCollect);
  }, 5000);
})();