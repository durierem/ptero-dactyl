/* global $ */

'use strict'

import { DataManager } from './data-manager.js'
import { SpanManager } from './span-manager.js'
import { InputSpanManager } from './span-manager.js'
import { DactyloTestModel } from './dactylotest-model.js'

class Benchmark {
  constructor (referenceText) {
    this.model = new DactyloTestModel(referenceText)
    this.data = new DataManager()
    this.textContainer = new SpanManager(document.getElementById('text-container'))
    this.inputZone = new InputSpanManager(document.getElementById('virtual-user-input'))
    this.isFirstInput = true
    this.isFocused = true
    this.isInputAllowed = true
    this.isMouseOver = false
    this.chrono = document.getElementById('chrono')
    this.chronoStarted = false
    this.lastChar = null
  }

  deploy () {
    // On insère le texte de référence dans la zone qui lui est dédiée
    for (const c of this.model.getReferenceText()) {
      this.textContainer.insertLast(c)
    }

    // S'occupe d'afficher le chrono
    setInterval(() => {
      const t = this.data.getTime()
      const min = String(Math.floor((t / 60000) % 60)).padStart(2, '0')
      const sec = String(Math.floor((t / 1000) % 60)).padStart(2, '0')
      const milsec = String(t % 1000).padEnd(3, '0')
      this.chrono.innerHTML = min + ':' + sec + ':' + milsec
    }, 10)

    this.handleFocus()

    // this.inputZone.insertLast('█')
    // this.inputZone.placeCursor(0)
    this.isInputAllowed = true

    document.body.addEventListener('keydown', (e) => {
      if (!this.isInputAllowed) {
        return
      }

      const c = e.key

      const currentUserText = () => { return this.model.getUserText() }

      // Bloque les touches spéciales (ArrowLeft, Escape, etc) et laisse
      // passer uniquement Backspace pour autoriser l'effacement.
      if (!/Backspace|^.$/.test(c)) {
        return
      }

      // Empêche la saisie de plusieurs espaces à la suite (bug random ?)
      if (c === ' ' && currentUserText()[currentUserText().length - 1] === ' ') {
        return
      }

      if (!this.chronoStarted) {
        this.chronoStarted = true
        this.data.startTimer()
      }

      if (c === 'Backspace') {
        if (currentUserText().length > 0) {
          this.model.deleteLastInput() // => longueur du texte diminuée de 1
          this.inputZone.removeLast()
        }
      } else {

        this.model.setLastInput(c)
        this.inputZone.insert(c)

        if (!this.model.isUserTextValid()) {
          this.data.addMistake(this.model.getCurrWord())
        } else {
          if (this.isFirstInput) {
            this.isFirstInput = false
          } else {
            this.data.addKeyComb(this.lastChar, c)
          }
          this.lastChar = c
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
        this.inputZone.setCursorBlink(true)
        this.isInputAllowed = true
        this.data.startTimer()
      } else {
        this.inputZone.setCursorBlink(false)
        this.isInputAllowed = false
        this.data.stopTimer()
      }
    })
  }
}

// Texte a utiliser par defaut en cas de probleme pour joindre la
// base de donnees
const defaultText = "La dactylographie est l'action de saisir un texte sur " +
    'un clavier. Celui qui pratique la dactylographie, en tant que loisir ' +
    'ou métier, est un dactylographe. La pratique du métier nécessite ' +
    "l'utilisation de ses dix doigts avec rapidité, fluidité et précision " +
    'et de ne pas regarder les touches du clavier mais de garder le regard ' +
    'sur le texte à saisir.'

$(document).ready(() => {
  const target = '/api/get/rdm_text'
  $.get(target)
    .done((data) => {
      new Benchmark(data).deploy()
    })
    .fail(() => {
      console.log('Can\'t reach text database.')
      new Benchmark(defaultText).deploy()
    })
})
