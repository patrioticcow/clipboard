$(function () {
    chrome.storage.sync.get(null, function (resp) {
        var html = '';
        Object.keys(resp).forEach(function (key) {
            var str = resp[key];
            html += '<tr id="tr_' + key + '">';
            html += '   <td valign="top"><button class="remove" id="' + key + '">x</button></td>';
            html += '   <td><textarea disabled style="width: 456px" rows="1">' + str.selected + '</textarea></td>';
            html += '</tr>';
        });

        $('#placeholder').html(html);
    });


    $(document).on('click', '.remove', function () {
        var id = $(this).attr('id');

        chrome.storage.sync.remove(id, function () {
            $('table').find('#tr_' + id).remove();

            chrome.contextMenus.remove(id);
        });
    });
});
