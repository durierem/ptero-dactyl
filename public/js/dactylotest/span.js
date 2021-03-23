'use strict'

/*
    Span: Encapsulation objet d'une <span> html
    Les Span sont à manipuler par le billet d'un SpanManager
    qui se chargera de leurs disposition

    @pre
        container != null
        char != null
        referent != null => referent est un noeud fils de container
    @post
        this.getChar() === char
        referent === null => this est le dernier noeud fils de container
        referent != null => this est le fils de container placé juste avant le noeud referent 
*/
export class Span {
    
    constructor (container, char, referent = null) {
        this.container = container
        this.element = document.createElement('span')
        this.element.innerText = char

        container.insertBefore(this.element, referent)
    }

    /*
        setChar: Affecte à this le caractère char
        C'est ce caractère qui sera affiché lors du rendu de la page
        @pre
            char != null
        @post
            this.getChar() === char
    */
    setChar (char) {
        this.element.innerText = char
    }

    /*
        setColor: Définit la couleur du texte de this
        @pre
            color != null
        @post
            this.getColor() === color
    */
    setColor (color) {
        this.element.style.color = color
    }

    /*
        getChar: Retourne le caractère associé à this
    */
    getChar () {
        return this.element.innerText
    }

    /*
        getColor: Retourne le caractère associé à this
    */
    getColor () {
        return this.element.style.color
    }

    /*
        detach: this se détache de son conteneur
        Il n'apparait donc plus dans la liste des noeuds du conteneur
    */
    detach () {
        this.container.removeChild(this.element)
    }
}

//---------------------------------------------------------------------------//

/*
    Cursor: Dérive Span dans le but de simuler un curseur
    Un curseur à sa création ne clignotte pas, est donc par conséquent invisible
    @inv
        this.getChar() === '█'
    @post
        this est invisible
        setBlink(false)
*/
export class Cursor extends Span {

    constructor (parentNode) {
        super(parentNode, '█')
        this.element.style.opacity = 0
    }

    /*
        setBlink: Définit si oui ou non this doit clignoter
        @pre
            bool != null
        @post
            bool === true => this clignote simulant un curseur
            bool === false => l'animation curseur est désactivé
    */
    setBlink (bool) {
        if (bool) {
            this.element.classList.add('animate-cursor')
        } else {
            this.element.classList.remove('animate-cursor')
        }
    }

    /*
        Cursor.setChar: Le caractère associé à this ne peut être modifié
    */
    setChar(char) { return }
}
