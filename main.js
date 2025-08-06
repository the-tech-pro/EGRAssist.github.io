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
let distance = 0; // Distance traveled in miles

function startDashboard() {
    isRunning = true;
    logDebug('Dashboard started');
    initializeChart();
    startSpoofing();
    requestAnimationFrame(updateChart);
    document.getElementById('startButton').disabled = true;
    document.getElementById('stopButton').disabled = false;
    distance = 0;
}

function stopDashboard() {
    isRunning = false;
    logDebug('Dashboard stopped');
    document.getElementById('startButton').disabled = false;
    document.getElementById('stopButton').disabled = true;
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
    distance += lastWheelSpeed / 3600; // convert mph to miles per second
    const throttle = Math.random() * 100;
    const brakeActive = Math.random() > 0.8;
    const ambientTemp = 20 + Math.random() * 10;
    const motorTemp = 60 + Math.random() * 20;
    const gpsLongitude = -0.1 + Math.random() * 0.2;
    const gpsLatitude = 51.5 + Math.random() * 0.2;

    if (window.updateLiveDataState) {
        window.updateLiveDataState({
            wheelSpeed: `${lastWheelSpeed.toFixed(1)} mph`,
            motorRPM: `${lastMotorRPM.toFixed(0)}`,
            throttle: `${throttle.toFixed(0)}%`,
            brake: brakeActive ? 'Active' : 'Inactive',
            ambientTemp: `${ambientTemp.toFixed(1)}°C`,
            motorTemp: `${motorTemp.toFixed(1)}°C`,
            gpsLongitude: gpsLongitude.toFixed(5),
            gpsLatitude: gpsLatitude.toFixed(5),
            lapNumber: lapNumber.toString(),
            distance: `${distance.toFixed(2)} miles`
        });
    }

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
    if (window.updateLiveDataState) {
        window.updateLiveDataState({ lapNumber: lapNumber.toString() });
    }
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
    const overlay = document.getElementById('lapOverlay');
    document.getElementById('lapTitle').textContent = `Lap ${lapNumber}`;
    overlay.style.display = 'flex';

    const ctx = document.getElementById('lapChart').getContext('2d');
    if (window.lapChart) {
        window.lapChart.destroy();
    }

    const labels = [...liveChartData.labels];
    const datasets = liveChartData.datasets.map(ds => ({
        ...ds,
        data: [...ds.data]
    }));

    window.lapChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets
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
}

function closeLapOverlay() {
    const overlay = document.getElementById('lapOverlay');
    overlay.style.display = 'none';
    if (window.lapChart) {
        window.lapChart.destroy();
        window.lapChart = null;
    }
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

function adjustLayout() {
    const container = document.querySelector('.container');
    if (container) {
        container.style.width = `${window.innerWidth}px`;
        container.style.height = `${window.innerHeight}px`;
    }
    if (liveChart) {
        liveChart.resize();
    }
}

window.addEventListener('resize', adjustLayout);
document.addEventListener('DOMContentLoaded', adjustLayout);

document.getElementById('startButton').onclick = startDashboard;
document.getElementById('stopButton').onclick = stopDashboard;
document.getElementById('lapButton').onclick = recordLap;
document.getElementById('spoofData').onchange = startSpoofing;
document.getElementById('darkModeToggle').onchange = (e) => {
    document.body.classList.toggle('dark-mode', e.target.checked);
};
document.getElementById('closeLapOverlay').onclick = closeLapOverlay;
