'use strict'

import { Span, Cursor } from './span.js'

// ---------------------------------------------------------------------------//

/*
SpanManager: Gestionnaire de Span.
Accumule des Span formant ainsi un texte s'affichant à l'écran.
Attention, Ne pas faire d'hypothèse sur le contenu de this.spans

@pre
parentNode est un objet conteneur du DOM
parentNode != null
*/
export class SpanManager {
  constructor (parentNode) {
    this.parentNode = parentNode
    this.spans = []
  }

  /*
  getElement
  @pre
  Renvoie l'élément DOM conteneur associé au spanManager
  */
  getElement () {
    return this.parentNode
  }

  /*
  getSpanAt: Retourne la span à l'indice i du texte affiché
  @pre
  0 < i < this.getLength()
  @post
  i === default value => Retourne la dernière lettre du texte affiché
  i => Retourne la lettre à l'indice i du texte affiché
  */
  getSpanAt (i = this.getLength() - 1) {
    if (i < 0 || i >= this.getLength) { return null }
    return this.spans[i]
  }

  /*
  getLength
  @post
  Retourne la taille du texte formé
  */
  getLength () {
    return this.spans.length
  }

  /*
  insertLast
  @pre
  char est un caractère
  @post
  Le dernier caractère du texte formé est char
  this.getLength = old this.getLength + 1
  */
  insertLast (char) {
    this.spans.push(new Span(this.parentNode, char))
  }

  /*
  removeLast
  @post
  L'ancien dernier caractère du texte formé est retiré de ce dernier
  this.getLength = old this.getLength - 1
  */
  removeLast () {
    this.spans.pop().detach()
  }
}

/* -------------------------------------------------------------------------- */

/*
InputSpanManager: Gestionnaire de Span incluant un curseur
Le curseur est géré sous forme d'un Span.
Les Span insérées par insert() s'insèrent à l'endroit du curseur
afin de simuler une tape dans un éditeur de texte.
Un appel à remove() simule un effacement à la position du curseur.
Les appels insertLast() et removeLast() ne garantissent pas la cohérence du curseur.

@pre
parentNode est un objet conteneur du DOM
parentNode != null
@post
this.spans[0] = cursor
this.getLength = 0
*/
export class InputSpanManager extends SpanManager {
  constructor (parentNode) {
    super(parentNode)

    this.cursor = new Cursor(this.parentNode, '█')
    this.spans.push(this.cursor)
    this.cursorIndex = 0
  }

  /*
  insert
  @pre
  char est un caractère
  @post
  Une Span de caractère char est insérée à la gauche le curseur
  this.getLength = old this.getLength + 1
  */
  insert (char) {
    this.spans.push(new Span(this.parentNode, char, this.cursor.element))
  }

  /*
  remove
  @pre
  this.length() > 0
  @post
  L'ancien caractère du texte formé positioné à la gauche du curseur est retiré de ce dernier
  this.getLength = old this.getLength - 1
  */
  remove () {
    if (this.spans.length !== 1) {
      super.removeLast()
    }
  }

  /*
  getSpanAt: Retourne la span à l'indice i du texte affiché
  @pre
  0 < i < this.getLength()
  @post
  i === default value => Retourne la dernière lettre du texte affiché
  i => Retourne la lettre à l'indice i du texte affiché, ne revoie jamais le curseur
  */
  getSpanAt (i = this.getLength()) {
    if (i < 0 || i > this.getLength) { return null }
    if (this.spans[i] === this.cursor) {
      return this.spans[i - 1]
    }
    return this.spans[i]
  }

  /*
  getLength
  @post
  Retourne la taille du texte formé
  */
  getLength () {
    // -1 car le curseur ne doit pas compter dans la taille du texte
    return this.spans.length - 1
  }

  /*
  setCursorBlink
  @pre
  bool != null
  @post
  Le curseur clignotte ou non en fonction de bool
  */
  setCursorBlink (bool) {
    this.spans[this.cursorIndex].setBlink(bool)
  }
}
