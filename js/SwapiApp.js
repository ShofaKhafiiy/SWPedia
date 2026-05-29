import SwapiService from "./services/SwapiService.js";
import UiManager from "./ui/UiManager.js";

export default class SwapiApp {
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
