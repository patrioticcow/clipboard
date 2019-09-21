//chrome.storage.sync.clear();
//chrome.contextMenus.removeAll();

/**
 * Initial Menu
 */
chrome.contextMenus.create({
  'id': 'clipboard',
  'title': 'Clipboard',
  'contexts': ['all']
})

createSubMenuFromStorage()

/**
 * create Sub Menus from saved "copies"
 */
function createSubMenuFromStorage () {

  chrome.storage.sync.get(null, function (resp) {
    if (resp === undefined) return false

    var primary = {}
    var secondary = {}

    // sort by type
    Object.keys(resp).forEach(function (key) {
      chrome.contextMenus.remove(key)

      var str = resp[key]

      if (str.type === 'primary') {
        primary[key] = resp[key]
      } else {
        secondary[key] = resp[key]
      }
    })

    // create primary type menu
    Object.keys(primary).forEach(function (key) {
      createMenu(key, primary)
    })

    // create secondary type menu
    Object.keys(secondary).forEach(function (key) {
      createMenu(key, secondary)
    })
  })
}

/**
 * listen to "copies" from the inject.js
 */
chrome.extension.onMessage.addListener(
  function (request, sender, sendResponse) {
    sendResponse()

    // save selected text inject.js
    if (request.selectionText !== undefined) {
      var str = request.selectionText.substring(0, 20)

      if (str !== null) {
        var n = Math.floor(Date.now() / 10)

        var objA = {}
        var obj = {}

        objA[n] = { short: str, selected: request.selectionText, type: 'secondary' }
        obj = objA

        findExisting(n, obj)
      }
    }

    // update menu main.js 74
    if (request.func !== undefined) {
      createSubMenuFromStorage()
    }
  })

/**
 * find existing saved text
 * @param n
 * @param obj
 */
function findExisting (n, obj) {
  chrome.storage.sync.get(null, function (resp) {
    if (resp !== undefined) {
      if (Object.keys(resp).length > 0) {
        var i = 0
        Object.keys(resp).forEach(function (key) {
          var str = resp[key]
          if (str.selected === obj[n].selected) i++
        })

        if (i === 0) {
          chrome.storage.sync.set(obj)
          createMenu(n, obj)
        }
      } else {
        createMenuSet(n, obj)
      }
    } else {
      createMenuSet(n, obj)
    }
  })
}

function createMenuSet (n, obj) {
  chrome.storage.sync.set(obj)
  createMenu(n, obj)
}

/**createMenu
 * Crate Sub Menus
 *
 * @param id
 * @param obj
 */
function createMenu (id, obj) {
  var title = obj[id].short

  chrome.contextMenus.create({
    'id': id.toString(),
    'parentId': 'clipboard',
    'title': title + ' ...',
    'contexts': ['all']
  })
}

/**
 * on Sum Menu Click
 * @param ev
 */
var textToPaste = ''
chrome.contextMenus.onClicked.addListener(function (resp) {
  chrome.storage.sync.get(resp.menuItemId, function (data) {
    if (data[resp.menuItemId] !== undefined) {
      console.log(data[resp.menuItemId])
      textToPaste = data[resp.menuItemId].selected

      executeCopy(textToPaste)
    }
  })
})

document.addEventListener('copy', function (e) {
  e.clipboardData.setData('text/plain', textToPaste)
  e.preventDefault()
})

function executeCopy (text) {
  var copyFrom = $('<textarea/>')
  copyFrom.text(text)
  $('body').append(copyFrom)
  copyFrom.select()
  document.execCommand('copy', true)
  copyFrom.remove()
}
