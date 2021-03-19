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
    this.lastChar = ' '
    this.initialize()
  }

  initialize () {
    // On insère le texte de référence dans la zone qui lui est dédiée
    for (const c of this.model.getReferenceText()) {
      this.textContainer.insertLast(c)
    }

    this.inputZone.getElement().addEventListener('click', () => {
      this.inputZone.insertLast('') // Première span...
      this.inputZone.placeCursor(0) // ... qui sert de curseur
    })

    this.inputZone.getElement().addEventListener('keydown', (e) => {
      if (this.firstInput) {
        this.data.startTimer()
        this.firstInput = false
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
          const jason = {bench1: prevData,
                         bench2: this.data.getData()}
          sessionStorage.setItem('bench', JSON.stringify(jason))
          location.assign('/dactylotest/exercise')
        // 3e benchmark on ajoute les dernieres donnees et on envoie en bdd
        } else {
          sessionStorage.removeItem('order')
          let jason = JSON.parse(sessionStorage.getItem('bench'))
          jason.bench3 = this.data.getData()
          const target = '/dactylotest/save'
          $.post(target, { data: JSON.stringify(jason) })
            .fail((data) => {
              console.log('Couldn\'t save data: ' + data)
            })
        }
      }
    })
  }
}

const defaultText = 'Put all speaking, her69 speaking delicate recurred possible.'
let benchmark = null
$(document).ready(() => {
  let target = '/text/random'
  let prevIds = JSON.parse(sessionStorage.getItem('prev'))
  $.post(target, { bDone: JSON.stringify(prevIds) })
    .done((data) => {
      if (prevIds === null) {
        prevIds = {b1: data.id}
        sessionStorage.setItem('prev', JSON.stringify(prevIds))
      } else if (prevIds.b2 === null){
        prevIds.b2 = data.id
        sessionStorage.setItem('prev', JSON.stringify(prevIds))
      } else {
        sessionStorage.removeItem('prev')
      }
      //benchmark = new Benchmark(data.text)
      benchmark = new Benchmark(defaultText)
    })
    .fail(() => {
      console.log('Can\'t reach text database.')
      benchmark = new Benchmark(defaultText)
    })
})
