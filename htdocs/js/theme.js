'use strict'

import * as cookie from './cookie.js'

class ThemeManager {
  constructor (theme) {
    this.current = theme
    this.button = document.getElementById('theme-switcher')
    this.icon = this.button.getElementsByTagName('i')[0]
  }

  /**
   * Initialise le theme en mettant les composants html a jour
   */
  initialize () {
    document.body.classList = this.current
    this.button.classList.add(this.current === 'dark' ? 'blue-switcher' : 'red-switcher')
    this.icon.classList.add(this.current === 'dark' ? 'bi-moon-fill' : 'bi-sun-fill')
    this.button.addEventListener('click', () => {
      this.switchTheme()
    })
  }

  /**
   * Change de theme et met a jour le cookie pour qu'il persiste
   */
  switchTheme () {
    this.button.classList.toggle('blue-switcher')
    this.button.classList.toggle('red-switcher')
    this.icon.classList.toggle('bi-moon-fill')
    this.icon.classList.toggle('bi-sun-fill')

    const newTheme = ((this.current === 'light') ? 'dark' : 'light')
    cookie.setCookie('theme', newTheme)
    this.setCurrent(newTheme)
  }

  setCurrent (theme) {
    document.body.classList = theme
    this.current = theme
  }
}

// Thème par defaut en argument du constructeur
const cookieTheme = cookie.getCookie('theme')

// Si un thème préféré est enregistré dans les cookies
// on le selectionne, sinon on affiche le thème light par défaut
if (cookieTheme) {
  new ThemeManager(cookieTheme).initialize()
} else {
  new ThemeManager('light').initialize()
}
