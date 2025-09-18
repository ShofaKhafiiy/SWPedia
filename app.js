const characterSelect = document.getElementById("characterSelect");
const resultContainer = document.getElementById("resultContainer");

/* class SwapiService
Bertugas untuk menghandle atau berkomunikasi dengan API
*/

class SwapiService {
  constructor() {
    this.baseUrl = "https://swapi.tech/api/";
  }

  async fetchAllCharacters() {
    let allCharacter = [];
    let nextUrl = `${this.baseUrl}people/`;

    while (nextUrl) {
      const response = await fetch(nextUrl);
      if (!response.ok) throw new Error("Gagal mengambil daftar karakter");
      const data = await response.json();
      allCharacter = allCharacter.concat(data.results);
      nextUrl = data.next;
    }

    console.log(allCharacter);
    return allCharacter;
  }

  async fetchDetailCharacter(urlCharacter) {
    const response = await fetch(urlCharacter);
    if (!response.ok) throw new Error("Gagal mengambil detail karakter");
    const data = await response.json();
    return data.result.properties;
  }

  async fetchMovieTitles(movieUrls) {
    if (!movieUrls || movieUrls.length === 0) return [];

    const filmUrls = movieUrls.map((url) =>
      fetch(url).then((res) => res.json())
    );

    const filmDataResult = await Promise.all(filmUrls);
    return filmDataResult.map((data) => data.result.properties.title);
  }
}

/* Class UiManager
Untuk Memanipulasi DOM
*/

class UiManager {
  constructor() {
    this.characterSelect = document.getElementById("characterSelect");
    this.resultContainer = document.getElementById("resultContainer");
  }

  showLoading(message) {
    this.resultContainer.innerHTML = `    <div class="flex flex-col items-center gap-4">
                        <div class="loader"></div>
                        <p class="text-gray-400">${message}</p>
                    </div>`;
  }

  showInitialMessage() {
    this.resultContainer.innerHTML = `<p class = "text-gray-500">Pilih seorang karakter dari arsip untuk memulai.</p>`;
  }

  showError(message) {
    this.resultContainer.innerHTML = `<p class = "text-red-500">${message}</p>`;
  }

  populateCharacterSelect(characters) {
    this.characterSelect.innerHTML =
      '<option value="">-- Pilih seorang karakter --</option>';
    characters
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach((char) => {
        const option = document.createElement("option");
        option.value = char.url;
        option.textContent = char.name;
        this.characterSelect.appendChild(option);
      });
  }

  displayCharacterDetails(character, filmTitles) {
    const characterImage = `https://placehold.co/400x500/1F2937/FBBF24?text=${encodeURIComponent(
      character.name
    )}`;

    const filmsHtml =
      filmTitles.length > 0
        ? `<div class="mt-6">
      <h3 class="text-xl font-semibold text-yellow-400 mb-2">Penampilan di Film</h3>
      <ul class="list-disc list-inside text-gray-300 space-y-1">${filmTitles
        .map((title) => `<li>${title}</li>`)
        .join("")}</ul></div>`
        : "";

    const detailsHtml = `
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full">
                        <div class="md:col-span-1">
                            <img src="${characterImage}" alt="Potret ${character.name}" class="rounded-lg shadow-lg w-full h-auto object-cover">
                        </div>
                        <div class="md:col-span-2">
                            <h2 class="text-3xl font-bold text-yellow-400 border-b-2 border-gray-700 pb-2 mb-4">${character.name}</h2>
                            <div class="grid grid-cols-2 gap-4 text-base">
                                <div><strong class="text-gray-400">Tinggi:</strong> ${character.height} cm</div>
                                <div><strong class="text-gray-400">Berat:</strong> ${character.mass} kg</div>
                                <div><strong class="text-gray-400">Rambut:</strong> ${character.hair_color}</div>
                                <div><strong class="text-gray-400">Kulit:</strong> ${character.skin_color}</div>
                                <div><strong class="text-gray-400">Mata:</strong> ${character.eye_color}</div>
                                <div><strong class="text-gray-400">Lahir:</strong> ${character.birth_year}</div>
                            </div>
                            ${filmsHtml}
                        </div>
                    </div>`;
    this.resultContainer.innerHTML = detailsHtml;
  }
}

/* 
Class swapiapp mengatur alur kerja aplikasi

*/

class SwapiApp {
  constructor() {
    this.swapiService = new SwapiService();
    this.uiManager = new UiManager();
  }

  async init() {
    try {
      const characters = await this.swapiService.fetchAllCharacters();
      this.uiManager.populateCharacterSelect(characters);

      this.uiManager.characterSelect.addEventListener(
        "change",
        this.handleCharacterSelect.bind(this)
      );
    } catch (error) {
      console.error("Initialization Error:", error);
      this.uiManager.showError("Gagal memuat daftar karakter dari arsip.");
    }
  }

  async handleCharacterSelect(event) {
    const chacarterId = event.target.value;
    if (!chacarterId) {
      this.uiManager.showInitialMessage();
      return;
    }

    this.uiManager.showLoading("Mengakses server...");

    try {
      const character = await this.swapiService.fetchDetailCharacter(
        chacarterId
      );
      const filmTitles = await this.swapiService.fetchMovieTitles(
        character.films
      );

      this.uiManager.displayCharacterDetails(character, filmTitles);
    } catch (err) {
      console.error("Display Error:", err);
      this.uiManager.showError(
        "Gagal mengambil data dari arsip. Mungkin ada gangguan pada Force."
      );
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const app = new SwapiApp();
  app.init();
});
