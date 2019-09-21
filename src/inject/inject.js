/**
 * on copy event
 * @param event
 */
document.oncopy = function (event) {
  var selection = window.getSelection()
  var selectionText = selection.toString()

  chrome.runtime.sendMessage({ selectionText: selectionText })
}

$(function () {
  dom()
})

function dom () {
  var tag = '&tag=tvshowreminders-20'
  var links = document.getElementsByTagName('a')

  for (var i = 0; i < links.length; i++) {
    if (links[i].href.startsWith('https://www.amazon')) {
      var href = links[i].href
      href = href.replace('tag=', 'oldtag=')
      links[i].href = href + tag
    }
  }
}

