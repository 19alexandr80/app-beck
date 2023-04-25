import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import "./sass/index.scss";
import Notiflix from "notiflix";
import { NewApi, NewFirebase } from "./js/api.js";
import SimpleLightbox from "simplelightbox";

const firebaseConfig = {
  apiKey: "AIzaSyCBtpyq_JcjZVrgTcRGIRZbPiF1YdsGPM0",
  authDomain: "app-back-bb275.firebaseapp.com",
  databaseURL: "https://app-back-bb275-default-rtdb.firebaseio.com",
  projectId: "app-back-bb275",
  storageBucket: "app-back-bb275.appspot.com",
  messagingSenderId: "342626939408",
  appId: "1:342626939408:web:b6d958ff5664c393491095",
};
initializeApp(firebaseConfig);
const firebase = new NewFirebase();
const signInButton = document.querySelector(".sign-in-button");
const authButton = document.querySelector(".auth-button");
const authZone = document.querySelector(".auth-zone");

const email = "usanka80@gmail.com";
const password = 12345678;

authHtml();

const auth = getAuth();

// Listener auth ==============================================

signInButton.addEventListener("click", async () => {
  try {
    const fire = await signInWithEmailAndPassword(auth, email, password);
    localStorage.setItem(email, fire._tokenResponse.idToken);
    authHtml();
  } catch (error) {
    console.error("fire.data-error", error);
  }
});

// Document auth ==========================================================

async function authHtml() {
  authZone.querySelector(".auth-ul-zone").innerHTML = "";
  if (localStorage.getItem(email)) {
    try {
      const fire = await firebase.getRequest();
      if (fire.data) {
        const requestKey = Object.keys(fire.data);
        const requestData = requestKey
          .map((v) => {
            const reque = fire.data[v];
            reque.id = v;

            return `<li>Вапрос: ${reque.text} от: ${reque.date}
            <button type="button" data-id="${v}">delete</button></li>`;
          })
          .join("");
        authZone.querySelector(".auth-ul-zone").innerHTML = requestData;
        authZone
          .querySelector(".auth-ul-zone")
          .addEventListener("click", onDelete);
      }
    } catch (error) {
      console.error(error);
    }
  }
}

async function onDelete(ev) {
  try {
    const fire = await firebase.deleteRequest(
      localStorage.getItem(email),
      ev.target.dataset.id
    );
  } catch (error) {
    console.error("fire.data-error", error);
  }
  authHtml();
}
// AYTH =====================================================================

authButton.addEventListener("click", onAuth);

async function onAuth() {
  try {
    const fir = await createUserWithEmailAndPassword(auth, email, password);
    // console.log("fiiiiir", fir);
  } catch (error) {
    console.error("jjjjjjjj-error", error);
    const errorMessage = error.message;
    alert(errorMessage);
  }
}

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
    try {
      const data = await aapi.getUser();
      infiniteScroll(data);
    } catch (error) {
      console.error(error);
    }
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
  const request = {
    text: userValue,
    date: new Date().toJSON(),
  };
  try {
    const fire = await firebase.postRequest(
      request,
      localStorage.getItem(email)
    );
  } catch (error) {
    console.error("fire.data-error", error);
  }
  // ================================
  authHtml();
  // ================================
  try {
    const data = await aapi.getUser();
    submitProcessing(data);
  } catch (error) {
    console.error(error);
  }
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
