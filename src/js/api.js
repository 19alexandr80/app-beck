import axios from 'axios';
export class NewApi {
  constructor() {
    this.input = '';
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
