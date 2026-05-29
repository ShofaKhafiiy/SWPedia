export default class SwapiService {
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
