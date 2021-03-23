function openNav () {
  document.getElementById('nav').style.width = '225px'
  document.getElementById('nav-opener').classList.add('nav-opener-active')
  document.getElementById('nav-opener-text').classList.add('nav-opener-text-active')
  document.getElementById('nav-opener-text').innerHTML = 'Fermer'
  setTimeout(() => {
    document.getElementById('header').addEventListener('click', closeNav)
    document.getElementById('main-content-container').addEventListener('click', closeNav)
  }, 1)
}

function closeNav () {
  document.getElementById('nav').style.width = '0'
  document.getElementById('nav-opener').classList.remove('nav-opener-active')
  document.getElementById('nav-opener-text').classList.remove('nav-opener-text-active')
  document.getElementById('nav-opener-text').innerHTML = 'Menu'
  setTimeout(() => {
    document.getElementById('header').removeEventListener('click', closeNav)
    document.getElementById('main-content-container').removeEventListener('click', closeNav)
  }, 1)
}
