#!/bin/sh

DIR="rsyncd"
LOCK="rsyncd.lock"
LOG="rsyncd.log"
PID="rsyncd.pid"
CONF="rsyncd.conf"
CUR_PATH=`(pwd)`

function init() {
	clear
	echo "Rsync service start!"

	if [ ! -d $DIR ]; then
		mkdir $DIR
		echo "create '$DIR/' ... ok!"
	fi

	if [ ! -f $DIR/$LOCK ]; then
		touch $DIR/$LOCK
		echo "create '$DIR/$LOCK' ... ok!"
	fi

	if [ ! -f $DIR/$LOG ]; then
		touch $DIR/$LOG
		echo "create '$DIR/$LOG' ... ok!"
	fi

	if [ ! -f $DIR/$CONF ]; then
		touch $DIR/$CONF

		echo "Please input the path which you need to rsync: (current path: $CUR_PATH)"
		read REL_PATH

		RSYNC_PATH="$CUR_PATH/$REL_PATH"

		echo "And, Task name is ? "
		read RSYNC_TASK_NAME

		CONF_STR="
			use chroot = no
			max connections = 100
			syslog facility = local5
			pid file = $CUR_PATH/$DIR/$PID
			log file = $CUR_PATH/$DIR/$LOG
			lock file = $CUR_PATH/$DIR/$LOCK

			[$RSYNC_TASK_NAME]
				path = $RSYNC_PATH
				exclude = .svn
				read only = no
		"

		echo "$CONF_STR" > $DIR/$CONF
		echo "create '$DIR/$CONF' ... ok!"
	fi
}

function start() {
	echo "PORT of rsync serive: (default:8801)"
	read PORT
	if [ "$PORT" = "" ]; then
		PORT=8801
	fi
	rsync --daemon --port="$PORT" --config="$DIR/$CONF"
	echo "Rsync serive is start! port=$PORT"
}

function stop() {
	kill -9 `cat $DIR/$PID`
	rm -f $DIR/$PID
	echo "Rsync serive is stop!"
}

function status() {
	STATUS=`ps -fe | grep rsync | grep -v 'grep'`
	if [ "$STATUS" = "" ]; then
		echo "Rsync service does not start!"
	else
		echo "$STATUS";
	fi
}

case $1 in
	"init")
		init
		;;
	"start")
		start
		;;
	"stop")
		stop
		;;
	"status")
		status
		;;
	*)
		echo "Useage: ./sync [option]"
		echo "OPTIONS SUMMARY:"
		echo " init: initialize rsync config files."
		echo " start: start rsync service."
		echo " stop: stop rsync service."
		echo " status: show rsync service status."
		;;
esac

