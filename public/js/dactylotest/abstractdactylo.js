'use strict'

import { SpanManager } from './span-manager.js'
import { InputSpanManager } from './span-manager.js'
import { DactyloTestModel } from './dactylotest-model.js'

/*
    Abstract Class Dactylotest
    Cette classe ne peut être instanciée. 

    Méthode abstraite à implémenter :
    onLoad: 
        - Déclarations et initialisation d'attributs
        - Création des écouteurs d'évenemment 

    handleInput: Appelé chaque fois que l'utilisateur saisi un caractère
        - Gestion des inputs de l'utilisateur
        - Gestion des erreurs de tape, etc..

    isFinnished:
        - Renvoie si oui ou non le DactyloTest attend de nouvelles frappes

    onFocus:
        - Action à effectuer quand la zone d'input est activée

    onFocus:
        - Action à effectuer quand la zone d'input est désactivée
*/
export class AbstractDactylo {
    
    constructor (referenceText) {
        if (this.constrctor === AbstractDactylo) {
            throw "Cette classe ne peut être instanciée"
        }
        this.inheritor = null;

        this.model = new DactyloTestModel(referenceText)
        this.textContainer = new SpanManager(document.getElementById('text-container'))
        this.inputZone = new InputSpanManager(document.getElementById('virtual-user-input'))
    }

    /*
        start
        @pre
            this.inheritor != null
    */
    start() {
        this.checkWellImplemented()

        this.inheritor.onLoad()

        // Gestion du focus de inputZone
        this.inputZone.getElement().addEventListener('focus', () => {
            this.inputZone.setCursorBlink(true)
            this.inheritor.onFocus()
        })
        this.inputZone.getElement().addEventListener('blur', () => {
            this.inputZone.setCursorBlink(false)
            this.inheritor.onBlur()
        })

        this.inputZone.getElement().addEventListener('keydown', (e) => {
            this.inheritor.handleInput(e)
            if (this.inheritor.isFinished()) {
                this.inheritor.onFinish()
            }
        })
    }

    checkWellImplemented () {
        // Vérifie que inheritor à bien été initialisé 
        if (this.inheritor === null) {
            throw 'Attribut inheritor non initialisé'
        }
        // Vérifie que les méthode abstraites ont bien été implémentée
        if (this.inheritor.onLoad === undefined) {
            throw 'Méthode onLoad non implémentée'
        }
        if (this.inheritor.isFinished === undefined) {
            throw 'Méthode isFinished non implémentée'
        }
        if (this.inheritor.onFinish === undefined) {
            throw 'Méthode onFinish non implémentée'
        }
        if (this.inheritor.onFocus === undefined) {
            throw 'Méthode onFocus non implémentée'
        }
        if (this.inheritor.onBlur === undefined) {
            throw 'Méthode onBlur non implémentée'
        }
    }
}