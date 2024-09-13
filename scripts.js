document
  .querySelector(".inputAndButton")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const word = document
      .querySelector("#wordInput")
      .value.trim()
      .toLowerCase();

    if (!word) {
      alert("Please enter a word");
      return;
    }

    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

    try {
      const response = await fetch(url);

      if (response.status === 404) {
        alert("Word not found");
        return;
      }

      const data = await response.json();

      if (!data || data.title === "No Definitions Found") {
        alert("No definitions found for this word.");
        return;
      }

      const wordData = data[0];
      const wordDetailsDiv = document.querySelector(".wordDetails");
      wordDetailsDiv.classList.add('extraPadding')

      // Clear previous results
      wordDetailsDiv.innerHTML = "";

      // Insert new word details
      wordDetailsDiv.innerHTML = `
          <h2 class="word">WORD: <span class ="highlightWord">${wordData.word}</span></h2>
          <span class="partOfSpeech">${wordData.meanings[0].partOfSpeech}</span>
          <p><b>MEANING</b>: ${
            wordData.meanings[0].definitions[0].definition
          }</p>
          <p><b>EXAMPLE USAGE</b>: ${
            wordData.meanings[0].definitions[0].example ||
            "No example available"
          }</p>
          <p class="Antonyms">
              <b>Antonyms</b>:- 
              <ol class = "antonymsList">
                  ${
                    wordData.meanings[0].definitions[0].antonyms.length > 0
                      ? wordData.meanings[0].definitions[0].antonyms
                          .map((antonym) => `<li>${antonym}</li>`)
                          .join("")
                      : "<li>No antonyms available</li>"
                  }
              </ol>
          </p>
          <button id="readMoreButton" class="readMore">Read More on Wiki</button>
      `;

      // Set up the "Read More" button to redirect to Wikipedia
      const readMoreButton = document.querySelector("#readMoreButton");
      readMoreButton.onclick = function () {
        window.open(`https://en.wikipedia.org/wiki/${wordData.word}`, "_blank");
      };
    } catch (error) {
      console.error(error);
      alert("An error occurred while fetching the data.");
    }
  });
