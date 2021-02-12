window.addEventListener('keydown', getkeyAndRefreshOutput, true)

function getkeyAndRefreshOutput (event) {
  if (stopped) {
    chronoReset()
    chronoStart()
  }
  const str = `KeyboardEvent: { key: '${event.key}', code: '${event.code}' } ` +
    `| time: '${document.getElementById('chronotime').value}`
  const el = document.createElement('span')
  el.innerHTML = str + '<br/>'
  let outputContainer = document.getElementById('output-container')
  outputContainer.appendChild(el)
  outputContainer.scrollTo(0, outputContainer.scrollHeight);
}

let start = 0
let timerID = 0
let stopped = true

function chrono () {
  let end = 0
  let diff = 0
  end = new Date()
  diff = end - start
  diff = new Date(diff)
  let msec = diff.getMilliseconds()
  let sec = diff.getSeconds()
  let min = diff.getMinutes()
  const hr = diff.getHours() - 1
  if (min < 10) {
    min = '0' + min
  }
  if (sec < 10) {
    sec = '0' + sec
  }
  if (msec < 10) {
    msec = '00' + msec
  } else if (msec < 100) {
    msec = '0' + msec
  }
  document.getElementById('chronotime').value = hr + ':' + min + ':' + sec + ':' + msec
  timerID = setTimeout(chrono, 10)
}
function chronoStart () {
  stopped = false
  document.chronoForm.startstop.value = 'stop!'
  document.chronoForm.startstop.onclick = chronoStop
  start = new Date()
  chrono()
}

function chronoReset () {
  document.getElementById('chronotime').value = '0:00:00:000'
  document.chronoForm.startstop.value = 'start!'
  document.chronoForm.startstop.onclick = chronoStart
  document.getElementById('output-container').innerHTML = ''
}

function chronoStop () {
  stopped = true
  document.chronoForm.startstop.value = 'reset!'
  document.chronoForm.startstop.onclick = chronoReset
  clearTimeout(timerID)
}

const startButton = document.getElementById('start-button')
const testContainer = document.getElementById('test-container')
startButton.addEventListener('click', function () {
  startButton.classList.add('hidden')
  testContainer.classList.remove('hidden')
})
