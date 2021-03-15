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
          this.currSpanIndex -= 1
          this.inputZone.removeLast()
          this.model.delAt()
          this.inputZone.setCharAt('', this.model.getCursorIndex())
          this.inputZone.moveCursorLeft()
        }
      } else {
        this.inputZone.setCharAt(c, this.currSpanIndex)
        this.model.setLastInput(c)
        if (this.model.isLastInputCorrect()) {
          this.inputZone.spans[this.currSpanIndex].setColor('var(--light-fg)')
          if (c === ' ') {
            this.data.resetMis()
            this.data.addWordTime()
          }
        } else {
          this.inputZone.spans[this.currSpanIndex].setColor('var(--error)')
          if (!this.mis) {
            this.mis = true
            this.data.addMistake(this.model.getCurrWord())
          }
        }
        // Et on ajoute une nouvelle span curseur
        this.inputZone.insertLast('')
        this.inputZone.moveCursorRight()
        this.mis = false

        this.model.setLastInput(c)
        this.currSpanIndex += 1
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
