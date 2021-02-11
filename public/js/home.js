window.addEventListener("keydown", function(event) {
    if (stopped) {
        chronoStart();
    }
    let str = "KeyboardEvent: key='" + event.key + "' | code='" +
                event.code + "'  time: " + document.getElementById("chronotime").value;
    let el = document.createElement("span");
    el.innerHTML = str + "<br/>";
    
    document.getElementById("output").appendChild(el);
    }, true);



var start = 0
var timerID = 0
var stopped = true;

function chrono(){
    var end = 0
    var diff = 0
	end = new Date()
	diff = end - start
	diff = new Date(diff)
	var msec = diff.getMilliseconds()
	var sec = diff.getSeconds()
	var min = diff.getMinutes()
	var hr = diff.getHours()-1
	if (min < 10){
		min = "0" + min
	}
	if (sec < 10){
		sec = "0" + sec
	}
	if(msec < 10){
		msec = "00" +msec
	}
	else if(msec < 100){
		msec = "0" +msec
	}
	document.getElementById("chronotime").value = hr + ":" + min + ":" + sec + ":" + msec
	timerID = setTimeout("chrono()", 10)
}
function chronoStart(){
    stopped = false;
	document.chronoForm.startstop.value = "stop!"
	document.chronoForm.startstop.onclick = chronoStop
	start = new Date()
	chrono()
}

function chronoReset() {
    document.getElementById("chronotime").value = "0:00:00:000";
    document.chronoForm.startstop.value = "start!";
    document.chronoForm.startstop.onclick = chronoStart;
    document.getElementById("output").innerHTML = "";
}

function chronoStop(){
    stopped = true;
	document.chronoForm.startstop.value = "reset!";
	document.chronoForm.startstop.onclick = chronoReset;
	clearTimeout(timerID);
}