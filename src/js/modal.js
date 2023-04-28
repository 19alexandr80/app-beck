import { createUserWithEmailAndPassword } from "firebase/auth";
import { authHtml } from "../index";
const modalBox = document.querySelector(".modalWindow");
let auth = null;

export function modalAuth(a) {
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
    <input
      type="password"
      name="passwordConfirmation"
      placeholder="password"
    />
    <button type="submit">Registration</button>
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
  const passwordConfirmation =
    e.currentTarget.elements.passwordConfirmation.value;
  if (password && password === passwordConfirmation) {
    console.log(email, password);
    modalBox.innerHTML = "";
    try {
      const fire = await createUserWithEmailAndPassword(auth, email, password);
      localStorage.setItem("tokenResponse", fire._tokenResponse.idToken);
      localStorage.setItem("email", email);
      authHtml();
    } catch (error) {
      console.error("jjjjjjjj-error", error);
      const errorMessage = error.message;
      alert(errorMessage);
    }
  } else {
    alert("Check the password");
  }
}
