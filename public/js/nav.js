function openNav () {
  document.getElementById('nav').style.width = '250px'
  document.getElementById('nav-opener').innerHTML = '<i class="bi bi-dash"></i> Fermer'
  document.getElementById('nav-opener').style.backgroundColor = 'var(--dark-bg-secondary)'
  setTimeout(function () {
    document.addEventListener('click', closeNav)
  }, 1)
}

function closeNav () {
  document.getElementById('nav').style.width = '0'
  document.getElementById('nav-opener').innerHTML = '<i class="bi bi-list"></i> Menu'
  document.getElementById('nav-opener').style.backgroundColor = 'var(--dark-bg-primary)'
  setTimeout(function () {
    document.removeEventListener('click', closeNav)
  }, 1)
}
