let isRunning = false;
let lapNumber = 0;
let liveChart = null;
let liveChartData = {
    labels: [],
    datasets: [
        {
            label: 'Wheel Speed (mph)',
            data: [],
            borderColor: '#4f83cc',
            borderWidth: 2,
            fill: false
        },
        {
            label: 'Motor RPM',
            data: [],
            borderColor: '#77a9e5',
            borderWidth: 2,
            fill: false
        }
    ]
};

// Initialize variables to simulate continuous data
let lastWheelSpeed = 60; // Initial wheel speed
let lastMotorRPM = 3000; // Initial motor RPM
let chartNeedsUpdate = false; // Flag to indicate chart update

function startDashboard() {
    isRunning = true;
    logDebug('Dashboard started');
    initializeChart();
    startSpoofing();
    requestAnimationFrame(updateChart);
}

function stopDashboard() {
    isRunning = false;
    logDebug('Dashboard stopped');
}

function initializeChart() {
    const ctx = document.getElementById('liveChart').getContext('2d');
    liveChart = new Chart(ctx, {
        type: 'line',
        data: liveChartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false, // Disable Chart.js animation for performance
            scales: {
                x: {
                    ticks: {
                        maxRotation: 90,
                        minRotation: 90
                    }
                },
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function updateLiveData() {
    const currentTime = new Date().toLocaleTimeString();
    
    // Generate new data with small variations from the last data points
    lastWheelSpeed = Math.max(0, lastWheelSpeed + (Math.random() * 4 - 2)); // +/- 2 mph variation
    lastMotorRPM = Math.max(0, lastMotorRPM + (Math.random() * 200 - 100)); // +/- 100 RPM variation

    // Update the live data fields
    document.getElementById('wheelSpeed').textContent = lastWheelSpeed.toFixed(1) + ' mph';
    document.getElementById('motorRPM').textContent = lastMotorRPM.toFixed(0);

    // Update the chart data
    liveChartData.labels.push(currentTime);
    liveChartData.datasets[0].data.push(lastWheelSpeed.toFixed(1));
    liveChartData.datasets[1].data.push(lastMotorRPM.toFixed(0));

    // Limit the chart to show only the last 15 data points
    if (liveChartData.labels.length > 15) {
        liveChartData.labels.shift();
        liveChartData.datasets.forEach(dataset => dataset.data.shift());
    }

    // Flag that chart needs updating
    chartNeedsUpdate = true;
}

function updateChart() {
    if (chartNeedsUpdate) {
        liveChart.update();
        chartNeedsUpdate = false;
    }
    if (isRunning) {
        requestAnimationFrame(updateChart);
    }
}

function startSpoofing() {
    if (document.getElementById('spoofData').checked && isRunning) {
        updateLiveData();
        setTimeout(startSpoofing, 1000); // Update every second
    }
}

function recordLap() {
    if (!isRunning) return;
    lapNumber++;
    addLapButton(lapNumber);
    logDebug(`Lap ${lapNumber} recorded`);
}

function addLapButton(lapNumber) {
    const lapButtonsContainer = document.getElementById('lapButtonsContainer');
    const button = document.createElement('button');
    button.textContent = `Lap ${lapNumber}`;
    button.className = 'btn';
    button.style.margin = "0"; // Ensure no margin to fit in one row
    button.onclick = () => openLapWindow(lapNumber);
    lapButtonsContainer.appendChild(button);
}

function openLapWindow(lapNumber) {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const newWindow = window.open('', '', `width=${width},height=${height}`);

    const lap = lapNumber;

    newWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Lap ${lapNumber}</title>
            <link rel="stylesheet" href="styles.css">
            <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        </head>
        <body>
            <div class="lap-window">
                <h1>Lap ${lapNumber}</h1>
                <button onclick="window.close()">Close</button>
                <div class="chart-container">
                    <canvas id="lapChart"></canvas>
                </div>
            </div>
            <script>
                const ctx = document.getElementById('lapChart').getContext('2d');
                new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: ${JSON.stringify(liveChartData.labels)},
                        datasets: ${JSON.stringify(liveChartData.datasets)}
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            x: {
                                ticks: {
                                    maxRotation: 90,
                                    minRotation: 90
                                }
                            },
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
            </script>
        </body>
        </html>
    `);

    newWindow.document.close();
    newWindow.focus();
}

function logDebug(message, isAlert = false) {
    const debugLog = document.getElementById('debugLog');
    const logEntry = document.createElement('div');
    logEntry.textContent = message;
    if (isAlert) {
        logEntry.classList.add('debug-alert');
    }
    debugLog.appendChild(logEntry);
    debugLog.scrollTop = debugLog.scrollHeight;
}

// AI Suggestion and Alerts
setInterval(() => {
    if (isRunning) {
        const suggestion = `Consider pitting in ${Math.floor(Math.random() * 10) + 1} laps.`;
        logDebug(`AI Suggestion: ${suggestion}`, true);
    }
}, 10000);

setInterval(() => {
    if (isRunning) {
        const alert = `Alert: ${Math.random() > 0.5 ? 'Speed' : 'Battery'} anomaly detected.`;
        logDebug(alert, true);
    }
}, 15000);

document.getElementById('startButton').onclick = startDashboard;
document.getElementById('stopButton').onclick = stopDashboard;
document.getElementById('lapButton').onclick = recordLap;
document.getElementById('spoofData').onchange = startSpoofing;
