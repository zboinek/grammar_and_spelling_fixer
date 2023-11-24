document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("submitButton")
    .addEventListener("click", function () {
      const text = document.getElementById("textArea").value;
      document.getElementById("submitButton").textContent = "Fixing...";
      let responseDiv = document.getElementById("response");

      while (responseDiv.firstChild) {
        responseDiv.removeChild(responseDiv.firstChild);
      }

      console.log(text);
      fetch("https://llm.cgc.comtegra.cloud/v1/completions", {
        method: "POST",
        body: JSON.stringify({
          model: "vicuna-13B-16k",
          prompt:
            "Please correct the grammar, spelling, and punctuation in the following. Detect language and response with the same one. text:" +
            text +
            ". Fixed text:",
          // prompt:
          // "Jesteś asystentem, który pomaga rozpoznać błędy językowe, gramatyczne oraz interpunkcyjne w zadanym tekście. Nie zmieniaj słów, tylko poprawiaj literówki i wstawiaj przecinki. Pamiętaj żeby poprawnie wstawiać polskie znaki. Nie pisz nic więcej niż jest w zadanym tekście. User:" +
          // text +
          // " Assistant:",
          max_tokens: 400,
          temperature: 0,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer 789789789",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok.");
          }
          return response.json(); // Parse response body as JSON
        })
        .then((data) => {
          // Access the response body here (in 'data')
          const responseBody = data;
          console.log(responseBody); // Assuming the response is JSON, 'data' contains the parsed response body
          // document.getElementById("responseText").textContent =
          // let responseListOfStrings = JSON.stringify(
          //   responseBody.choices[0].text.split("\n")
          // );
          let responseListOfStrings = responseBody.choices[0].text.split("\n");

          for (let i = 0; i < responseListOfStrings.length; i++) {
            let paragraph = document.createElement("p");
            paragraph.textContent = responseListOfStrings[i];
            responseDiv.appendChild(paragraph);
          }
          document.getElementById("submitButton").textContent = "Fix";
          // Update the 'responseText' paragraph with the API response body
        })
        .catch((error) => {
          console.error(
            "There has been a problem with your fetch operation:",
            error
          );
        });
    });

  // Other parts of your code...

  // Get selected text when popup opens automatically
  chrome.storage.local.get(["selectedText"], function (result) {
    const selectedText = result.selectedText || "";
    document.getElementById("textArea").value = selectedText;
  });

  // Listen for messages from the background script
  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    if (request.action === "getSelectedText") {
      const selectedText = request.selectedText;
      document.getElementById("textArea").value = selectedText;
    }
  });
});
