# server.py

from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/api/suggestions', methods=['POST'])
def get_suggestions():
    try:
        data = request.json
        track_length = data['trackLength']
        battery_wattage = data['batteryWattage']
        
        # Example AI logic placeholder
        suggestions = "Consider optimizing battery usage and aerodynamics to improve efficiency."
        
        return jsonify({'suggestions': suggestions})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
