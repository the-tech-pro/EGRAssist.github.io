let liveChart;
let dataInterval;

function startData() {
    document.getElementById('startButton').disabled = true;
    document.getElementById('stopButton').disabled = false;

    const ctx = document.getElementById('liveChart').getContext('2d');
    liveChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Speed (km/h)',
                data: [],
                borderColor: '#008000',
                borderWidth: 2,
                fill: false
            }, {
                label: 'Battery Voltage (V)',
                data: [],
                borderColor: '#00FF00',
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

    dataInterval = setInterval(() => updateLiveData(), 1000);
}

function stopData() {
    clearInterval(dataInterval);
    document.getElementById('startButton').disabled = false;
    document.getElementById('stopButton').disabled = true;
}

function updateLiveData() {
    const speed = (Math.random() * (40 - 20) + 20).toFixed(2);
    const voltage = (Math.random() * (24 - 22) + 22).toFixed(2);
    const currentTime = new Date().toLocaleTimeString();

    liveChart.data.labels.push(currentTime);
    liveChart.data.datasets[0].data.push(speed);
    liveChart.data.datasets[1].data.push(voltage);

    if (liveChart.data.labels.length > 50) {
        liveChart.data.labels.shift();
        liveChart.data.datasets[0].data.shift();
        liveChart.data.datasets[1].data.shift();
    }

    liveChart.update();
}
