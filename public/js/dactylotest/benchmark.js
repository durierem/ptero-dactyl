'use strict'

import { DataManager } from './data-manager.js'
import { SpanManager } from './span-manager.js'
import { DactyloTestModel } from './dactylotest-model.js'

class Benchmark {
  constructor (referenceText) {
    this.referenceText = referenceText

    this.model = new DactyloTestModel(referenceText)
    this.data = new DataManager()
    this.textContainer = new SpanManager(document.getElementById('text-container'))
    this.inputZone = new SpanManager(document.getElementById('virtual-user-input'))
    this.initialize()
  }

  initialize () {
    for (const c of this.referenceText) {
      this.textContainer.insertLast(c)
    }

    this.mis = false
    this.currSpanIndex = 0
    this.inputZone.insertLast('')
    this.inputZone.moveCursorRight()

    this.inputZone.getElement().addEventListener('click', () => {
      this.inputZone.placeCursor(this.model.getCursorIndex())
      this.data.startTimer() // pas sur d'ici
      console.log(this.model.getCurrWord())
    })

    this.inputZone.getElement().addEventListener('keydown', (e) => {
      const c = e.key

      if (c === 'ArrowRight') {
        this.model.moveCursorRight()
        this.inputZone.moveCursorRight()
        return
      }

      if (c === 'ArrowLeft') {
        this.model.moveCursorLeft()
        this.inputZone.moveCursorLeft()
        return
      }

      if (!/Backspace|^.$/.test(c)) {
        return
      }

      if (c === 'Backspace') {
        if (this.inputZone.cursorIndex > 0) {
          this.inputZone.removeCharAt(this.model.getCursorIndex())
          this.model.delAt()
          this.inputZone.moveCursorLeft()
          if (!this.model.isUserTextValid()) {
            this.inputZone.getElement().style.backgroundColor = 'red'
          } else {
            this.inputZone.getElement().style.backgroundColor = 'white'
          }
        }
      } else {
        this.model.setLastInput(c)

        if (this.model.getCursorIndex() === this.model.maxCurdorIndex) {
          this.inputZone.setCharAt(c, this.model.getCursorIndex())
        } else {
          this.inputZone.insertCharAt(c, this.model.getCursorIndex())
        }

        if (this.model.isUserTextValid()) {
          if (this.model.canSetUserValidText()) {
            this.model.setUserValidText()
          }

          this.inputZone.getElement().style.backgroundColor = 'white'
          if (c === ' ') {
            this.data.resetMis()
            this.data.addWordTime()
          }
        } else {
          this.inputZone.getElement().style.backgroundColor = 'red'
          if (!this.mis) {
            this.mis = true
            this.data.addMistake(this.model.getCurrWord())
          }
        }
        // Et on ajoute une nouvelle span curseur
        this.inputZone.insertLast('')
        this.inputZone.moveCursorRight()
        this.mis = false
      }

      if (this.model.isFinished()) {
        this.data.addWordTime()
        console.log('THE END')
        console.log(this.data.getData())
      }
    })
  }
}

const text = 'Put all speaking, her69 speaking delicate recurred possible.'
const benchmark = new Benchmark(text)
