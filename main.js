'use strict';

const async 				= require('async');
const SerialPort 		= require('serialport');
const stream 				= process.stdin;
const consoleClear 	= require('clear');
const fs 						= require('fs');
const musicPlayer 	= require('play-sound')({})

var serialPorts				= [];
var selectedPort 			= '';
var selectedBaudRate 	= '';
const baudRates 			= ['1200', '2400', '4800', '9600', '14400', '19200', '28800', '38400', '57600', '115200', '230400'];

main(); return;

function main() {
	consoleClear();

	async.waterfall([
		welcome,
		getSerialPorts,
		selectPort,
		selectBaudrate,
		startReading
	],
	function(err, result) {
		console.log('end');
	});
}

function welcome(callback) {
	consolePrint('SerialTroz 1.0');

	playSound();

	printAlbatroz();
	
	callback(null);
}

function getSerialPorts(callback) {
	// console.log('getSerialPorts');

	SerialPort.list().then(function(result) {
		var ports = [];

		for (var i = 0; i < result.length; i++) {
			var port = result[i];

			ports.push(port.comName);
		}

		serialPorts = ports;

		callback(null);
	});
}

function selectPort(callback) {
	// console.log('selectPort');

	showSelectMenu('Select USB Port:', serialPorts, function(value) {
		// console.log('selected', value);

		selectedPort = value;

		callback(null);
	});
}

function selectBaudrate(callback) {
	consoleClear();
	// console.log('selectPort');

	showSelectMenu('Select Baudrate:', baudRates, function(value) {
		// s

		selectedBaudRate = Number(value);

		callback(null);
	});
}

function startReading(callback) {
	consoleClear();

	consolePrint('Start reading port: '+ selectedPort +' baudRate: '+ selectedBaudRate, true);

	var port = new SerialPort(selectedPort, { baudRate: selectedBaudRate });

	port.on('data', function (data) {
		var data = bufferToString(data);

		console.log(data);
	});

	callback(null);
}



function showSelectMenu(title, options, callback) {

	// console.log('showSelectMenu', title, options);

	consolePrint(title, true);

	var list = require('select-shell')(
	  /* possible configs */
	  {
	    pointer: ' ▸ ',
	    pointerColor: 'yellow',
	    checked: ' ◉  ',
	    unchecked:' ◎  ',
	    checkedColor: 'blue',
	    msgCancel: 'No selected options!',
	    msgCancelColor: 'orange',
	    multiSelect: false,
	    inverse: true,
	    prepend: true,
	    disableInput: true
	  }
	);

	for (var i = 0; i < options.length; i++) {
		var option = options[i];

		list.option(option);
	}

	list.on('select', function(options) {
		var option 	= options[0];
		var value 	= option.value;

		callback(value);
	});

	list.list();
}

function consolePrint(msg, breakLine=false) {
	console.log(msg);
	if(breakLine) {
		console.log('\n');
	}
}

function printAlbatroz() {
	var px = fs.readFileSync('albatroz.px', 'utf8');
	console.log(px);
}

function playSound() {
	musicPlayer.play('music.mp3', function(err){
	  if (err) throw err
	})
}

function stopSound() {

}

function bufferToString(buffer) {
	var buff = new Buffer(buffer, 'utf8'); //no sure about this
	var data = buff.toJSON().data;

	var str = '';

	for (var i = 0; i < data.length; i++) {
		var char = data[i];
		str += String.fromCharCode(char);
	}

	return str;
}




