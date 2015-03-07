//chrome.storage.sync.clear();
//chrome.contextMenus.removeAll();
/**
 * Initial Menu
 */
chrome.contextMenus.create({
    "id": "clipboard",
    "title": "Clipboard",
    "contexts": ["all"]
});

/**
 * create Sub Menus from saved "copies"
 */
chrome.storage.sync.get(null, function (resp) {
    Object.keys(resp).forEach(function (key) {
        var str = resp[key];
        createMenu(key, str.short);
    });
});

/**
 * listen to "copies" from the inject.js
 */
chrome.extension.onMessage.addListener(
    function (request, sender, sendResponse) {
        sendResponse();
        if (request.selectionText !== undefined) {
            var str = request.selectionText.substring(0, 20);

            if (str !== null) {
                var n = Math.floor(Date.now() / 10);

                var obj = {};
                obj[n] = {short: str, selected: request.selectionText};

                findExisting(n, obj);
            }
        }
    });

/**
 * find existing saved text
 * @param n
 * @param obj
 */
function findExisting(n, obj) {
    chrome.storage.sync.get(null, function (resp) {
        if (Object.keys(resp).length > 0) {
            var i = 0;
            Object.keys(resp).forEach(function (key) {
                var str = resp[key];
                if (str.selected === obj[n].selected) i++;
            });

            if (i === 0) {
                chrome.storage.sync.set(obj);
                createMenu(n, obj[n].short);
            }
        } else {
            chrome.storage.sync.set(obj);
            createMenu(n, obj[n].short);
        }
    });
}


/**
 * Crate Sub Menus
 *
 * @param id
 * @param str
 */
function createMenu(id, str) {
    chrome.contextMenus.create({
        "id": id.toString(),
        "parentId": "clipboard",
        "title": str + ' ...',
        "contexts": ["all"]
    });
}


/**
 * on Sum Menu Click
 * @param ev
 */
var textToPaste = '';
chrome.contextMenus.onClicked.addListener(function (resp) {
    chrome.storage.sync.get(resp.menuItemId, function (data) {
        textToPaste = data[resp.menuItemId].selected;

        executeCopy(textToPaste);
        /*
         chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
         chrome.tabs.sendMessage(tabs[0].id, {text: textToPaste}, function (response) {});
         });
         */
    });
});

document.addEventListener('copy', function (e) {
    e.clipboardData.setData('text/plain', textToPaste);
    e.preventDefault();
});

function executeCopy(text) {
    var copyFrom = $('<textarea/>');
    copyFrom.text(text);
    $('body').append(copyFrom);
    copyFrom.select();
    document.execCommand('copy', true);
    copyFrom.remove();
}