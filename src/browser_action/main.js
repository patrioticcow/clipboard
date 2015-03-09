$(function () {
	chrome.storage.sync.get(null, function (resp) {
		var primary = '';
		var secondary = '';

		Object.keys(resp).forEach(function (key) {
			var str = resp[key];
			var html = '';
			html += '<li class="ui-state-highlight" id="li_' + key + '" data-id="' + key + '">';
			html += '   <button class="remove remove_btn" id="' + key + '">x</button>';
			html += '   <textarea disabled class="textarea" rows="1">' + str.selected + '</textarea>';
			html += '   <div class="portlet-handle">handle</div>';
			html += '   <div style="clear:both"></div>';
			html += '</li>';

			if (str.type === 'primary') {
				primary += html;
			} else {
				secondary += html;
			}
		});

		var sortable1 = $('#sortable1');
		var sortable2 = $('#sortable2');

		sortable1.html(primary);
		sortable2.html(secondary);

		sortable1.sortable({connectWith: "#sortable2", handle: ".portlet-handle"});
		sortable2.sortable({connectWith: "#sortable1", handle: ".portlet-handle"});

		$("#sortable1, #sortable2").disableSelection();
	});

	$(document).on('click', '.remove', function () {
		var id = $(this).attr('id');

		chrome.storage.sync.remove(id, function () {
			$('ul').find('#li_' + id).remove();

			chrome.contextMenus.remove(id);
		});
	});

	/**
	 * secondary
	 */
	$('#sortable1').on("sortstop", function (event, ui) {
		var id = ui.item.data('id');

		chrome.storage.sync.get(id.toString(), function (resp) {
			moveObject(id, resp, 'secondary');
		});
	});

	/**
	 * primary
	 */
	$('#sortable2').on("sortstop", function (event, ui) {
		var id = ui.item.data('id');

		chrome.storage.sync.get(id.toString(), function (resp) {
			moveObject(id, resp, 'primary');
		});
	});
});

function moveObject(id, resp, type) {
	resp[id]["type"] = type;

	chrome.storage.sync.set(resp, function () {
		$("#" + type + "_saved").show().delay(1000).fadeOut();

		chrome.runtime.sendMessage({func: 'updateMenu'});
	});
}
