'use strict'

class ThemeManager {
  constructor (theme) {
    this.current = theme
    this.button = document.getElementById('theme-switcher')
    this.icon = this.button.getElementsByTagName('i')[0]
  }

  initialize () {
    document.body.classList = this.current
    this.button.classList.add(this.current === 'dark' ? 'blue-switcher' : 'red-switcher')
    this.icon.classList.add(this.current === 'dark' ? 'fa-moon' : 'fa-sun')
    this.button.addEventListener('click', () => {
      this.switchTheme()
    })
  }

  switchTheme () {
    this.button.classList.toggle('blue-switcher')
    this.button.classList.toggle('red-switcher')
    this.icon.classList.toggle('fa-moon')
    this.icon.classList.toggle('fa-sun')

    // Switch de thème
    let newTheme = ((this.current === 'light') ? 'dark' : 'light');
    // On actualise le cookie theme sur le thème choisi 
    setCookie('theme', newTheme)
    // On affiche le thème choisi
    this.setCurrent(newTheme)
  }

  setCurrent (theme) {
    document.body.classList = theme
    this.current = theme
  }
}

// Thème par defaut en argument du constructeur
let cookieTheme = getCookie('theme')

// Si un thème préféré est enregistré dans les cookies
// on le selectionne, sinon on affiche le thème light par défaut
if (cookieTheme) {
  new ThemeManager(cookieTheme).initialize()
} else {
  new ThemeManager('light').initialize()
}