import axios from "axios";

// const firebaseApp = "https://app-back-bb275-default-rtdb.firebaseio.com/";

export class NewApi {
  constructor() {
    this.input = "";
    this.page = 1;
    this.amountOfElements = 40;
    this.totalHits = null;
  }
  async getUser() {
    try {
      const response = await axios.get(
        `https://pixabay.com/api/?key=34606979-50f381d93fa3ea4666c32e671&q=${this.input}&page=${this.page}&per_page=${this.amountOfElements}&image_type=photo&orientation=horizontal&safesearch=true`
      );
      this.setPage();
      this.totalHits = response.data.totalHits;
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
  setInput(data) {
    this.input = data;
  }
  setPage() {
    this.page += 1;
  }
  resetPege() {
    this.page = 1;
  }
  getAmountOfElements() {
    return this.amountOfElements;
  }
}

// ===============================================================

export class NewFirebase {
  constructor() {
    this.firebaseApp = "https://app-back-bb275-default-rtdb.firebaseio.com/";
  }
  async postRequest(request, r = null, email) {
    try {
      const nikEmail = email.substring(0, email.indexOf("."));
      const response = await axios.post(
        `${this.firebaseApp}box/${nikEmail}.json?auth=${r}`,
        request
      );

      return response;
    } catch (error) {
      console.error("errrrrror", error);
      // alert(error.message);
    }
  }
  async getRequest(r = null, email) {
    try {
      const nikEmail = email.substring(0, email.indexOf("."));
      const respon = await axios.get(
        `${this.firebaseApp}box/${nikEmail}.json?auth=${r}`
      );
      return respon;
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }
  async deleteRequest(r = null, id, email) {
    try {
      const nikEmail = email.substring(0, email.indexOf("."));
      const response = await axios.delete(
        `${this.firebaseApp}box/${nikEmail}/${id}.json?auth=${r}`
      );

      return response;
    } catch (error) {
      console.error("error-deleteRequest", error);
    }
  }
}
// ================================
