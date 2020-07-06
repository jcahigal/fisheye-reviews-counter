"use strict";

function constructOptions() {
  chrome.storage.sync.get("reviewsThreshold", function (data) {
    if (data != undefined && data.reviewsThreshold != undefined) {
      document.getElementById("threshold").value = data.reviewsThreshold;
    }
  });

  document.getElementById("threshold").addEventListener("input", function (event) {
    chrome.storage.sync.set({ reviewsThreshold: event.srcElement.value }, function () {
      console.info("reviewsThreshold set to " + event.srcElement.value);
    });
  });
}

constructOptions();
