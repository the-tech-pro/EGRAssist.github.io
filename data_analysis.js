function loadData() {
    const ctx = document.getElementById('analysisChart').getContext('2d');
    const analysisChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Lap 1', 'Lap 2', 'Lap 3', 'Lap 4', 'Lap 5'],
            datasets: [{
                label: 'Max Speed (km/h)',
                data: [120, 130, 115, 140, 125],
                borderColor: '#008000',
                borderWidth: 2,
                fill: false
            }, {
                label: 'Avg Voltage (V)',
                data: [22.5, 23.0, 22.8, 23.2, 22.7],
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
}
