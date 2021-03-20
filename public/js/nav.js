function openNav() {
  document.getElementById("nav").style.width = '250px'
  document.body.style.marginLeft = '250px'
  setTimeout(function() {
    document.addEventListener('click', closeNav)
  }, 500)
}

function closeNav() {
  document.getElementById("nav").style.width = '0'
  document.body.style.marginLeft = '0'
  setTimeout(function() {
    document.removeEventListener('click', closeNav)
  }, 500)
}
