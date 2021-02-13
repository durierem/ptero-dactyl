'use strict'

/**
 * Définit un thème et ses 3 couleurs.
 */
function Theme (bgPrimary, bgSecondary, foreground) {
  this.bgPrimary = bgPrimary
  this.bgSecondary = bgSecondary
  this.foreground = foreground
}

/**
 * Met à jour les propriétés CSS de :root en fonction du thème donné.
 */
function setTheme (theme) {
  const root = document.documentElement
  root.style.setProperty('--light-bg-primary', theme.bgPrimary)
  root.style.setProperty('--light-bg-secondary', theme.bgSecondary)
  root.style.setProperty('--light-fg', theme.foreground)
}

// Les deux thèmes disponibles
const light = new Theme('#C7CCD1', '#FFFFFF', '#2D333B')
const dark = new Theme('#23232F', '#2B2B3B', '#F5F5F5')

// Thème par défaut à l'ouverture de l'application
let current = light

// Ajoute l'EventListener qui va bien :]
const switcher = document.getElementById('theme-switcher')
switcher.addEventListener('click', function () {
  const next = current === light ? dark : light
  setTheme(next)
  current = next
})
