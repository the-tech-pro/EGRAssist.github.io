/* main.js */

let isRunning = false;
let currentLap = 0;
let totalLaps = 0;
let lapData = [];
let lapTimerInterval;
let lapStartTime;

// References to charts
let liveChart;
let analysisChart;

function openWindow(type, options = {}) {
    const windowsContainer = document.getElementById('windows-container');
    let windowDiv = document.createElement('div');
    windowDiv.className = 'window';
    windowDiv.style.width = options.width || '500px';
    windowDiv.style.height = options.height || '400px';
    windowDiv.style.top = options.top || `${Math.random() * 50 + 100}px`;
    windowDiv.style.left = options.left || `${Math.random() * 50 + 100}px`;

    let header = document.createElement('div');
    header.className = 'window-header';

    let title = document.createElement('h2');
    title.textContent = type === 'dashboard' ? 'Live Dashboard' :
                        type === 'lapTiming' ? 'Lap Timing' :
                        type === 'dataAnalysis' ? 'Data Analysis' : 'Control Panel';
    header.appendChild(title);

    let closeButton = document.createElement('button');
    closeButton.textContent = '×';
    closeButton.onclick = () => windowsContainer.removeChild(windowDiv);
    header.appendChild(closeButton);

    windowDiv.appendChild(header);

    let content = document.createElement('div');
    content.className = 'window-content';

    if (type === 'dashboard') {
        let chartContainer = document.createElement('div');
        chartContainer.className = 'chart-container';
        let canvas = document.createElement('canvas');
        canvas.id = 'liveChart';
        chartContainer.appendChild(canvas);
        content.appendChild(chartContainer);
        liveChart = createLiveChart(canvas);
    } else if (type === 'lapTiming') {
        let timerDisplay = document.createElement('div');
        timerDisplay.className = 'timer';
        timerDisplay.id = 'lapTimer';
        timerDisplay.textContent = '0:00';
        content.appendChild(timerDisplay);

        let lapCounter = document.createElement('div');
        lapCounter.className = 'lap-counter';
        lapCounter.id = 'lapCounterDisplay';
        lapCounter.textContent = 'Lap: 0/0';
        windowDiv.appendChild(lapCounter);
    } else if (type === 'dataAnalysis') {
        let chartContainer = document.createElement('div');
        chartContainer.className = 'chart-container';
        let canvas = document.createElement('canvas');
        canvas.id = 'analysisChart';
        chartContainer.appendChild(canvas);
        content.appendChild(chartContainer);
        analysisChart = createAnalysisChart(canvas);

        let lapCounter = document.createElement('div');
        lapCounter.className = 'lap-counter';
        lapCounter.id = 'analysisLapCounter';
        lapCounter.textContent = 'Lap: 0/0';
        windowDiv.appendChild(lapCounter);

        let controls = document.createElement('div');
        controls.className = 'control-panel';

        let prevLapButton = document.createElement('button');
        prevLapButton.textContent = 'Previous Lap';
        prevLapButton.className = 'btn';
        prevLapButton.onclick = () => navigateLap(-1);

        let nextLapButton = document.createElement('button');
        nextLapButton.textContent = 'Next Lap';
        nextLapButton.className = 'btn';
        nextLapButton.onclick = () => navigateLap(1);

        controls.appendChild(prevLapButton);
        controls.appendChild(nextLapButton);
        content.appendChild(controls);
    } else if (type === 'controlWindow') {
        let controlPanel = document.createElement('div');
        controlPanel.className = 'control-panel';

        let startButton = document.createElement('button');
        startButton.textContent = 'Start';
        startButton.className = 'btn';
        startButton.onclick = startDashboard;

        let stopButton = document.createElement('button');
        stopButton.textContent = 'Stop';
        stopButton.className = 'btn';
        stopButton.onclick = stopDashboard;

        let lapButton = document.createElement('button');
        lapButton.textContent = 'Lap';
        lapButton.className = 'btn';
        lapButton.onclick = recordLap;

        controlPanel.appendChild(startButton);
        controlPanel.appendChild(stopButton);
        controlPanel.appendChild(lapButton);
        content.appendChild(controlPanel);
    }

    windowDiv.appendChild(content);
    windowsContainer.appendChild(windowDiv);

    makeWindowDraggable(windowDiv, header);
}

// Set default layout positions and sizes for the windows
function setDefaultLayout() {
    openWindow('dashboard', { top: '10px', left: '10px', width: '700px', height: '400px' });
    openWindow('lapTiming', { top: '10px', left: '720px', width: '350px', height: '200px' });
    openWindow('controlWindow', { top: '220px', left: '720px', width: '350px', height: '200px' });
    openWindow('dataAnalysis', { top: '420px', left: '10px', width: '700px', height: '300px' });
}

// Function to create the live dashboard chart
function createLiveChart(canvas) {
    return new Chart(canvas, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Speed (km/h)',
                data: [],
                borderColor: '#4f83cc',
                borderWidth: 2,
                fill: false
            }, {
                label: 'Battery Voltage (V)',
                data: [],
                borderColor: '#77a9e5',
                borderWidth: 2,
                fill: false
            }]
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
                    beginAtZero: true,
                    suggestedMax: 50
                }
            }
        }
    });
}

