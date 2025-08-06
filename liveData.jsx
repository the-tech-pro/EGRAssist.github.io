const { useState, useEffect } = React;

function LiveDataItem({ icon, value, label }) {
  return (
    <div className="live-data-item">
      <i className={icon}></i>
      <span>{value}</span>
      <p>{label}</p>
    </div>
  );
}

function LiveDataGrid() {
  const [data, setData] = useState({
    throttle: '0%',
    brake: 'Inactive',
    ambientTemp: '0°C',
    motorTemp: '0°C',
    wheelSpeed: '0 mph',
    motorRPM: '0',
    gpsLongitude: '0',
    gpsLatitude: '0',
    lapNumber: '0',
    distance: '0 miles'
  });

  useEffect(() => {
    window.updateLiveDataState = (newData) => {
      setData((prev) => ({ ...prev, ...newData }));
    };
  }, []);

  return (
    <div className="live-data-grid">
      <LiveDataItem icon="fas fa-tachometer-alt" value={data.throttle} label="Throttle Position" />
      <LiveDataItem icon="fas fa-car" value={data.brake} label="Brake Status" />
      <LiveDataItem icon="fas fa-thermometer-half" value={data.ambientTemp} label="Ambient Temperature" />
      <LiveDataItem icon="fas fa-fire" value={data.motorTemp} label="Motor Temperature" />
      <LiveDataItem icon="fas fa-tachometer-alt" value={data.wheelSpeed} label="Wheel Speed" />
      <LiveDataItem icon="fas fa-cogs" value={data.motorRPM} label="Motor RPM" />
      <LiveDataItem icon="fas fa-map-marker-alt" value={data.gpsLongitude} label="GPS Longitude" />
      <LiveDataItem icon="fas fa-map-marker-alt" value={data.gpsLatitude} label="GPS Latitude" />
      <LiveDataItem icon="fas fa-flag-checkered" value={data.lapNumber} label="Lap Number" />
      <LiveDataItem icon="fas fa-road" value={data.distance} label="Distance" />
    </div>
  );
}

ReactDOM.render(<LiveDataGrid />, document.getElementById('liveDataRoot'));
