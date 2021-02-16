'use strict'

/**
 * Représente un thème de couleur.
 *
 * Un thème de couleur est composé de deux couleurs d'arrière plan et d'une
 * couleur de premier plan.
 * On peut imaginer étendre cette spécification à une sélection de variables
 * CSS trouvées dans la pseudo-classe :root (public/css/components.css).
 */
class Theme {
  constructor (bgPrimary, bgSecondary, foreground) {
    this.bgPrimary = bgPrimary
    this.bgSecondary = bgSecondary
    this.foreground = foreground
  }
}

/**
 * Représente un sélectionneur de thème.
 *
 * Les thèmes disponibles pour un sélectionneur sont définis à l'instanciation.
 */
class ThemeSwitcher {
  constructor (themes, current) {
    this.themes = themes
    if (current === undefined) {
      this.current = themes[Object.keys(themes)[0]]
    } else {
      this.current = current
    }
  }

  apply (theme) {
    const root = document.documentElement
    root.style.setProperty('--light-bg-primary', theme.bgPrimary)
    root.style.setProperty('--light-bg-secondary', theme.bgSecondary)
    root.style.setProperty('--light-fg', theme.foreground)
    this.current = theme
  }
}

// Construit un nouveau sélectionneur de thème avec les thèmes disponibles
const switcher = new ThemeSwitcher({
  'light': new Theme('#C7CCD1', '#FFFFFF', '#2D333B'),
  'dark': new Theme('#23232F', '#2B2B3B', '#F5F5F5')
  // Si vous voulez vous amuser à ajouter d'autres thèmes farfelus...
})
switcher.apply(switcher.themes['dark'])

// Ajoute l'EventListener qui va bien :]
const button = document.getElementById('theme-switcher')
button.addEventListener('click', () => {
  if (switcher.current === switcher.themes['light']) {
    switcher.apply(switcher.themes['dark'])
  } else {
    switcher.apply(switcher.themes['light'])
  }
})
