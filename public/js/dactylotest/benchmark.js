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
          if (!/\d|\w/.test(c)) {
            this.data.addWordTime()
          }
        }

        // On reset le mis (à voir avec Rémi le truc du mis me perturbe un peu)
        this.wordAlreadyEncountered = false
      }

      if (this.model.isUserTextValid()) {
        this.inputZone.getElement().style.backgroundColor = 'var(--light-bg-secondary)'
      } else {
        this.inputZone.getElement().style.backgroundColor = 'var(--red)'
      }

      // si userText === referenceText c'est la fin !
      if (this.model.isFinished()) {
        this.data.addWordTime()
        console.log(this.data.getData())

        /*
         * se sert des variable de sessions pour deduire combien de
         * benchmark l'utilisateur doit faire et faire suivre les donnees
         * jusqu'a la sauvegarde
         */
        if (sessionStorage.getItem('order') === null) {
          sessionStorage.setItem('order', 1)
          const data = this.data.getData()
          sessionStorage.setItem('bench', JSON.stringify(data))
          location.assign('/dactylotest/exercise')
        } else if (sessionStorage.getItem('order') === 1) {
          sessionStorage.setItem('order', 2)
          let prevData = JSON.parse(sessionStorage.getItem('bench'))
          const jason = {bench1: prevData,
                       bench2: this.data.getData()}
          sessionStorage.setItem('bench', jason)
          location.assign('/dactylotest/exercise')
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

const text = "La grotte d’Aguzou s'ouvre sur le flanc nord-ouest du pic d'Aguzou. Elle se situe dans le département de l'Aude, aux confins de l'Ariège, entre les villes d'Axat et d'Usson, au sud de Quillan, sur la commune de Escouloubre."
const defaultText = 'Put all speaking, her69 speaking delicate recurred possible.'
const benchmark = new Benchmark(defaultText)
