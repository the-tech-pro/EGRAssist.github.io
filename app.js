// app.js
document.getElementById('csvFile').addEventListener('change', handleFileSelect);

let csvData = null;

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result;
        csvData = parseCSV(text);
    };
    reader.readAsText(file);
}

function parseCSV(text) {
    const rows = text.split('\n').map(row => row.split(','));
    const header = rows[0];
    const data = rows.slice(1).map(row => {
        const entry = {};
        row.forEach((value, index) => {
            entry[header[index]] = value;
        });
        return entry;
    });
    return data;
}

function calculate() {
    const trackLength = parseFloat(document.getElementById('trackLength').value);
    const batteryWattage = parseFloat(document.getElementById('batteryWattage').value);
    const aiEnabled = document.getElementById('aiToggle').checked;
    
    if (isNaN(trackLength) || isNaN(batteryWattage)) {
        alert('Please enter valid numbers.');
        return;
    }

    if (!csvData) {
        alert('Please upload a CSV file.');
        return;
    }

    // Example calculation logic
    const motorWattage = trackLength * 0.1;

    // Display results
    let resultsHTML = `
        <h2>Results:</h2>
        <p>Required Motor Wattage: ${motorWattage.toFixed(2)} W</p>
        <p>Battery Wattage: ${batteryWattage.toFixed(2)} W</p>
    `;

    if (aiEnabled) {
        // Mock AI suggestions (simulated response)
        setTimeout(() => {
            const mockSuggestions = "Consider optimizing battery usage and aerodynamics to improve efficiency.";
            resultsHTML += `
                <h2>AI Suggestions:</h2>
                <p>${mockSuggestions}</p>
            `;
            document.getElementById('results').innerHTML = resultsHTML;
        }, 1000);
    } else {
        document.getElementById('results').innerHTML = resultsHTML;
    }
}
