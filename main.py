from flask import Flask, jsonify, request , render_template
from datetime import datetime
from collections import OrderedDict
import json
app = Flask(__name__)

# Example values for roll, pitch, yaw (you can replace with real values)
orientation_data = {
    "time":str(datetime.now().time()),
    "roll": 0,
    "pitch": 0,
    "yaw": 0
}
 
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/update', methods=['POST'])
def update_orientation():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data received"}), 400

    orientation_data["yaw"] = data.get("roll", 0)
    orientation_data["pitch"] = data.get("pitch", 0)
    orientation_data["roll"] = data.get("yaw", 0)

    # print("Updated orientation:", orientation_data)
    return jsonify({
        "message": "Orientation updated",
        "orientation": orientation_data
    }), 200


@app.route('/orientation', methods=['GET'])
def get_orientation():
    ordered_data = OrderedDict([
        ("time", str(datetime.now().time())),
        ("roll", orientation_data["roll"]),
        ("pitch", orientation_data["pitch"]),
        ("yaw", orientation_data["yaw"])
    ])
    return json.dumps(ordered_data), 200, {'Content-Type': 'application/json'}

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)