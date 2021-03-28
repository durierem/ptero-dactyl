/* global $ */

'use strict'

import { AbstractDactylo } from './abstractdactylo.js'
import { DataManager } from './data-manager.js'

class Benchmark extends AbstractDactylo {
  constructor (referenceText) {
    super(referenceText)
    super.inheritor = this

    this.data = new DataManager()
    this.chrono = document.getElementById('chrono')
    this.lastChar = null
    this.isFirstInput = true
  }

  onLoad () {
    // On insère le texte de référence dans la zone qui lui est dédiée
    for (const c of this.model.getReferenceText()) {
      this.textContainer.insertLast(c)
    }

    // S'occupe d'afficher le chrono
    setInterval(() => {
      const t = this.data.getTime()
      const min = String(Math.floor((t / 60000) % 60)).padStart(2, '0')
      const sec = String(Math.floor((t / 1000) % 60)).padStart(2, '0')
      const milsec = String(t % 1000).padEnd(3, '0').slice(0, -1)
      this.chrono.innerHTML = min + ':' + sec + ':' + milsec
    }, 10)
  }

  handleInput (e) {
    const c = e.key

    // Bloque les touches spéciales (Backspace, ArrowLeft, Escape, etc)
    if (!/^.$/.test(c)) {
      // Si la touche est Backspace on effectue les actions appropriée
      if (c === 'Backspace' && this.inputZone.getLength() > 0) {
        this.model.deleteLastInput() // => longueur du texte diminuée de 1
        this.inputZone.remove()
        this.lastChar = null
      }
    } else {
      // On démarre le timer uniquement lors de la première frappe
      if (this.isFirstInput) {
        this.isFirstInput = false
        this.data.startTimer()
      }

      // Mise à jour du modèle
      this.model.setLastInput(c)
      // Mise à jour de la vue
      this.inputZone.insert(c)
    }

    if (/^.$|Backspace/.test(c)) {
      // Traitement des erreurs
      if (!this.model.isUserTextValid()) {
        this.inputZone.getElement().style.backgroundColor = 'var(--light-bg-red)'
        this.data.addMistake(this.model.getCurrWord())
        this.lastChar = null
      } else {
        this.inputZone.getElement().style.backgroundColor = 'var(--light-bg-secondary)'
        if (this.lastChar != null) {
          this.data.addKeyComb(this.lastChar, c)
        }
        if (c !== 'Backspace') {
          this.lastChar = c
        }
        const isEndOfWord = !/\d|\w/.test(this.model.getReferenceText().charAt(this.inputZone.getLength()))
        if (isEndOfWord) {
          this.data.resetMis()
          this.data.addWordTime()
          this.model.setCurrentWord()
        }
      }
    }
  }

  isFinished () {
    return this.model.isFinished()
  }

  onFinish () {
    this.inputZone.getElement().innerHTML = 'FINI'
    this.data.stopTimer()
    const jason = this.data.getData()
    const target = '/api/send/benchdata'
    $.post(target, { data: JSON.stringify(jason) })
      .done(() => {
        window.location.assign('/dactylotest/session?isFinished=true')
      })
      .fail((data) => {
      // On redirige vers la page d'accueil avec un paramètre erreur
      // car la sauvegarde à échouée
        window.location.assign('/?error=true')
        console.log('Couldn\'t save data: ' + JSON.parse(data))
      })
  }

  onFocus () {
    if (!this.isFirstInput) {
      this.data.startTimer()
    }
  }

  onBlur () {
    this.data.stopTimer()
  }
}

// ---------------------------------------------------------------------------//

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
      const a = document.getElementById('source-link')
      a.innerHTML = data.source
      a.href = data.source_url
      new Benchmark(data.content).start()
    })
    .fail(() => {
      document.getElementById('source').innerHTML = 'Impossible d\'atteindre la base de données :('
      document.getElementById('source').classList.add('error')
      new Benchmark(defaultText).start()
    })
})
