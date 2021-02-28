'use strict'

// TODO : une classe outil qui permet de gérer simplement les span.
// Peut-être une liste de span ? Des méthodes du genre span.setRed() ou
// span.setCursorActive() ou des trucs du genre ?
class SpanManager {

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
    this.index = 1

    // Créé une première span vide
    // FIXME: la première span reste vide et le curseur ne s'affiche pas
    //        au clic dans la zone
    this.currentSpan = document.createElement('span')
    this.virtualInput.appendChild(this.currentSpan)
    
    // Permet le focus de la vrai zone d'input au clic sur la zone virtuelle,
    // ainsi que l'affichage d'un "curseur" (aka un span qui clignote)
    this.addEventListener('click', () => {
      this.realInput.focus()
      this.currentSpan.classList.add('cursor-blink')
    })
    this.addEventListener('focusout', () => {
      this.realInput.focusout()
      this.currentSpan.classList.remove('cursor-blink')
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
      if (['Shift', 'Backspace'].includes(c)) {
        return
      }

      // Créé un span qui contient le caractère frappé et l'ajoute à
      const span = document.createElement('span')
      span.innerHTML = c
      this.virtualInput.appendChild(span)
      
      // On "déplace" le "curseur". C'est un peu trop manuel, faudrait voir
      // si ça peut se gérere avec le SpanManager ou autre
      this.currentSpan.classList.remove('cursor-blink')
      this.currentSpan = this.virtualInput.children.item(this.index)
      this.currentSpan.classList.add('cursor-blink')
      this.index++
    })
  }

  // On ne peut pas ajouter un EventListener sur un VirtualUserInput. On veut
  // l'ajouter sur l'attribut "virtualInput". On redéfinit donc la méthode
  // addEventListener pour contourner (tout en héritant d'EventTarget).
  addEventListener (event, callback) {
    this.virtualInput.addEventListener(event, callback)
  }
}


// Représente le becnhmark et devrait extends quelque chose du genre
// AbtractDactyloTest. Elle aura son alter-ego Exercise qui implentera
// certaines choses différemment (à priori)
class Benchmark {
  constructor (text) {
    this.text = text
    this.textContainer = document.getElementById('text-container')
    this.virtualUserInput = new VirtualUserInput()

    // this.virtualUserInput.setLogic(...) <-- idéal...
    // ... mais voir problème de this non défini (ligne 43)
  }

  deploy () {
    this.textContainer.innerHTML = this.text
  }
}

const text = 'La philosophie est une démarche de réflexion critique et de questionnement sur le monde, la connaissance et l\'existence humaine. Elle existe depuis l\'Antiquité en Occident et en Orient, à travers la figure du philosophe, non seulement en tant qu\'activité rationnelle mais aussi comme mode de vie. L\'histoire de la philosophie permet d\'appréhender son évolution.'
const bench = new Benchmark(text)
bench.deploy()
