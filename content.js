function extractCode() {
    const codeElements = document.querySelectorAll("pre, code");
    if (codeElements.length > 0) {
      return Array.from(codeElements).map(el => el.innerText).join("\n");
    }
    return null;
  }
  
  function analyzeCode() {
    const code = extractCode();
    if (code) {
      chrome.runtime.sendMessage(
        { action: "analyzeCode", code: code },
        (response) => {
          if (response && response.success) {
            // Send the result to the popup
            chrome.runtime.sendMessage({
              action: "displayResult",
              complexity: response.complexity
            });
          } else {
            console.error("Error analyzing code:", response.error);
          }
        }
      );
    } else {
      console.error("No code found on the page.");
    }
  }
  
  // Run analysis when the extension is activated
  analyzeCode();