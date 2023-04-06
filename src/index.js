import "./sass/index.scss";
import Notiflix from "notiflix";
import { NewApi } from "./js/api.js";
import SimpleLightbox from "simplelightbox";
let loadedElement = 0;
let lastEl = null;
const galleryEl = document.querySelector(".gallery");
const form = document.querySelector("form");
form.addEventListener("submit", onsubmit);
const aapi = new NewApi();
const lightbox = new SimpleLightbox(".gallery a", {
  captionsData: "alt",
  captionDelay: 250,
});
const options = {
  root: null,
  rootMargin: "5px",
  threshold: 0.5,
};
const observer = new IntersectionObserver(observerCallback, options);
async function observerCallback(entries, observer) {
  if (entries[0].isIntersecting) {
    observer.unobserve(lastEl);
    if (loadedElement > aapi.totalHits) {
      if (aapi.totalHits < 7) {
        return;
      }
      Notiflix.Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );
      return;
    }
    // ==================================
    try {
      const data = await aapi.getUser();
      infiniteScroll(data);
    } catch (error) {
      console.error(error);
    }
    // ===================================
  }
}
async function onsubmit(e) {
  e.preventDefault();
  loadedElement = aapi.amountOfElements;
  lastEl = null;
  const userValue = e.currentTarget.elements.searchQuery.value.trim();
  if (!userValue) {
    Notiflix.Notify.warning(
      "Sorry, there are no images matching your search query. Please try again."
    );
    galleryEl.innerHTML = "";
    return;
  }
  aapi.setInput(userValue);
  aapi.resetPege();
  galleryEl.innerHTML = "";
  // =======================================
  try {
    const data = await aapi.getUser();
    submitProcessing(data);
  } catch (error) {
    console.error(error);
  }
  // ========================================
  // const data = await aapi.getUser();
  // submitProcessing(data);
  // ========================================
}
function submitProcessing({ hits, totalHits }) {
  if (hits.length === 0) {
    Notiflix.Notify.warning(
      "Sorry, there are no images matching your search query. Please try again."
    );
    return;
  }
  Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
  criet(hits);
  window.scrollBy({
    top: 52,
    behavior: "smooth",
  });
}
function criet(params) {
  const htmlCard = params
    .map(
      ({
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
        largeImageURL,
      }) => {
        return `<div class='gallery__item'>
    <a class='gallery__link' href='${largeImageURL}'>
      <img class='gallery__image' src='${webformatURL}' alt='${tags}' loading="lazy"/>
    </a>
    <div class="info">
      <p class="info-item">Likes <br/><b>${likes}</b></p>
      <p class="info-item">Views <br/><b>${views}</b></p>
      <p class="info-item">Comments <br/><b>${comments}</b></p>
      <p class="info-item">Downloads <br/><b>${downloads}</b></p>
    </div>
  </div>`;
      }
    )
    .join("");
  galleryEl.insertAdjacentHTML("beforeEnd", htmlCard);
  lightbox.refresh();
  lastEl = galleryEl.lastChild;
  observer.observe(lastEl);
}
function infiniteScroll({ hits }) {
  criet(hits);
  loadedElement = aapi.getAmountOfElements() * (aapi.page - 1);
}
