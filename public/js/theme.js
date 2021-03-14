'use strict'

class ThemeManager {
  constructor (theme) {
    this.current = theme
    this.button = document.getElementById('theme-switcher')
    this.icon = this.button.getElementsByTagName('i')[0]
    this.initialize(theme)
  }

  setCurrent (theme) {
    document.body.classList = theme
    this.current = theme
  }

  switchTheme () {
    console.log('switch')
    this.button.classList.toggle('blue-switcher')
    this.button.classList.toggle('red-switcher')
    this.icon.classList.toggle('fa-moon')
    this.icon.classList.toggle('fa-sun')
    this.setCurrent(this.current === 'light' ? 'dark' : 'light')
  }

  initialize (theme) {
    document.body.classList = theme
    this.button.classList.add(theme === 'dark' ? 'blue-switcher' : 'red-switcher')
    this.icon.classList.add(theme === 'dark' ? 'fa-moon' : 'fa-sun')
    this.button.addEventListener('click', () => {
      this.switchTheme()
    })
  }
}

// theme par defaut en argument du constructeur
const manager = new ThemeManager('dark')
