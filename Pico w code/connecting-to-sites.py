import network
import urequests
import time

wlan=network.WLAN(network.STA_IF)
wlan.active(True)


def viewAvailableNetworks():
    networks=wlan.scan()
    for net in networks:
        print(f"network:{net[0].decode()} signal strength: {net[3]}")


def connect():
    t=0
    wlan.connect("JioFiber-BqkFg","Mp043650")
    while wlan.isconnected() == False:
        print("connecting, please wait...")
        time.sleep(0.3)
        t+=0.3
        if t>10:
            print("Couldn't connect to the network")
            return
    
    print("connected to the network")

try:
    connect()
    site="http://192.168.29.5:5000/orientation"
    print("query: ",site)
    #count=0;
    #start_time=0;
    while True:
        start=time.ticks_ms()
        #if(start_time>1000):
         #   print("count:",count)
          #  count=0;
           # start_time=0;
        r = urequests.get(site)
        print(r.json())
        r.close()
        elapsed = time.ticks_diff(time.ticks_ms(), start)
        print(f"request took {elapsed} ms")
        #delay = max(0, 16 - elapsed)
        #start_time+=max(delay,elapsed)
        #count+=1;
        #time.sleep_ms(delay)
except OSError as e:
    print("Error: connection closed",e)
