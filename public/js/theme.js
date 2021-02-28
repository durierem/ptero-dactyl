'use strict'

class ThemeManager {
  constructor () {
    this.current = undefined
  }

  setCurrent (theme) {
    document.body.classList = theme
    this.current = theme
  }
}

const manager = new ThemeManager()
manager.setCurrent('dark')

const button = document.getElementById('theme-switcher')
button.addEventListener('click', () => {
  if (manager.current === 'light') {
    manager.setCurrent('dark')
    button.classList.remove('red-switcher')
    button.classList.add('blue-switcher')
  } else {
    manager.setCurrent('light')
    button.classList.remove('blue-switcher')
    button.classList.add('red-switcher')
  }
})
