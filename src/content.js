"use strict";

const getReviewCounterClass = (reviewsThreshold, reviewsCount) => {
  if (reviewsCount >= reviewsThreshold) {
    return "aui-badge review-activity--badge__unresolved";
  }
  return "aui-badge review-activity--badge__resolved";
};

const setReviewsHTML = (reviewsThreshold, reviewsCount, container) => {
  const counterHtml =
    '<span class="review-activity--badge-holder"> <span class="' +
    getReviewCounterClass(reviewsThreshold, reviewsCount) +
    '">' +
    reviewsCount.toString() +
    "</span></span>";
  container.innerHTML = container.innerHTML + counterHtml;
};

const currentUrl = location.protocol + "//" + location.hostname + (location.port ? ":" + location.port : "");
const cruciblePath = "/rest-service/reviews-v1/filter/details?states=Review&complete=false&reviewer=";
const setReviews = (reviewerBody, reviewsThreshold) => {
  const userId = getUserId(reviewerBody.querySelector("span.aui-avatar-inner > img").src);
  let x = new XMLHttpRequest();
  x.open("GET", currentUrl + cruciblePath + userId);
  x.setRequestHeader("Accept", "application/json");
  x.onload = function () {
    const response = JSON.parse(x.responseText);
    const currentReviews = response["detailedReviewData"].length.toString();
    setReviewsHTML(reviewsThreshold, currentReviews, reviewerBody.querySelector("div"));
  };
  x.send();
};

const defaultThreshold = 4;
const markClass = "rew-cru-processed";
const handleMutation = async (mutations, observer) => {
  const editReviewContainer = document.querySelector("#s2id_add-reviewer-input");
  if (editReviewContainer) {
    const reviewers = Array.from(
      editReviewContainer.querySelectorAll("li.select2-search-choice:not(." + markClass + ")")
    );

    // each change is a different muttation
    if (reviewers.length > 0) {
      reviewers[0].classList.add(markClass);
      chrome.storage.sync.get("reviewsThreshold", function (data) {
        let reviewsThreshold;
        if (data && data.reviewsThreshold) {
          reviewsThreshold = data.reviewsThreshold;
        } else {
          reviewsThreshold = defaultThreshold;
        }
        setReviews(reviewers[0], reviewsThreshold);
      });
    }
  }
};

const userIdPrefixPath = "avatar/";
const getUserId = (src) => {
  const start = src.indexOf(userIdPrefixPath) + userIdPrefixPath.length;
  const end = src.indexOf("?");
  if (end == -1) {
    end = src.length;
  }
  return src.substring(start, end);
};

const target = document.getElementById("reviewpage");
const observer = new MutationObserver(handleMutation);
observer.observe(target, {
  subtree: true,
  childList: true,
  subtree: true,
});
