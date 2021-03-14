// Exemple de création d'un cookie
//    document.cookie = 'theme=dark; path=/; max-age=86400; SameSite=Strict; secure'
// theme => dark / light
// path => accessible depuis tous le site
// max-age -> expire dans X secondes 
// SameSite => Strict -> le cookie n'est encoyé que sur les url du meme site
// secure => le cookie ne sera envoyé qu'en https donc crypté


// A utiliser pour créer ou modifier un cookie
function setCookie(cookieName, value) {
    document.cookie = cookieName + '=' + value + '; path=/; max-age=86400; SameSite=Strict; secure'
  }
  
  // A utiliser pour récuperer la valeur d'un cookie
function getCookie(cookieName) {
    // Si aucun cookie n'est défini ou que cookieName est null, on quitte 
    if (document.cookie == null || cookieName == null) {
      return null
    }
    let rvalue = null
    try {
      rvalue = document.cookie
      .split('; ')
      .find(row => row.startsWith(cookieName + '='))
      .split('=')[1] 
    } catch (e) {
      // Dans le cas où le cookie n'a jamais été défini, on revoie null
      return null
    } finally {
      // Si tout se passe bien on renvoie la valeur du cookie
      return rvalue
    }
  }