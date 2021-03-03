'use strict'


// Définition de la méthode top() sur les tableaux
Array.prototype.top = function () {
  return this[this.length - 1]
}

// -------------------------------------------------------------------------- //

// Une SpanObject est l'encapsulation Objet d'un objet HTML span. 
// Une SpanObject est ratachée à un conteneur de span donné par container.
// Une SpanObject contiendra 1 caractère donné par char. Ce caratctère est modifiable.
class SpanObject {
  constructor (container, char, cursor=false) {
    this.container = container
    this.char = char

    this.element = document.createElement('span')
    this.innerHTML = this.element.innerHTML
    this.element.innerText = char
    container.appendChild(this.element)

    if (cursor) {
      this.setCursor(true)
    }
  }

  getChar () {
    return this.char
  }

  getColor () {
    return this.element.style.color
  }

  setChar (char) {
    this.char = char
    this.element.innerText = char
  }

  setColor (color) {
    this.element.style.color = color
  }

  setCursor (bool) {
    if (bool) {
      this.element.classList.add('cursor-blink')
    } else {
      this.element.classList.remove('cursor-blink')
    }
  }

  detach() {
    this.container.removeChild(this.element)
  }
}

// -------------------------------------------------------------------------- //

class SpanManager {
  constructor (parentNode) {
    this.parentNode = parentNode
    this.spans = []
    this.spanList = parentNode.children
    this.cursorIndex = -1

    // Première span qui sert de curseur.
    this.parentNode.appendChild(document.createElement('span'))
  }

  append (span) {
    this.spans.push(span)
  }

  insertLast (value) {
    this.append(new SpanObject(this.parentNode, value))
  }

  removeLast () {
    this.spans.pop().detach()
  }

  setCharAt (char, index) {
    this.spans[index].setChar(char)
  }

  getCursorIndex () {
    return this.cursorIndex
  }

  placeCursor (index) {
    if (index < 0 || index >= this.spans.length) { return }
    this.spans[index].setCursor(true)
    this.cursorIndex = index
  }

  removeCursor () {
    if (this.cursorIndex < 0 || this.cursorIndex >= this.spans.length) { return }
    this.spans[this.cursorIndex].setCursor(false)
    // No cursor on the text => cursorIndex === -1
    this.cursorIndex = -1
  }

  moveCursorRight () {
    const index = this.cursorIndex + 1
    this.removeCursor()
    this.placeCursor(index)
  }

  moveCursorLeft () {
    if (this.cursorIndex === 0) { return }
    const index = this.cursorIndex - 1
    this.removeCursor()
    this.placeCursor(index)
  }
}

// -------------------------------------------------------------------------- //


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

    this.spanManager.insertLast('')
    this.currSpanIndex = 0
    
    // Permet le focus de la vrai zone d'input au clic sur la zone virtuelle,
    // ainsi que l'affichage d'un "curseur" (aka un span qui clignote)
    this.addEventListener('click', () => {
      this.realInput.focus()
      this.spanManager.placeCursor(this.currSpanIndex)
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

      // Esquive les caractères spéciaux du type "Control", "Escape", etc.
      // Laisse passer "Backspace" uniquement pour autoriser l'effacement.
      if (!/Backspace|^.$/.test(c)) {
        return
      }

      // Une span curseur est définie comme une span sans caractère possèdant la classe curseur
      if (c === 'Backspace') {
        // Si la touche 'effacer' est pressée et qu'il y au moin 1 caractère avant le curseur...
        if (this.spanManager.cursorIndex > 0) {
          --this.currSpanIndex
          // ...on retire la span curseur actuel du conteneur...
          this.spanManager.removeLast()
          // ...puis on remplace la span d'avant par un span curseur.
          this.spanManager.setCharAt('', this.currSpanIndex)
          this.spanManager.moveCursorLeft()
        }
      } else {
        // Sinon on attribut le caractère tapé au span curseur. 
        this.spanManager.setCharAt(c, this.currSpanIndex)
        // Et on ajoute une nouvelle span curseur
        this.spanManager.insertLast('')
        this.spanManager.moveCursorRight()

        // Si un mauvais caractère à été tapé on colorie la span en rouge
        if (c != text.charAt(this.currSpanIndex)) {
          this.spanManager.spans[this.currSpanIndex].setColor('red')
        } else {
          this.spanManager.spans[this.currSpanIndex].setColor('white')
        }

        ++this.currSpanIndex
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

// -------------------------------------------------------------------------- //

class AbstractDactyloTest {
  constructor (text) {
    this.text = text
    this.textContainer = document.getElementById('text-container')
    this.virtualUserInput = new VirtualUserInput()
  }
}

// -------------------------------------------------------------------------- //

class Benchmark extends AbstractDactyloTest {
  constructor (text) {
    super(text)
    this.spanManager = new SpanManager(this.textContainer)
  }

  deploy () {
    for (let c of this.text) {
      this.spanManager.insertLast(c)
    }
  }
}

// -------------------------------------------------------------------------- //

class Exercise extends AbstractDactyloTest {
  constructor (text) {
    // ...
  }

  deploy () {
    // ...
  }
}

// -------------------------------------------------------------------------- //

const text = 'La philosophie est une démarche de réflexion critique et de questionnement sur le monde, la connaissance et l\'existence humaine. Elle existe depuis l\'Antiquité en Occident et en Orient, à travers la figure du philosophe, non seulement en tant qu\'activité rationnelle mais aussi comme mode de vie. L\'histoire de la philosophie permet d\'appréhender son évolution.'
new Benchmark(text).deploy()
