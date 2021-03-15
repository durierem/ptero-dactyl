'use strict'

import { DataManager } from './data-manager.js'
import { SpanManager } from './span-manager.js'
import { DactyloTestModel } from './dactylotest-model.js'

// Exercise: Insere slmt les caracteres s'ils sont corrects,
//  rouge: erreur / normal: bon
class Exercise {
  constructor (referenceText) {
    this.data = new DataManager()
    this.model = new DactyloTestModel(referenceText)
    this.textContainer = new SpanManager(document.getElementById('text-container'))
    this.inputZone = new SpanManager(document.getElementById('virtual-user-input'))
    this.mis = false
    this.firstInput = true
    this.initialize()
  }

  initialize () {
    for (const c of this.model.getReferenceText()) {
      this.textContainer.insertLast(c)
    }

    this.inputZone.insertLast('')
    this.currSpanIndex = this.model.getCursorIndex()

    this.inputZone.getElement().addEventListener('click', () => {
      this.inputZone.placeCursor(this.model.getCursorIndex())
    })

    this.inputZone.getElement().addEventListener('keydown', (e) => {
      if (this.firstInput) {
        this.data.startTimer()
        this.firstInput = false
      }

      const c = e.key

      if (!/^.$/.test(c)) {
        return
      }

      if (!this.model.isInputCorrect(c)) {
        if (!this.mis) {
          this.mis = true
          this.data.addMistake(this.model.getCurrWord())
        }
        this.data.incFalseChar()
      } else {
        if (!/\w|\d/.test(c)) {
          this.data.resetMis()
          this.data.addWordTime()
        }
        // on ajoute le caractere avec la bonne couleur
        this.inputZone.setCharAt(c, this.model.getCursorIndex())
        this.inputZone.spans[this.model.getCursorIndex()].setColor(this.mis
          ? 'var(--error)'
          : 'var(--light-fg)')
        this.mis = false
        // on avance le curseur
        this.inputZone.insertLast('')
        this.inputZone.moveCursorRight()
        // on met a jour le modele
        this.model.setLastInput2(c)
        if (this.model.isFinished()) {
          this.data.stopTimer()
          console.log('FINISHED!', this.data.getData())
          this.data.sendData()
        }
      }
    })
  }
}

const text = 'Put all speaking, her69 speaking delicate recurred possible.'
const benchmark = new Exercise(text)
