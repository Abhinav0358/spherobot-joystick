from flask import Flask, jsonify, request , render_template
from datetime import datetime

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

    orientation_data["roll"] = data.get("roll", 0)
    orientation_data["pitch"] = data.get("pitch", 0)
    orientation_data["yaw"] = data.get("yaw", 0)

    # print("Updated orientation:", orientation_data)
    return jsonify({
        "message": "Orientation updated",
        "orientation": orientation_data
    }), 200


@app.route('/orientation', methods=['GET'])
def get_orientation():
    return jsonify(orientation_data)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)