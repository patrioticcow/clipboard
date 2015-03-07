/**
 * on SubMenu click
 */
/*
 chrome.runtime.onMessage.addListener(
 function (request, sender, sendResponse) {
 if (request.text !== undefined) {

 }
 });
 */

/**
 * on copy event
 * @param event
 */
document.oncopy = function (event) {
    var selection = window.getSelection();
    var selectionText = selection.toString();
    console.log(selectionText);
    chrome.runtime.sendMessage({selectionText: selectionText});
};