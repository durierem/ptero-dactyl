'use strict'

import { DataManager } from './data-manager.js'
import { SpanManager } from './span-manager.js'
import { DactyloTestModel } from './dactylotest-model.js'

class Benchmark {
  constructor (referenceText) {
    this.model = new DactyloTestModel(referenceText)
    this.data = new DataManager()
    this.textContainer = new SpanManager(document.getElementById('text-container'))
    this.inputZone = new SpanManager(document.getElementById('virtual-user-input'))
    this.firstInput = true
    this.isFocused = false
    this.isMouseOver = false
    this.isInputInhibited = true
    this.lastChar = ' '
    this.initialize()
  }

  initialize () {
    // On insère le texte de référence dans la zone qui lui est dédiée
    for (const c of this.model.getReferenceText()) {
      this.textContainer.insertLast(c)
    }

    this.handleFocus()

    this.inputZone.getElement().addEventListener('keydown', (e) => {
      if (this.firstInput) {
        this.data.startTimer()
      }

      const c = e.key

      // Bloque les touches spéciales (ArrowLeft, Escape, etc) et laisse
      // passer uniquement Backspace pour autoriser l'effacement.
      if (!/Backspace|^.$/.test(c)) {
        return
      }

      const currentUserText = () => { return this.model.getUserText() }

      if (c === 'Backspace') {
        if (currentUserText().length > 0) {
          this.model.deleteLastInput()
          this.inputZone.removeCharAt(currentUserText().length)
        }
      } else {
        if (this.firstInput) {
          this.firstInput = false
        } else {
          this.data.addKeyComb(this.lastChar, c)
        }
        console.log(this.lastChar + ' - ' + c)
        this.lastChar = c
        this.model.setLastInput(c)
        this.inputZone.insertCharAt(c, currentUserText().length - 1)

        if (!this.model.isUserTextValid()) {
          this.data.addMistake(this.model.getCurrWord())
        } else {
          const isEndOfWord = !/\d|\w/.test(this.model.getReferenceText()
            .charAt(currentUserText().length))
          console.log(isEndOfWord,
            this.model.getReferenceText()
              .charAt(currentUserText().length))
          if (isEndOfWord) {
            this.data.resetMis()
            this.data.addWordTime()
            this.model.setCurrentWord()
          }
        }
      }

      if (this.model.isUserTextValid()) {
        this.inputZone.getElement().style.backgroundColor = 'var(--light-bg-secondary)'
      } else {
        this.inputZone.getElement().style.backgroundColor = 'var(--error)'
      }

      if (this.model.isFinished()) {
        console.log(this.data.getData())
        sessionStorage.setItem('dataB', this.data.getData())
        sessionStorage.setItem('dataS', JSON.stringify(this.data.getData()))

        /*
         * Se sert des variable de sessions pour deduire combien de
         * benchmark l'utilisateur doit faire et faire suivre les donnees
         * jusqu'a la sauvegarde
         */
        // Premier benchmark on cree les donnees
        if (sessionStorage.getItem('order') === null) {
          sessionStorage.setItem('order', 1)
          const data = this.data.getData()
          sessionStorage.setItem('bench', JSON.stringify(data))
          location.assign('/dactylotest/exercise')
          // 2e benchmark on ajoute des donnees
        } else if (sessionStorage.getItem('order') === 1) {
          sessionStorage.setItem('order', 2)
          const prevData = JSON.parse(sessionStorage.getItem('bench'))
          const jason = {
            bench1: prevData,
            bench2: this.data.getData()
          }
          sessionStorage.setItem('bench', JSON.stringify(jason))
          location.assign('/dactylotest/exercise')
          // 3e benchmark on ajoute les dernieres donnees et on envoie en bdd
        } else {
          sessionStorage.removeItem('order')
          const jason = JSON.parse(sessionStorage.getItem('bench'))
          jason.bench3 = this.data.getData()
          const target = '/dactylotest/save'
          $.post(target, { data: JSON.stringify(jason) })
            .fail((data) => {
              console.log('Couldn\'t save data: ' + data)
            })
        }
        location.assign('/dactylotest/session')
      }
    })
  }

  handleFocus () {
    this.inputZone.getElement().addEventListener('mouseenter', () => {
      this.isMouseOver = true
    })
    this.inputZone.getElement().addEventListener('mouseleave', () => {
      this.isMouseOver = false
    })

    document.body.addEventListener('click', () => {
      if (this.isMouseOver) {
        if (this.firstInput) {
          this.inputZone.insertLast('')
        }
        this.inputZone.placeCursor(this.model.getUserText().length)
      } else {
        this.inputZone.removeCursor()
        this.isInputInhibited = false
      }
    })
  }
}

const defaultText = 'Put all speaking, her69 speaking delicate recurred possible.'
let benchmark = null
$(document).ready(() => {
  const target = '/get/rdm_text'
  $.get(target)
    .done((data) => {
      // benchmark = new Benchmark(data)
      benchmark = new Benchmark(defaultText)
    })
    .fail(() => {
      console.log('Can\'t reach text database.')
      benchmark = new Benchmark(defaultText)
    })
})
