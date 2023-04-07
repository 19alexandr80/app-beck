import axios from "axios";

const firebaseApp = "https://app-back-bb275-default-rtdb.firebaseio.com/";

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

export class NewFirebase {
  constructor() {
    const firebaseApp = "https://app-back-bb275-default-rtdb.firebaseio.com/";
  }
  async getUser() {
    try {
      const response = await axios.post(`${this.firebaseApp}bbbbbbb`, {
        firstName: "Fred",
        lastName: "Flintstone",
      });

      return response;
    } catch (error) {
      console.error(error);
    }
  }
}
