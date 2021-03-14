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
    console.log('switch')
    this.button.classList.toggle('blue-switcher')
    this.button.classList.toggle('red-switcher')
    this.icon.classList.toggle('fa-moon')
    this.icon.classList.toggle('fa-sun')
    this.setCurrent(this.current === 'light' ? 'dark' : 'light')
  }

  setCurrent (theme) {
    document.body.classList = theme
    this.current = theme
  }
}

// Thème par defaut en argument du constructeur
new ThemeManager('dark').initialize()
