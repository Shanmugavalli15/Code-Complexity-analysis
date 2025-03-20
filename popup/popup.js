document.addEventListener("DOMContentLoaded", () => {
    const resultDiv = document.getElementById("result");
    const reanalyzeButton = document.getElementById("reanalyze");
    const ctx = document.getElementById("complexityChart").getContext("2d");
  
    let complexityChart;
  
    // Function to analyze code
    function analyzeCode() {
      resultDiv.innerText = "Analyzing Code Complexity...";
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          files: ["content.js"]
        });
      });
    }
  
    // Listen for results from the background script
    chrome.runtime.onMessage.addListener((message) => {
      if (message.action === "displayResult") {
        const complexity = message.complexity;
        resultDiv.innerText = `Time Complexity: ${complexity}`;
  
        // Update the chart
        updateChart(complexity);
      }
    });
  
    // Function to update the chart
    function updateChart(complexity) {
      const labels = ["1", "2", "3", "4", "5"]; // Input sizes
      let dataPoints;
  
      // Define data points based on the complexity
      switch (complexity) {
        case "O(1)":
          dataPoints = [1, 1, 1, 1, 1]; // Constant
          break;
        case "O(n)":
          dataPoints = [1, 2, 3, 4, 5]; // Linear
          break;
        case "O(n^2)":
          dataPoints = [1, 4, 9, 16, 25]; // Quadratic
          break;
        case "O(log n)":
          dataPoints = [0, 1, 1.58, 2, 2.32]; // Logarithmic
          break;
        case "O(n log n)":
          dataPoints = [0, 2, 4.75, 8, 11.61]; // Linearithmic
          break;
        default:
          dataPoints = [1, 1, 1, 1, 1]; // Default to constant
      }
  
      const data = {
        labels: labels,
        datasets: [
          {
            label: complexity,
            data: dataPoints,
            borderColor: "rgba(75, 192, 192, 1)",
            fill: false
          }
        ]
      };
  
      if (complexityChart) {
        complexityChart.destroy(); // Destroy existing chart
      }
  
      complexityChart = new Chart(ctx, {
        type: "line",
        data: data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  
    // Initial analysis
    analyzeCode();
  
    // Reanalyze button click handler
    reanalyzeButton.addEventListener("click", () => {
      analyzeCode();
    });
  });