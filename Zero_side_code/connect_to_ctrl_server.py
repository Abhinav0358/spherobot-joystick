import requests
import time

def connect_check():
    import socket
    try:
        # Ping Google's DNS to check network
        socket.create_connection(("8.8.8.8", 53))
        print("Connected to the internet")
        return True
    except OSError:
        print("Not connected to Wi-Fi")
        return False

site = "http://192.168.31.244:5000/orientation" ## edit according to local ip

try:
    if not connect_check():
        print("Make sure your Pi is connected to Wi-Fi using raspi-config")
        exit()

    print("Querying:", site)

    while True:
        start = time.perf_counter()

        try:
            r = requests.get(site)
            print(r.json())
            r.close()
        except requests.RequestException as e:
            print("Request failed:", e)

        elapsed = (time.perf_counter() - start) * 1000  # ms
        print(f"Request took {elapsed:.2f} ms")
        time.sleep(max(0, 0.016))  # Aiming for ~60Hz refresh (16ms interval)

except KeyboardInterrupt:
    print("Exiting...")