HR=\033[37m--------------------- Dailymotion ReactJs 👍 -----------------------------\033[39m

all: hello server react browser

hello:
	@echo "\n${HR}\n"

server:
	@python -m SimpleHTTPServer

react:
	@./node_modules/react-tools/bin/jsx --watch js/src js/build

browser:
	@open -a Google\ Chrome http://dev.daily-react.com:8000
