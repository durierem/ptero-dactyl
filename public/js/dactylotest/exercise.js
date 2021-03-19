'use strict'

import { SpanManager } from './span-manager.js'
import { DactyloTestModel } from './dactylotest-model.js'

class Exercise {
  constructor (referenceText) {
    this.model = new DactyloTestModel(referenceText)
    this.textContainer = new SpanManager(document.getElementById('text-container'))
    this.inputZone = new SpanManager(document.getElementById('virtual-user-input'))
    // cette variable servira de memoire pour savoir de quelle couleur
    // on doit afficher le caractere que l'on insere
    this.mis = false
    this.initialize()
  }

  initialize () {
    // On insère le texte de référence dans la zone qui lui est dédiée
    for (const c of this.model.getReferenceText()) {
      this.textContainer.insertLast(c)
    }

    this.inputZone.getElement().addEventListener('click', () => {
      this.inputZone.insertLast('')
      this.inputZone.placeCursor(0)
    })

    this.inputZone.getElement().addEventListener('keydown', (e) => {

      const c = e.key

      if (!/^.$/.test(c)) {
        return
      }

      const lastCharIndex = () => { return this.model.getUserTextLength() - 1 }

      if (!this.model.isInputCorrect(c)) {
        this.mis = true
      } else {
        // on ajoute le caractere avec la bonne couleur
        // 'mis' defini la couleur: si l'utilisateur a fait une faute a cet
        // endroit on l'affiche comme une erreur
        this.model.setLastInput(c)
        this.inputZone.insertCharAt(c, lastCharIndex())
        this.inputZone.spans[lastCharIndex()].setColor(this.mis
                 ? 'var(--error)'
                 : 'var(--light-fg)')
        this.mis = false

        /*
         * ici on controle ou en est l'utilisateur dans la chaine des tests
         * on le renvoie donc soit vers un autre exercice, soit vers le
         * benchmark suivant
         */
        if (this.model.isFinished()) {
          console.log('FINISHED')
          if (sessionStorage.getItem('redo') === null) {
            sessionStorage.setItem('redo', 'ayaya')
            location.reload()
          } else {
            sessionStorage.removeItem('redo')
            sessionStorage.removeItem('currentEx')
            location.assign('/dactylotest/benchmark')
          }
        }
      }
    })
  }
}


const defaultText = 'Put all speaking, her69 speaking delicate recurred possible.'
let exercise = null
$(document).ready(() => {
  let target = '/exercise/getone'
  // premier essai
  if (sessionStorage.getItem('currentEx') === null) {
    let last = sessionStorage.getItem('last')
    $.post(target, {last: last})
      .done((data) => {
        // ex 1/2
        if (last === null) {
          let jason = sessionStorage.getItem('bench')
          jason.ex1 = data.tag
          sessionStorage.setItem('bench', jason)
          sessionStorage.setItem('last', data.tag)
        // ex 2/2
        } else {
          sessionStorage.removeItem('last')
          let jason = sessionStorage.getItem('bench')
          jason.ex2 = data.tag
          sessionStorage.setItem('bench', jason)
        }
        sessionStorage.setItem('currentEx', data.content)
        exercise = new Exercise(defaultText)
      })
      .fail(() => {
        console.log('Can\'t reach text database.')
        exercise = new Exercise(defaultText)
      })
  // deuxieme essai
  } else {
    //exercise = new Exercise(sessionStorage.getItem('currentEx'))
    exercise = new Exercise(defaultText)
  }
})

