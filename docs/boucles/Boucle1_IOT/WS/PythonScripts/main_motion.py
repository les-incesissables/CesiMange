from cli import *
from gui import *
import json
import mqttclient
from time import *
# Import nested library from Main Motion Detector
from gpio import *
from time import *
from ioeclient import *
from physical import *
from bluetooth import *
import math


# Set Global variables
DEACTIVATE_TIMER = 5; # in seconds
state = 0
current_time = 0

# Connection identifiers
broker_address = "1.1.1.1"
username=""
password=""

# Publication and subscriptions topics
pub="RSS/Bureau/Light/status"
sub="RSS/Bureau/Motion/status"
issub=0


def guiEvent(type, args):
	data = json.loads(args)
	
	mqttclient.init()
	
	if type == "state":
		GUI.update("state", json.dumps(mqttclient.state()))
	elif type == "connect":
		mqttclient.connect(data["broker_address"], data["username"], data["password"])
	elif type == "disconnect":
		mqttclient.disconnect()
	elif type == "subscribe":
		mqttclient.subscribe(data["topic"])
	elif type == "unsubscribe":
		mqttclient.unsubscribe(data["topic"])
	elif type == "publish":
		mqttclient.publish(data["topic"], data["payload"], data["qos"])

def cliEvent(type, args):
	if type == "invoked" and args[0] == "mqttclient":
		if len(args) < 2 or len(args) > 1 and args[1] == "-?" or args[1] == "/?":
			print_cli_usage()
			CLI.exit()
		elif len(args) > 1 and args[1] != "-?" and args[1] != "/?":
			mqttclient.init()
			
			if len(args) > 2 and len(args) < 6 and args[1] == "connect":
				username = ""
				password = ""
				
				if len(args) > 3:
					username = args[3]
					
					if len(args) == 5:
						password = args[4]
				
				mqttclient.connect(args[2], username, password)
			elif len(args) == 2 and args[1] == "disconnect":
				mqttclient.disconnect()
			elif len(args) == 3 and args[1] == "subscribe":
				mqttclient.subscribe(args[2])
			elif len(args) == 3 and args[1] == "unsubscribe":
				mqttclient.unsubscribe(args[2])
			elif len(args) == 5 and args[1] == "publish":
				mqttclient.publish(args[2], args[3], args[4])
			elif len(args) == 2 and args[1] == "display-last-message":
				messages = mqttclient.state()["messages"]
				
				if len(messages) > 0:
					print messages[-1]
				
				print ""
				CLI.exit()
			elif len(args) == 2 and args[1] == "display-all-messages":
				messages = mqttclient.state()["messages"]
				
				for message in messages:
					print message
				
				print ""
				CLI.exit()
			elif len(args) == 2 and args[1] == "display-last-event":
				events = mqttclient.state()["events"]
				
				if len(events) > 0:
					print events[-1]
				
				print ""
				CLI.exit()
			elif len(args) == 2 and args[1] == "display-all-events":
				events = mqttclient.state()["events"]
				
				for event in events:
					print event
				
				print ""
				CLI.exit()
			else:
				print_cli_usage()
				CLI.exit()
	elif type == "interrupted":
		CLI.exit()

def print_cli_usage():
	print "MQTT Client"
	print ""
	print "Usage:"
	print "mqttclient connect <broker address> [username] [password]"
	print "mqttclient disconnect"
	print "mqttclient subscribe <topic>"
	print "mqttclient unsubscribe <topic>"
	print "mqttclient publish <topic> <payload> <qos>"
	print "mqttclient display-last-message"
	print "mqttclient display-all-messages"
	print "mqttclient display-last-event"
	print "mqttclient display-all-events"
	print ""

def on_connect(status, msg, packet):
	if status == "Success" or status == "Error":
		print status + ": " + msg
	elif status == "":
		print msg
	
	CLI.exit()

def on_disconnect(status, msg, packet):
	if status == "Success" or status == "Error":
		print status + ": " + msg
	elif status == "":
		print msg
	
	CLI.exit()


def on_subscribe(status, msg, packet):
	# state sub variable setting
	global issub
	if status == "Success":
		issub = 1
	if status == "Success" or status == "Error":
		print status + ": " + msg
	elif status == "":
		print msg
		
	CLI.exit()


def on_unsubscribe(status, msg, packet):
	# state sub variable setting
	global issub
	if status == "Success":
		issub = 0
	if status == "Success" or status == "Error":
		print status + ": " + msg
	elif status == "":
		print msg
	
	CLI.exit()

def on_publish(status, msg, packet):
	if status == "Success" or status == "Error":
		print status + ": " + msg
	elif status == "":
		print msg
	
	CLI.exit()

def on_message_received(status, msg, packet):
	if status == "Success" or status == "Error":
		print status + ": " + msg
	elif status == "":
		print msg
	
	CLI.exit()

def on_gui_update(msg, data):
	GUI.update(msg, json.dumps(data))



# Ajouts #
# Define publish function
def mypublish(topic,val):
	#topic change topic value if other room/object
	# Optional #
	at=" at "
	t = localtime()
	actual_time = strftime("%H:%M:%S", t)
	# Optional #

	payload=str(val)+at+actual_time
	qos="1"
	mqttclient.init()
	mqttclient.publish(topic,payload,qos)
	print topic

# Define object properties
def objsetup():
	IoEClient.setup({
		"type": "Motion Detector",
		"states": [{
			"name": "On",
			"type": "bool",
			"controllable": True
		}]
	})
	global state
	state = restoreProperty("state", 0)
	setState(state)

def main():
	# call object properties 
	objsetup()
	GUI.setup()
	CLI.setup()
	mqttclient.init()
	mqttclient.onConnect(on_connect)
	mqttclient.onDisconnect(on_disconnect)
	mqttclient.onSubscribe(on_subscribe)
	mqttclient.onUnsubscribe(on_unsubscribe)
	mqttclient.onPublish(on_publish)
	mqttclient.connect(broker_address, username, password)
	# delay(10000)
	
	while True:
		# call looping function 
		loop()

def restoreProperty(propertyName, defaultValue):
	value = getDeviceProperty(getName(), propertyName)
	if  not (value is "" or value is None):
		if  type(defaultValue) is int :
			value = int(value)

		setDeviceProperty(getName(), propertyName, value)
		return value
	return defaultValue

# define mouseEvent function to detect mouse collapsing
def mouseEvent(pressed, x, y, firstPress):
	setState(1)

# define looping function
def loop():
	if issub==0 and sub!="":
		mqttclient.subscribe(sub)
	mqttclient.onMessageReceived(on_message_received)
	mqttclient.onGUIUpdate(on_gui_update)
	global state
	global current_time
	if  state == 1 :
		current_time = current_time - 1
		if  current_time <= 0 :
			setState(0)
			sleep(1)
	
	sleep(1)
# set object state
def setState(newState):
	global state
	global DEACTIVATE_TIMER
	global current_time
	state = newState

	if  state is 0 :
		digitalWrite(1, LOW)
	else:
		digitalWrite(1, HIGH)
		current_time = DEACTIVATE_TIMER

	# publish MQTT message
	mypublish(pub,state)
	IoEClient.reportStates(state)
	setDeviceProperty(getName(), "state", state)

if __name__ == "__main__":
	main()
