// app.js
function calculate() {
    const trackLength = parseFloat(document.getElementById('trackLength').value);
    const batteryWattage = parseFloat(document.getElementById('batteryWattage').value);
    
    // Basic validation
    if (isNaN(trackLength) || isNaN(batteryWattage)) {
        alert('Please enter valid numbers.');
        return;
    }

    // Example calculation logic (replace with real logic)
    const motorWattage = trackLength * 0.1; // Simplified placeholder logic

    // Display calculation result
    let resultsHTML = `
        <h2>Results:</h2>
        <p>Required Motor Wattage: ${motorWattage.toFixed(2)} W</p>
        <p>Battery Wattage: ${batteryWattage.toFixed(2)} W</p>
    `;

    // Fetch AI suggestions from backend
    fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackLength, batteryWattage })
    })
    .then(response => response.json())
    .then(data => {
        resultsHTML += `
            <h2>AI Suggestions:</h2>
            <p>${data.suggestions}</p>
        `;
        document.getElementById('results').innerHTML = resultsHTML;
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('results').innerHTML = `
            <h2>Error:</h2>
            <p>There was an error retrieving the suggestions.</p>
        `;
    });
}
