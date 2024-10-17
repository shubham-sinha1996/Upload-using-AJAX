class Http {
  constructor(uri) {
    this.uri = uri;
    this.xhr = new XMLHttpRequest();
  }
  static serialize(obj) {
    let qs = [];
    for (let prop in obj) {
      qs = [
        ...qs,
        `${encodeURIComponent(prop)}=${encodeURIComponent(obj[prop])}`,
      ];
    }
    return qs.join("&");
  }
  get(path = "", qs) {
    return new Promise((resolve, reject) => {
      this.xhr.open("GET", `${this.uri}${path}/?${Http.serialize(qs)}`, true);
      this.xhr.addEventListener("load", function () {
        resolve({ status: this.statusText, response: this.response });
      });
      this.xhr.addEventListener("error", (error) => reject(error));
      this.xhr.send();
    });
  }

  upload(path = "", file, onProgress) {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      let data = new FormData();
      data.append("file", file);
      xhr.upload.addEventListener("progress", onProgress);
      xhr.upload.addEventListener("load", () => resolve());
      xhr.addEventListener("error", () => reject());
      xhr.open("POST", `${this.uri}${path}`, true);
      xhr.send(data);
    });
  }
}

export default Http;
