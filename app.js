const characterSelect = document.getElementById("characterSelect");
const resultContainer = document.getElementById("resultContainer");

/* 
Menggambil semua karakter dari API
*/

async function fetchAllCharacter() {
  let allCharacters = [];
  let nextUrl = "https://swapi.tech/api/people/";

  while (nextUrl) {
    const response = await fetch(nextUrl);
    const data = await response.json();
    allCharacters = allCharacters.concat(data.results);
    console.log(allCharacters);
    nextUrl = data.next;
  }

  return allCharacters;
}

/* inisialisasi mengisi dropdown dengan daftar karakter */

async function initializeApp() {
  try {
    const characters = await fetchAllCharacter();
    characters.sort((a, b) => a.name.localeCompare(b.name));

    characterSelect.innerHTML = `<option value="">-- Pilih Karakter --</option>`;

    characters.forEach((char) => {
      const option = document.createElement("option");

      option.value = char.uid;
      option.textContent = char.name;
      characterSelect.appendChild(option);
    });
  } catch (err) {
    characterSelect.innerHTML = `<option>Gagal memuat karakter</option>`;
    console.error("initialization Error", err);
  }
}

//menampilkan detail karakter di resultContainer

async function displayCharacterDetails(characterId) {
  if (!characterId) {
    resultContainer.innerHTML = `<p class="text-gray-500">Pilih seorang karakter untuk memulai.</option>`;
    return;
  }

  //menampilkan status loading
  resultContainer.innerHTML = `<div class= "flex flex-col items-center gap-4">
      <div class="loader"></div>
      <p class = "text-gray-400">Mengakses karakter...</p>
  </div>
  `;

  try {
    /*   mengambil detail karakter yang dipilih kemudian di tampilkan di result continer */
    const characterResponse = await fetch(
      `https://swapi.tech/api/people/${characterId}/`
    );

    if (!characterResponse.ok) {
      throw new Error("Karakter tidak ditemukan.");
    }
    const characterData = await characterResponse.json();
    const character = characterData.result.properties;

    //mengambil detail semua film secara bersamaan
    const filmPromise = character.films.map((filmUrl) =>
      fetch(filmUrl).then((res) => res.json())
    );

    const filmDataResult = await Promise.all(filmPromise);
    const filmTitles = filmDataResult.map(
      (filmData) => filmData.result.properties.title
    );

    //membuat HTML untuk ditampilkan
    const characterImage = `https://placehold.co/400x500/1F2937/FBBF24?text=${encodeURIComponent(
      character.name
    )}`;

    const detailsHtml = `
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full">
                        <!-- Kolom Gambar -->
                        <div class="md:col-span-1">
                            <img src="${characterImage}" alt="Potret ${
      character.name
    }" class="rounded-lg shadow-lg w-full h-auto object-cover">
                        </div>

                        <!-- Kolom Detail -->
                        <div class="md:col-span-2">
                            <h2 class="text-3xl font-bold text-yellow-400 border-b-2 border-gray-700 pb-2 mb-4">${
                              character.name
                            }</h2>
                            <div class="grid grid-cols-2 gap-4 text-base">
                                <div><strong class="text-gray-400">Tinggi:</strong> ${
                                  character.height
                                } cm</div>
                                <div><strong class="text-gray-400">Berat:</strong> ${
                                  character.mass
                                } kg</div>
                                <div><strong class="text-gray-400">Warna Rambut:</strong> ${
                                  character.hair_color
                                }</div>
                                <div><strong class="text-gray-400">Warna Kulit:</strong> ${
                                  character.skin_color
                                }</div>
                                <div><strong class="text-gray-400">Warna Mata:</strong> ${
                                  character.eye_color
                                }</div>
                                <div><strong class="text-gray-400">Tahun Lahir:</strong> ${
                                  character.birth_year
                                }</div>
                            </div>

                            <!-- Daftar Film -->
                            <div class="mt-6">
                                <h3 class="text-xl font-semibold text-yellow-400 mb-2">Penampilan di Film</h3>
                                <ul class="list-disc list-inside text-gray-300 space-y-1">
                                    ${filmTitles
                                      .map((title) => `<li>${title}</li>`)
                                      .join("")}
                                </ul>
                            </div>
                        </div>
                    </div>
                `;

    resultContainer.innerHTML = detailsHtml;
  } catch (err) {
    console.error("Display Error:", err);
    resultContainer.innerHTML = `<p class="text-red-400">Gagal mengambil data dari arsip. Mungkin ada gangguan pada Force. (${err.message})</p>`;
  }
}

//menambahkan event Listener ke dropdown

characterSelect.addEventListener("change", (e) => {
  displayCharacterDetails(e.target.value);
  console.log(e.target.value);
});

initializeApp();
