// Write your code here...
import Http from "./Http";
const filesListContainer = document.querySelector(".filesList > table > tbody");
const progressBar = document.querySelector("#uploadProgress");
const fileInput = document.querySelector("input[name=fileToUpload]");
const uploadBtn = document.querySelector("#uploadFileBtn");
const http = new Http("http://localhost:8080/api");

const Row = (filename, size) => `<tr>
  <td>${filename}</td>
  <td>${size}Kb</td>
</tr>`;

const render = async function () {
  try {
    const { response } = await http.get("/list");
    const list = JSON.parse(response).map((elem) => Row(elem.file, elem.size));
    filesListContainer.innerHTML = list.join("");
  } catch {
    alert("There was an error fetching files");
  }
};
render();

uploadBtn.addEventListener("click", async function (e) {
  e.preventDefault();
  let fileToUpload = fileInput.files;
  if (fileToUpload.length !== 0) {
    try {
      await http.upload("/upload", fileToUpload[0], (progress) => {
        if (progress.lengthComputable) {
          progressBar.value = (progress.loaded / progress.total) * 100;
        }
      });
    } catch {
      alert("There was error uploading files");
    } finally {
      progressBar.value = 0;
      fileInput.value = "";
      render();
    }
  }
});
