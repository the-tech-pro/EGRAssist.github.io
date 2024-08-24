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
        console.log("CSV Data loaded:", csvData); // Debugging
    };
    reader.readAsText(file);
}

function parseCSV(text) {
    const rows = text.split('\n').map(row => row.split(','));
    const header = rows[0];
    const data = rows.slice(1).map(row => {
        const entry = {};
        row.forEach((value, index) => {
            entry[header[index]] = parseFloat(value);
        });
        return entry;
    });
    return data;
}

function calculate() {
    const trackLength = parseFloat(document.getElementById('trackLength').value);
    const battery1Wattage = parseFloat(document.getElementById('battery1Wattage').value);
    const battery2Wattage = parseFloat(document.getElementById('battery2Wattage').value);
    const aiEnabled = document.getElementById('aiToggle').checked;
    
    if (isNaN(trackLength) || isNaN(battery1Wattage) || isNaN(battery2Wattage)) {
        alert('Please enter valid numbers.');
        return;
    }

    if (!csvData) {
        alert('Please upload a CSV file.');
        return;
    }

    const motorWattage = 240; // Fixed motor wattage
    const totalBatteryWattage = battery1Wattage + battery2Wattage; // Total wattage of both batteries

    // Calculate total energy consumed from the CSV data
    let totalEnergyConsumed = 0;
    if (csvData.length > 0) {
        totalEnergyConsumed = csvData.reduce((sum, entry) => sum + (entry.consumption || 0), 0);
    }

    // Assuming the total energy is in watt-hours (Wh), adjust if the units differ
    const raceDurationHours = trackLength / 10; // Assuming an average speed of 10 meters per minute
    const energyAvailableWh = totalBatteryWattage * raceDurationHours;

    // Calculate the constant wattage for the motor
    let constantWattage = 0;
    if (energyAvailableWh > 0) {
        constantWattage = energyAvailableWh / raceDurationHours;
    }

    // Leave a buffer by reducing the wattage by 10% (or another percentage as needed)
    const bufferedWattage = constantWattage * 0.9;

    // Display results
    let resultsHTML = `
        <h2>Results:</h2>
        <p>Motor Wattage: ${motorWattage} W</p>
        <p>Total Battery Wattage: ${totalBatteryWattage.toFixed(2)} W</p>
        <p>Total Energy Consumed (Watt-hours): ${totalEnergyConsumed.toFixed(2)}</p>
        <p>Energy Available for Race (Watt-hours): ${energyAvailableWh.toFixed(2)}</p>
        <p>Constant Wattage with Buffer: ${bufferedWattage.toFixed(2)} W</p>
        <p>Battery 1 Wattage: ${battery1Wattage.toFixed(2)} W</p>
        <p>Battery 2 Wattage: ${battery2Wattage.toFixed(2)} W</p>
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
        }, 1000); // Simulate 1 second delay for fetching data
    } else {
        document.getElementById('results').innerHTML = resultsHTML;
    }
}

// Ensure the calculate function is bound to the button
document.querySelector('button').addEventListener('click', calculate);
