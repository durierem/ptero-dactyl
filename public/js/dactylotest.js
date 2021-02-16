'use strict';

const text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.\nNunc malesuada magna nec magna commodo, non sollicitudin nunc ullamcorper.\nNulla luctus erat quis turpis bibendum sollicitudin.\nQuisque vulputate tincidunt erat in gravida.\nNulla varius, enim a laoreet iaculis, enim purus pellentesque quam,\nlobortis commodo metus nisl et nisi.\nMorbi diam elit.';

const hiddenInput = document.getElementById('hidden-input')
const userContainer = document.getElementById('user-input')
var cursor = 0;

// Wyrd charaters
var carriage_return = '↲';
var space = '␣';

// Initial text treatment, convert it into span and add spans to userContainer
let max_character_by_lines = 60;
let char_on_line = 0;
for (let i = 0; i < text.length; ++i) {
  let c = text.charAt(i)
  let sp = document.createElement('span')
  switch (c) {
    case ' ':
      sp.innerHTML = '␣';
      break;
    case '\n':
      sp.innerHTML = '↲';
      break;
    default:
      sp.innerHTML = c;
  }
  userContainer.appendChild(sp)
  ++char_on_line;
  if (c === '\n') {
    let sp = document.createElement('br')
    userContainer.appendChild(sp)
    char_on_line = 0;
    continue;
  }
}

// index === 0 -> intial value
// index === 1 -> the current character have been misstyped by user
var index = 0;
hiddenInput.addEventListener('keydown', function(e) {
  let c = e.key;
  if (c === 'Shift') {
    return;
  }
  if (text.charAt(cursor) === '\n' && c === 'Enter') {
    ;
  } else if (text.charAt(cursor) != c) {
    console.log(text.charAt(cursor))
    index = 1;
    return;
  }
  
  if (index === 0) {
    setCurrSpanCursorTyped()
  } else {
    setCurrSpanCursorRed()
    index = 0;
  }
  cursor += 1;
  setNextCursor()
})

hiddenInput.addEventListener('focusout', function () {
  unsetPresentCursor();
})

userContainer.addEventListener('click', function () {
  hiddenInput.focus()
  setCursor()
})


var span_cursor_number = -1;
// Let's find the first position of the cursor
findNextCursor()

function setNextCursor() {
  unsetPresentCursor()
  findNextCursor()
  setCursor()
}

function findNextCursor() {
  ++ span_cursor_number;
  let sp = userContainer.children.item(span_cursor_number)
  while (sp.tagName === 'BR') {
    ++ span_cursor_number;
    sp = userContainer.children.item(span_cursor_number)
  }
}
function setCursor() {
  let sp = userContainer.children.item(span_cursor_number)
  sp.classList.add("cursor-blink")
}

function unsetPresentCursor() {
  let sp = userContainer.children.item(span_cursor_number)
  if (sp == null) {
    return;
  }
  sp.classList.remove("cursor-blink")
}

function setCurrSpanCursorRed() {
  let sp = userContainer.children.item(span_cursor_number)
  sp.setAttribute('style', 'color:red;')
}

function setCurrSpanCursorTyped() {
  let sp = userContainer.children.item(span_cursor_number)
  sp.setAttribute('style', 'color:gray;')
}