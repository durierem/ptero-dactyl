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
    this.isFirstInput = true
    this.isFocused = true
    this.isInputAllowed = true
    this.isMouseOver = false
    this.lastChar = ' '
    this.chrono = document.getElementById('chrono')
    this.chronoStarted = false
    this.initialize()
  }

  initialize () {
    // On insère le texte de référence dans la zone qui lui est dédiée
    for (const c of this.model.getReferenceText()) {
      this.textContainer.insertLast(c)
    }

    this.handleFocus()

    this.inputZone.insertLast('')
    this.inputZone.placeCursor(0)
    this.isInputAllowed = true

    document.body.addEventListener('keydown', (e) => {
      if (!this.isInputAllowed) {
        return
      }

      if (!this.chronoStarted) {
        this.chronoStarted = true
        this.data.startTimer()
        setInterval(() => {
          const t = this.data.getTime()
          this.chrono.innerHTML = String(Math.floor((t / 60000) % 60)).padStart(2, '0') + ':' + // Minutes
                                  String(Math.floor((t / 1000) % 60)).padStart(2, '0') + ':' + // Secondes
                                  t % 1000 // MiliSecs
        }, 10)
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
          this.inputZone.removeLast()
        }
      } else {
        if (this.isFirstInput) {
          this.isFirstInput = false
          this.data.startTimer()
        }

        this.data.addKeyComb(this.lastChar, c)
        this.lastChar = c
        this.model.setLastInput(c)
        this.inputZone.insertCharAt(c, currentUserText().length - 1)

        if (!this.model.isUserTextValid()) {
          this.data.addMistake(this.model.getCurrWord())
        } else {
          const isEndOfWord = !/\d|\w/.test(this.model.getReferenceText()
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
        this.isInputAllowed = false
        this.inputZone.getElement().innerHTML = 'FINI'
        this.data.stopTimer()
        console.log(this.data.getData())
        const jason = this.data.getData()
        const target = '/api/send/benchdata'
        $.post(target, { data: JSON.stringify(jason) })
          .done(() => {
            window.location.assign('/dactylotest/session?isFinished=true')
          })
          .fail((data) => {
            // on redirige vers la page d'accueil avec un parametre erreur
            // car la sauvegarde a echoue
            window.location.assign('/?error=true')
            console.log('Couldn\'t save data: ' + JSON.parse(data))
          })
      }
    })
  }

  handleFocus () {
    this.inputZone.getElement().addEventListener('mouseover', () => {
      this.isMouseOver = true
    })
    this.inputZone.getElement().addEventListener('mouseleave', () => {
      this.isMouseOver = false
    })

    document.body.addEventListener('click', () => {
      if (this.isMouseOver) {
        this.inputZone.placeCursor(this.model.getUserText().length)
        this.data.startTimer()
        this.isInputAllowed = true
      } else {
        this.inputZone.removeCursor()
        this.isInputAllowed = false
        this.data.stopTimer()
      }
    })
  }
}

const defaultText = 'Put all'
let benchmark = null
$(document).ready(() => {
  const target = '/api/get/rdm_text'
  $.get(target)
    .done((data) => {
      console.log(data)
      // benchmark = new Benchmark(data)
      benchmark = new Benchmark(defaultText)
    })
    .fail(() => {
      console.log('Can\'t reach text database.')
      benchmark = new Benchmark(defaultText)
    })
})
