// import {
//   getAuth,
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
// } from "firebase/auth";

// import * as firestoreApp from "firebase/app";
// import * as firestoreAuth from "firebase/auth";

import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore/lite";
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
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Get a list of cities from your database

// async function getCities(db) {
//   const citiesCol = collection(db, "cities");
//   console.log("11111111111111111", db);
//   console.log("11111111111111111", citiesCol);
//   try {
//     const citySnapshot = await getDocs(citiesCol);
//     console.log("222222222222222", citySnapshot);
//   } catch (error) {
//     console.log("error: ", error);
//   }
//   // const citySnapshot = await getDocs(citiesCol);
//   // console.log("222222222222222", citySnapshot);
//   // const cityList = citySnapshot.docs.map((doc) => doc.data());
//   // return cityList;
// }

// async function fire() {
//   const app = await firestoreApp.initializeApp(firebaseConfig);
//   // const db = await getFirestore(app);
//   console.log(firestoreAuth);
//   return app;
// }
// // console.log(fire().then(r => { }));
// fire().then((r) => {
//   console.log(r._options, "nnnnnnnnnnnnnnnnnnn");
// });

const email = "usanka1980@gmail.com";
const password = 12345678;

const auth = getAuth();
console.log(auth);
createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in
    const user = userCredential.user;
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    alert(errorMessage);
    // ..
  });
signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in
    const user = userCredential.user;
    console.log(user);
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
  });
// =================================================================
const firebase = new NewFirebase();
// console.log(firebase.getUser);
// firebase.getUser().then((v) => console.log(v));
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
  const request = {
    text: userValue,
    date: new Date().toJSON(),
  };
  try {
    const fire = await firebase.postRequest(request);
    console.log(fire.data);
  } catch (error) {
    console.error(error);
  }
  try {
    const fire = await firebase.getRequest();
    const requestKey = Object.keys(fire.data);
    const requestData = requestKey.map((v) => {
      return fire.data[v];
    });
    console.log(requestData);
  } catch (error) {
    console.error(error);
  }
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
