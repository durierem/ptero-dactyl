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
manager.setCurrent('light')

const button = document.getElementById('theme-switcher')
button.addEventListener('click', () => {
  if (manager.current === 'light') {
    manager.setCurrent('dark')
  } else {
    manager.setCurrent('light')
  }
})
