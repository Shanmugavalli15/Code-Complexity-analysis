const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
const GEMINI_API_KEY = "AIzaSyDrPWm920TO91DLYR4KVYAhr4QSnhq2rAo"; // Replace with your API key

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "analyzeCode") {
    const code = request.code;

    const payload = {
      contents: [
        {
          parts: [
            {
              text: `Analyze the time complexity of the following code and provide only the Big-O notation (e.g., O(n), O(n^2)):\n\n${code}`
            }
          ]
        }
      ]
    };

    fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
      .then(response => response.json())
      .then(data => {
        const analysis = data.candidates[0].content.parts[0].text;
        sendResponse({ success: true, complexity: analysis });
      })
      .catch(error => {
        console.error("Error analyzing code:", error);
        sendResponse({ success: false, error: error.message });
      });

    return true; // Indicates async response
  }
});