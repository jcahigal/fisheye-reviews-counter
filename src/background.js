"use strict";

const defaultThreshold = 4;
chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.sync.set({ reviewsThreshold: defaultThreshold });
});
