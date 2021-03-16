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

    this.lastChar = ' '
    this.mis = false
    this.currSpanIndex = 0
    this.inputZone.insertLast('')
    this.inputZone.moveCursorRight()

    this.inputZone.getElement().addEventListener('click', () => {
      this.inputZone.placeCursor(this.model.getCursorIndex() + 1)
      this.data.startTimer() // pas sur d'ici
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
        console.log('---')
        console.log(this.model.getCurrWord())

        if (this.model.getCursorIndex() === this.model.maxCurdorIndex) {
          this.inputZone.setCharAt(c, this.model.getCursorIndex())
        } else {
          this.inputZone.insertCharAt(c, this.model.getCursorIndex())
        }

        if (this.model.isUserTextValid()) {
          if (this.model.canSetUserValidText()) {
            this.model.setUserValidText()
            if (c === ' ') {
              this.data.resetMis()
              this.data.addWordTime()
            }
            console.log('--data--')
            console.log(c.toLowerCase())
            console.log(this.lastChar)
            this.data.addKeyComb(this.lastChar,c.toLowerCase())
            this.lastChar = c.toLowerCase()
          }
          this.inputZone.getElement().style.backgroundColor = 'white'
        } else {
          this.inputZone.getElement().style.backgroundColor = 'red'
          if (!this.mis) {
            this.mis = true
            this.data.addMistake(this.model.getCurrWord())
          }
        }
        // Et on ajoute une nouvelle span curseur
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

const text = "La grotte d’Aguzou s'ouvre sur le flanc nord-ouest du pic d'Aguzou. Elle se situe dans le département de l'Aude, aux confins de l'Ariège, entre les villes d'Axat et d'Usson, au sud de Quillan, sur la commune de Escouloubre."
const benchmark = new Benchmark(text)
