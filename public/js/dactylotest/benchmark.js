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

    // variable utile pour mesurer le temps entre 2 bonnes lettres consécutives
    this.lastChar = ' '
    // mis sert à savoir si on à répeter une erreur sur un même mots
    this.mis = false
    // certain vienne surement de la, pour pouvoir écrire entre 2 lettres le
    // modele commence avec un index à -1 est le SpanManager un index à 0
    // on a donc besoin de rajouter une span est de bouger le cursor de inputzone
    // pour que ça marche
    this.inputZone.insertLast('')
    this.inputZone.moveCursorRight()

    // on place le curseur (qui y est déjà pas sur de l'utilité de cette ligne)
    // on commence le timer (pas au bonne endroit non plus)
    this.inputZone.getElement().addEventListener('click', () => {
      this.inputZone.placeCursor(this.model.getCursorIndex() + 1)
      this.data.startTimer() // pas sur d'ici
    })

    this.inputZone.getElement().addEventListener('keydown', (e) => {
      const c = e.key



      // Quand l'utilisateur appuie sur une fléche on bouge le cursor du model
      // et de la vu, les fonctions gère les problèmes de dépassement d'index
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

      // Cas du Backspace
      if (c === 'Backspace') {
        // Si nous ne somme pas au tous début
        if (this.inputZone.cursorIndex > 0) {
          // on retire le span à l'endroit du cursor model (c'est à cause de ça
          // qu'il est important que l'index du model soit -1 par rapport au
          // curseur de inputZone)
          this.inputZone.removeCharAt(this.model.getCursorIndex())
          // on retire le char à l'emplacement index de userText dans le model
          //
          // model.delAt() gére aussi le mots courant, c'est à dire le mots sur lequel
          // est placer le curseur, cette partie est un peu complexe et est
          // peut-etre source de bug
          this.model.delAt()
          // Quand on efface un character, les autres après ce character sont
          // décaler de 1 vers la gauche, on doit donc aussi d"caler le cursor
          this.inputZone.moveCursorLeft()
          // model.isUserTextValid() test si le texte de l'utilisateur est
          // bien égal au text du benchmark
          if (!this.model.isUserTextValid()) {
            // si non on passe en rouge
            this.inputZone.getElement().style.backgroundColor = 'red'
          } else {
            // si oui on doit quand même passer en blanc, dans certain cas, le
            // texte n'étais pas bon mais effacer un character le rend bon
            this.inputZone.getElement().style.backgroundColor = 'var(--light-bg-secondary)'
          }
        }
      // cas des character valide
      } else {
        // on commence par ajouter au userText du model le character taper, on
        // commence par faire cela car son index est à -1 par rapport à celui
        // de la inputzone (pour enlever un character au bonne endroit)
        // model.setLastInput(c) augmente l'index de model, on à donc plus de
        // probléme d'index entre model et inputzone
        //
        // setLastInput gére aussi le mots courant, c'est à dire le mots sur lequel
        // est placer le curseur, cette partie est un peu complexe et est
        // peut-etre source de bug
        this.model.setLastInput(c)
        console.log(this.model.cursorIndex)
        // cette partie du code est un peu manuelle est surement facilement
        // améliorable, si on est à la fin du text de l'utilisateur, on
        // ajoute une span + character à la fin, sinon on insert une span
        // + un character entre 2 span
        // les 2 méthodes ne touches pas au curseur du spanManager (inputZone)
        if (this.model.getCursorIndex() === this.model.maxCursorIndex) {
          console.log('re')
          this.inputZone.setCharAt(c, this.model.getCursorIndex())
        } else {
<<<<<<< Updated upstream
          console.log('tu')
          this.inputZone.insertCharAt(c, this.model.getCursorIndex())
=======
          this.inputZone.insertCharAt(c, this.model.getCursorIndex() + 1)
>>>>>>> Stashed changes
        }

        // model.isUserTextValid() test si le texte de l'utilisateur est
        // bien égal au text du benchmark
        if (this.model.isUserTextValid()) {
          // model.canSetUserValidText() est un peu différent, dans le model
          // nous avons 3 sting:
          // - celle du benchmark, referenceText
          // - celle de l'utilisateur, userText (c'est ce qu'il écrit)
          // - celle de ce que l'utilisateur à bien écrit, userValidText
          // userValidText est la plus longue string que l'utilisateur à écrit
          // sans faute, pour la modifier on regarde si le texte de l'utilisateur
          // est bien égal au text du benchmark et si userText > userValidText.length
          // c'est à dire si ce qu'il à bien écrit est plus long que ce qu'il
          // à bien écrit avant
          if (this.model.canSetUserValidText() ) {
            // si model.canSetUserValidText() alors on set isUserTextValid avec
            // la valeur de userText
            this.model.setUserValidText()
            // cette parti sert à savoir si on est passer au prochain mot
            // (le character ' ' est mauvais il faudrais un séparateur
            // plus efficace pour les mots)
            if (c === ' ') {
              // Mis permet de savoir si nous avous fait des erreurs sur un même
              // mot, il faut donc le reset quand on passe à un nouveau mot
              this.data.resetMis()
              // comme on passe à un nouveau mot, on peux ajouter le temps du
              // mot que l'on vien de finir aux Datas
              this.data.addWordTime()
            }
            // model.canSetUserValidText() est valide, donc on sait que l'utilisateur
            // a bien écrit deux lettres consécutives, on peuc donc les ajouters
            // aux Datas (La case n'est pas prit en compte)
            this.data.addKeyComb(this.lastChar,c.toLowerCase())
            // on mémorise le character c pour le prochain appel à addKeyComb
            this.lastChar = c.toLowerCase()
          }
          // model.canSetUserValidText() est valide, le texte est blanc
            this.inputZone.getElement().style.backgroundColor = 'var(--light-bg-secondary)'
        } else {
          // model.canSetUserValidText() est invalide, le texte est rouge
          this.inputZone.getElement().style.backgroundColor = 'red'
          // si c'est la premiére fois que l'on fait une faute à un mot, on passe
          // mis à True si jamais on fait plusieurs fois des fautes à ce même mots
          // (WTF c'est pas le même mis que dans data ? surement un probléme ici)
          if (!this.mis) {
            this.mis = true
            // on dit que les mots à eu une erreur dans les Datas
            this.data.addMistake(this.model.getCurrWord())
          }
        }
        this.inputZone.insertLast('')
        // On bouge le curseurr à droite car on à écrit un character
        this.inputZone.insertLast('')
        this.inputZone.moveCursorRight()
        // On reset le mis (à voir avec Rémi le truc du mis me perturbe un peu)
        this.mis = false

        console.log('---debut---')
        console.log(this.model.getCurrWord())

      }

      // si userText === referenceText c'est la fin !
      if (this.model.isFinished()) {
        this.data.addWordTime()
        console.log('THE END')
        console.log(this.data.getData())
      }
    })
  }
}

const text = "La grotte d’Aguzou s'ouvre sur le flanc nord-ouest du pic d'Aguzou. Elle se situe dans le département de l'Aude, aux confins de l'Ariège, entre les villes d'Axat et d'Usson, au sud de Quillan, sur la commune de Escouloubre."
const defaultText = 'Put all speaking, her69 speaking delicate recurred possible.'
const benchmark = new Benchmark(defaultText)
