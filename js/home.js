/* =========================
   Homepage carousel
   Controls the Popular Pendants slider
   ========================= */

function setupHomepageCarousel() {
  var track = document.getElementById("popular-products-track");
  var prevButton = document.getElementById("popular-prev-btn");
  var nextButton = document.getElementById("popular-next-btn");

  if (track === null || prevButton === null || nextButton === null) {
    return;
  }

  nextButton.onclick = function () {
    track.scrollBy({
      left: track.clientWidth,
      behavior: "smooth"
    });
  };

  prevButton.onclick = function () {
    track.scrollBy({
      left: -track.clientWidth,
      behavior: "smooth"
    });
  };
}