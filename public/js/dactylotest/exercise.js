/* global $ */

'use strict'

import { AbstractDactylo } from './abstractdactylo.js'

class Exercise extends AbstractDactylo {
  constructor (referenceText) {
    super(referenceText)
    super.inheritor = this
    // Le dernier caractère tapé est correct ou érroné
    this.mistake = false
  }

  onLoad () {
    // On insère le texte de référence dans la zone qui lui est dédiée
    for (const c of this.model.getReferenceText()) {
      this.textContainer.insertLast(c)
    }
  }

  handleInput (e) {
    const c = e.key

    if (!/^.$/.test(c)) {
      return
    }

    if (!this.model.isInputCorrect(c)) {
      this.mistake = true
    } else {
      // On ajoute le caractère avec la bonne couleur
      this.model.setLastInput(c)
      this.inputZone.insert(c)
      this.inputZone.getSpanAt().setColor(this.mistake ? 'var(--error)' : 'var(--light-fg)')
      this.mistake = false
    }
  }

  isFinished () {
    return this.model.isFinished()
  }

  onFinish () {
    this.inputZone.getElement().innerHTML = 'FINI'
    console.log('FINI')
    window.location.assign('/dactylotest/session?isFinished=true')
  }

  onFocus () { }

  onBlur () { }
}

// ---------------------------------------------------------------------------//

// Exercice a utiliser par défaut en cas de problème pour joindre la
// base de données
const defaultText = 'lle lle lle lle lle lle lle lle lle lle'

$(document).ready(() => {
  const target = '/api/get/new_exercise'
  $.get(target)
    .done((data) => {
        document.getElementById('tag').innerText = data['tag']
        new Exercise(data['content']).start()
    })
    .fail(() => {
      console.log('Can\'t reach text database.')
      document.getElementById('tag').innerText = 'trigramme'
      new Exercise(defaultText).start()
    })
})
