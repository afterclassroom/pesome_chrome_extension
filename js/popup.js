/*
 * Copyright 2011 Google Inc. All Rights Reserved.

 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var URL = 'http://dev.afterclassroom.com';

chrome.tabs.getSelected(null, function(tab) {
	var link = tab.url;
	var params = 'link=' + escape(link);
	callApi(URL + '/extensions/attach_link', 'GET', params);
});

var timeout;
function hidepanel() {
	$('#tick_to_click').hide();
}

function doTimeout() {
	clearTimeout(timeout);
	timeout = setTimeout(hidepanel, 100);
}

function loadAction() {
	$('#linkto_classroom').click(function() {
		chrome.tabs.create({
			'url' : $(this).attr('href')
		});
	});
	$('.myTick').click(function() {
		chrome.tabs.create({
			'url' : $(this).attr('href')
		});
	});
	$('.signout').click(function() {
		var link = $(this).attr('href');
		var params = '';
		callApi(link, 'GET', params);
	});
	$('.btn-signin').click(function() {
		var fm = $('#form_signin');
		var link = fm.attr('action');
		var params = unescape(fm.serialize());
		callApi(link, 'POST', params);
	});
	$('.click-ctick').click(function() {
		clearTimeout(timeout);
		$("#tick_to_click").show();
	});
	$('#tick_to_click').mouseleave(doTimeout);
	$('#send_bt').click(function() {
		if ($('input[name="classroom_ids[]"]:checked').length > 0) {
			$('#send_bt').button('loading');
			saveTick();
		} else {
			$('#alertModal').modal('show');
		}
	});
	if ($("#tags").length > 0) {
		$("#tags").select2({
			tags : $('#tag_list').val().split(',')
		});
	}
	if ($("#link").length > 0) {
		chrome.tabs.getSelected(null, function(tab) {
			var link = tab.url;
			$("#link").val(link);
		});
	}
	if ($("#images_carousel").length > 0){
		var slider = $("#images_carousel")
      .carousel({
        interval: 5000000
      }).bind('slid', function() {
        $('#link_image').val($('div.carousel-inner div.active img').attr('src'));
      });
	}
	$('#fldcheckbox').click(function(){
		if($(this).is(':checked'))
      {
        $('#images_carousel').hide();
      }
      else
      {
        $('#images_carousel').show();
      }
	});
}

function saveTick() {
	var ft = $('#form_tick');
	var link = ft.attr('action');
	var params = ft.serialize();
	callApi(link, 'POST', params);
}

function callApi(path, method, params) {
	$.ajax({
		cache : false,
		type : method,
		url : path,
		data : params,
		success : function(response) {
			$('#content').html(response);
			loadAction();
		},
		error : function(response) {
			$('#content').html('Error. Status returned: ' + xhr.status);
		}
	});
}
