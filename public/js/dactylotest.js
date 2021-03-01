'use strict'

class SpanManager {
  constructor (parentNode) {
    this.parentNode = parentNode
    this.spanList = parentNode.children
    this.cursorIndex = 0

    // Première span qui sert de curseur.
    this.parentNode.appendChild(document.createElement('span'))
  }

  append (innerHTML) {
    const span = document.createElement('span')
    span.innerHTML = innerHTML
    this.parentNode.appendChild(span)
  }

  insertLast (value) {
    this.spanList[this.spanList.length - 1].innerHTML = value
    this.append('')
  }

  removeLast () {
    const nodeToRemove = this.spanList[this.spanList.length - 1]
    this.parentNode.removeChild(nodeToRemove)
    this.spanList[this.spanList.length - 1].innerHTML = ''
  }

  setCursor (index = this.cursorIndex) {
    this.spanList[index].classList.add('cursor-blink')
    this.cursorIndex = index
  }

  removeCursor () {
    this.spanList[this.cursorIndex].classList.remove('cursor-blink')
  }

  moveCursorRight () {
    this.removeCursor()
    this.setCursor(this.cursorIndex + 1)
  }

  moveCursorLeft () {
    this.removeCursor()
    this.setCursor(this.cursorIndex - 1)
  }
}

// On gère la partie input dans cette classe qui gère l'input réél "user-input"
// (qui sera caché à terme) et l'input virtuel "virtual-user-input" qui nous
// permet de gérer plus finement l'affichage caractère par caractère (ce qui
// sembble impossible avec un <textarea> de base)
class VirtualUserInput extends EventTarget {
  constructor () {
    super()

    // Initialisation des attributs
    this.realInput = document.getElementById('user-input')
    this.virtualInput = document.getElementById('virtual-user-input')
    this.spanManager = new SpanManager(this.virtualInput)
    
    // Permet le focus de la vrai zone d'input au clic sur la zone virtuelle,
    // ainsi que l'affichage d'un "curseur" (aka un span qui clignote)
    this.addEventListener('click', () => {
      this.realInput.focus()
      this.spanManager.setCursor()
    })
    this.addEventListener('focusout', () => {
      this.realInput.focusout()
      this.spanManager.removeCursor()
    })

    // Cœur de la logique.
    // Puisque l'autre dactylotest devra apporter des modifications ici,
    // on peut imaginer une méthode setLogic(fun) qui attends en argument le
    // code cible de l'EventListener. Mais le problème de "this" se pose alors:
    // this.virtualInput n'est pas défini en dehors de cette classe. J'avoue
    // je sais pas ce qu'il faudrait faire...
    this.realInput.addEventListener('keydown', (e) => {
      const c = e.key

      // Faut tester avec une regexp plutôt que de tester tous les caractères
      // potentiels qui vont pas (arrows, escape, alt, caps, ...)
      if (['Shift'].includes(c)) {
        return
      }

      if (c === 'Backspace') {
        if (this.spanManager.cursorIndex > 0) {
          this.spanManager.moveCursorLeft()
          this.spanManager.removeLast()
        }
      } else {
        this.spanManager.insertLast(c)
        this.spanManager.moveCursorRight()
      }
    })
  }

  // On ne peut pas ajouter un EventListener sur un VirtualUserInput. On veut
  // l'ajouter sur l'attribut "virtualInput". On redéfinit donc la méthode
  // addEventListener pour contourner (tout en héritant d'EventTarget).
  addEventListener (event, callback) {
    this.virtualInput.addEventListener(event, callback)
  }
}

class AbstractDactyloTest {
  constructor (text) {
    this.text = text
    this.textContainer = document.getElementById('text-container')
    this.virtualUserInput = new VirtualUserInput()
  }
}

class Benchmark extends AbstractDactyloTest {
  constructor (text) {
    super(text)
    this.spanManager = new SpanManager(this.textContainer)
  }

  deploy () {
    for (let c of this.text) {
      this.spanManager.append(c)
    }

    const manager = new SpanManager(this.textContainer)
    manager.setCursor(0)
    this.virtualUserInput.addEventListener('keydown', () => {
      manger.removeCursor()
      manager.setCursor(this.virtualUserInput.spanManager.cursorIndex)
    })
  }
}

class Exercise extends AbstractDactyloTest {
  constructor (text) {
    // this.virtualUserInput.setLogic(function () {
    //   // logique pour les exercices
    // })
  }
}

const text = 'La philosophie est une démarche de réflexion critique et de questionnement sur le monde, la connaissance et l\'existence humaine. Elle existe depuis l\'Antiquité en Occident et en Orient, à travers la figure du philosophe, non seulement en tant qu\'activité rationnelle mais aussi comme mode de vie. L\'histoire de la philosophie permet d\'appréhender son évolution.'
new Benchmark(text).deploy()