// Function to create the analysis chart
function createAnalysisChart(canvas) {
    return new Chart(canvas, {
        type: 'line',
        data: {
            labels: [],
            datasets: []
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

// Function to start the dashboard and timer
function startDashboard() {
    if (isRunning) return; // Already running

    isRunning = true;
    lapStartTime = Date.now();

    // Update lap counter in Lap Timing Panel
    currentLap = totalLaps + 1;
    totalLaps = currentLap;
    updateLapCounters();

    // Start the timer
    lapTimerInterval = setInterval(updateLapTimer, 1000);

    // Start recording live data
    if (liveChart) {
        liveChart.data.labels = [];
        liveChart.data.datasets.forEach(dataset => dataset.data = []);
    }
    dataInterval = setInterval(recordLiveData, 1000);
}

// Function to stop the dashboard and timer
function stopDashboard() {
    if (!isRunning) return; // Not running

    isRunning = false;

    // Stop the timer
    clearInterval(lapTimerInterval);

    // Stop recording live data
    clearInterval(dataInterval);
}

// Function to record a lap
function recordLap() {
    if (!isRunning) return; // Cannot record lap if not running

    // Capture current live data
    const lapRecord = {
        lapNumber: currentLap,
        timestamp: new Date().toLocaleTimeString(),
        labels: [...liveChart.data.labels],
        datasets: liveChart.data.datasets.map(ds => ({
            label: ds.label,
            data: [...ds.data],
            borderColor: ds.borderColor,
            borderWidth: ds.borderWidth,
            fill: ds.fill
        }))
    };

    lapData.push(lapRecord);

    // Increment lap count
    currentLap++;
    totalLaps = Math.max(totalLaps, currentLap - 1);
    updateLapCounters();

    // Reset the timer
    clearInterval(lapTimerInterval);
    lapStartTime = Date.now();
    lapTimerInterval = setInterval(updateLapTimer, 1000);

    // Reset live chart data
    if (liveChart) {
        liveChart.data.labels = [];
        liveChart.data.datasets.forEach(dataset => dataset.data = []);
    }
}

// Function to update lap counters in both panels
function updateLapCounters() {
    // Update Lap Timing Panel
    const lapCounterDisplay = document.getElementById('lapCounterDisplay');
    if (lapCounterDisplay) {
        lapCounterDisplay.textContent = `Lap: ${currentLap}/${totalLaps}`;
    }

    // Update Data Analysis Panel
    const analysisLapCounter = document.getElementById('analysisLapCounter');
    if (analysisLapCounter) {
        analysisLapCounter.textContent = `Lap: ${currentLap}/${totalLaps}`;
    }
}

// Function to update the lap timer display
function updateLapTimer() {
    const lapTimerDisplay = document.getElementById('lapTimer');
    if (!lapTimerDisplay) return;

    const elapsedTime = Date.now() - lapStartTime;
    const seconds = Math.floor((elapsedTime / 1000) % 60);
    const minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
    const hours = Math.floor((elapsedTime / (1000 * 60 * 60)) % 24);

    lapTimerDisplay.textContent = `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// Function to record live data
function recordLiveData() {
    if (!isRunning || !liveChart) return;

    const currentTime = new Date().toLocaleTimeString();
    const speed = (Math.random() * (120 - 80) + 80).toFixed(2); // Random speed between 80 and 120 km/h
    const voltage = (Math.random() * (14 - 12) + 12).toFixed(2); // Random voltage between 12 and 14 V

    liveChart.data.labels.push(currentTime);
    liveChart.data.datasets[0].data.push(speed);
    liveChart.data.datasets[1].data.push(voltage);

    // Keep only the latest 50 data points
    if (liveChart.data.labels.length > 50) {
        liveChart.data.labels.shift();
        liveChart.data.datasets.forEach(dataset => dataset.data.shift());
    }

    liveChart.update();
}

// Function to navigate through laps in the Data Analysis panel
let currentAnalysisLapIndex = -1;

function navigateLap(direction) {
    if (lapData.length === 0) return;

    currentAnalysisLapIndex += direction;

    // Clamp the index
    if (currentAnalysisLapIndex < 0) currentAnalysisLapIndex = 0;
    if (currentAnalysisLapIndex >= lapData.length) currentAnalysisLapIndex = lapData.length - 1;

    const lap = lapData[currentAnalysisLapIndex];
    if (!lap || !analysisChart) return;

    // Update the analysis chart with the selected lap's data
    analysisChart.data.labels = lap.labels;
    analysisChart.data.datasets = lap.datasets.map(ds => ({
        label: ds.label,
        data: ds.data,
        borderColor: ds.borderColor,
        borderWidth: ds.borderWidth,
        fill: ds.fill
    }));

    analysisChart.update();

    // Update the lap counter display
    const analysisLapCounter = document.getElementById('analysisLapCounter');
    if (analysisLapCounter) {
        analysisLapCounter.textContent = `Lap: ${lap.lapNumber}/${totalLaps}`;
    }
}

// Function to create the draggable windows
function makeWindowDraggable(window, header) {
    let offsetX, offsetY;

    header.addEventListener('mousedown', function(e) {
        offsetX = e.clientX - window.getBoundingClientRect().left;
        offsetY = e.clientY - window.getBoundingClientRect().top;
        document.addEventListener('mousemove', moveWindow);
        document.addEventListener('mouseup', stopMovingWindow);
    });

    function moveWindow(e) {
        window.style.left = `${e.clientX - offsetX}px`;
        window.style.top = `${e.clientY - offsetY}px`;
    }

    function stopMovingWindow() {
        document.removeEventListener('mousemove', moveWindow);
        document.removeEventListener('mouseup', stopMovingWindow);
    }
}

// Initialize the layout
document.addEventListener('DOMContentLoaded', () => {
    setDefaultLayout();
});
