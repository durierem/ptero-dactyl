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
          window.location.assign('/dactylotest/session?isFinished=true')
        }
      }
    })
  }
}

const defaultText = 'Put all'
let exercise = null
$(document).ready(() => {
  const target = '/api/get/new_exercise'
  $.get(target)
    .done((data) => {
      console.log(data)
      exercise = new Exercise(defaultText)
    })
    .fail(() => {
      console.log('Can\'t reach text database.')
      exercise = new Exercise(defaultText)
    })
})
