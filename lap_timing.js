let lapTimes = [];
let lapStartTime;

function startLap() {
    lapStartTime = new Date();
    document.getElementById('lapTimes').innerHTML += '<p>Lap started at ' + lapStartTime.toLocaleTimeString() + '</p>';
}

function stopLap() {
    if (lapStartTime) {
        const lapEndTime = new Date();
        const lapTime = (lapEndTime - lapStartTime) / 1000;
        lapTimes.push(lapTime);
        document.getElementById('lapTimes').innerHTML += '<p>Lap finished at ' + lapEndTime.toLocaleTimeString() + ' - Lap Time: ' + lapTime + ' seconds</p>';
        lapStartTime = null;
    }
}

function resetLap() {
    lapTimes = [];
    lapStartTime = null;
    document.getElementById('lapTimes').innerHTML = '';
}

function adjustLayout() {
    const container = document.querySelector('.container');
    if (container) {
        container.style.width = `${window.innerWidth}px`;
        container.style.height = `${window.innerHeight}px`;
    }
}

window.addEventListener('resize', adjustLayout);
document.addEventListener('DOMContentLoaded', adjustLayout);
