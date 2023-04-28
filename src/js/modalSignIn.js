import { signInWithEmailAndPassword } from "firebase/auth";
import { authHtml } from "../index";

const modalBox = document.querySelector(".modalWindow");
let auth = null;

export function modalSignIn(a) {
  auth = a;
  const formHtml = `
    <div class="modal-bakc">
    <form class="modal-form" id="modal-form">
    <input
      type="email"
      name="email"
      placeholder="email"
    />
    <input
      type="password"
      name="password"
      placeholder="password"
    />
    <button type="submit">Sign in</button>
  </form>
  </div>`;
  modalBox.innerHTML = formHtml;
  const modalForm = modalBox.querySelector(".modal-form");
  modalForm.addEventListener("submit", onDataForm);
}

async function onDataForm(e) {
  e.preventDefault();
  const email = e.currentTarget.elements.email.value;
  const password = e.currentTarget.elements.password.value;
  try {
    const fire = await signInWithEmailAndPassword(auth, email, password);

    localStorage.setItem("tokenResponse", fire._tokenResponse.idToken);
    localStorage.setItem("email", email);
    modalBox.innerHTML = "";
    authHtml();
  } catch (error) {
    console.error("fire.data-error", error);
    alert(error.message);
  }
}
