var currentSummernoteEditor;
var last_focused_el;
var insertAtChar;

(function (factory) {
	if (typeof define === 'function' && define.amd) {
		define(['jquery'],factory)
	} else if (typeof module === 'object' && module.exports) {
		module.exports = factory(require('jquery'));
	} else {
		factory(window.jQuery)
	}
}
(function ($) {

	$.extend(true,$.summernote.lang, {
		'en-US': {
			uploadfile: {
				tooltip: 'Media browser'
			}
		},
		'hu-HU': {
			uploadfile: {
				tooltip: 'Média tallózó'
			}
		}
	});
	// $.extend($.summernote.keyMap, {
	// 	pc: {
	// 		'CTRL+S': 'Save'
	// 	},
	// 	mac: {
	// 		'CMD+S': 'Save'
	// 	}
	// });
	$.extend($.summernote.options, {
		uploadfile: {
			icon: '<i class="note-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 70" width="20" height="20"><path id="path3469" d="M 63,32 C 63,49.121 49.121,63.001 32,63.001 14.879,63.001 1,49.121 1,32 1,14.879 14.879,1 32,1 49.121,1 63,14.879 63,32 Z" class="background"/><g id="g3471" style="fill:#ffffff" class="foreground"><path id="path3473" d="m 38.541,34.098 -8.082,0 0,-8.081 c 0,-0.705 -0.572,-1.277 -1.276,-1.277 l -6.381,0 c -0.705,0 -1.276,0.572 -1.276,1.277 l 0,8.081 -8.081,0 c -0.706,0 -1.276,0.572 -1.276,1.275 l 0,6.382 c 0,0.703 0.57,1.275 1.276,1.275 l 8.081,0 0,8.081 c 0,0.707 0.571,1.278 1.276,1.278 l 6.381,0 c 0.704,0 1.276,-0.571 1.276,-1.278 l 0,-8.081 8.082,0 c 0.704,0 1.275,-0.572 1.275,-1.275 l 0,-6.382 c 0,-0.703 -0.571,-1.275 -1.275,-1.275 z"/><path id="path3475" d="m 29.4,14.826 3.856,0 0,-3.857 c 0,-0.455 0.37,-0.826 0.826,-0.826 l 3.304,0 c 0.457,0 0.827,0.371 0.827,0.826 l 0,3.857 3.856,0 c 0.456,0 0.826,0.369 0.826,0.826 l 0,3.304 c 0,0.457 -0.37,0.827 -0.826,0.827 l -3.856,0 0,4.131 c 0,0.456 -0.37,0.826 -0.827,0.826 l -3.304,0 c -0.456,0 -0.826,-0.37 -0.826,-0.826 l 0,-4.131 -3.856,0 c -0.457,0 -0.826,-0.37 -0.826,-0.827 l 0,-3.304 c 0,-0.457 0.369,-0.826 0.826,-0.826 z"/><path id="path3477" d="m 41.934,26.529 3.855,0 0,-3.857 c 0,-0.455 0.37,-0.826 0.826,-0.826 l 3.306,0 c 0.456,0 0.825,0.371 0.825,0.826 l 0,3.857 3.856,0 c 0.456,0 0.826,0.369 0.826,0.826 l 0,3.304 c 0,0.457 -0.37,0.826 -0.826,0.826 l -3.856,0 0,4.131 c 0,0.456 -0.369,0.827 -0.825,0.827 l -3.306,0 c -0.456,0 -0.826,-0.371 -0.826,-0.827 l 0,-4.131 -3.855,0 c -0.456,0 -0.827,-0.369 -0.827,-0.826 l 0,-3.304 c 0,-0.457 0.371,-0.826 0.827,-0.826 z"/></svg></i>',
			encode: false // Encode editor data when submitting to server
		}
	});

	//A dinamikus feltöltés mellé kerül egy média tallózó is, amiből rákattintással beszúrható a kép.

	$.extend($.summernote.plugins, {
		'uploadfile':function (context) {
			var ui      = $.summernote.ui,
				$editor = context.layoutInfo.editor,
				options = context.options,
				lang    = options.langInfo,
				$note	= context.$note,
			mediaBrowserUrl,
			mediaUseUrl;
			currentSummernoteEditor = $note;

			context.memo('button.uploadfile',function () {
				var button = ui.button({
					contents: options.uploadfile.icon,
					tooltip:  lang.uploadfile.tooltip,
					click:function () {

						if (typeof last_focused_el == 'undefined'){
							$('.note-editable', $editor).trigger('focus');
							last_focused_el = window.getSelection().focusNode;
						}

// mediaBrowserUrl = '/backoffice/ajaxmediabrowser';
						if(typeof mediaBrowserUrl == 'undefined'){
							alert('Please specify upload url!');
							return false;
						}

						$.get(mediaBrowserUrl, function (response0) {
							var self = bootbox.dialog({
								title: "Media browser",
								message: response0.html,
								buttons: {
									insert: {
										label: "beszúr",
										className: "btn-primary",
										callback: function (evt) {
											insertAtChar();
											last_focused_el = undefined;
										}
									},
									cancel: {
										label: "bezár",
										className: "btn-default",
										callback: function (evt) {
											last_focused_el = undefined;
										}
									}
								},
								onEscape:true
							}).init(function() {

								$('.lastUploaded').off();
								$('.lastUploaded').on('click', function (event) {
									var id = $(this).attr('id').split('-')[1];
// mediaUseUrl = '/backoffice/mediause/'+id;
									if(typeof mediaUseUrl == 'undefined'){
										alert('Please specify upload url!');
										return false;
									}

									$.get(mediaUseUrl, function (response) {

										var node = document.createElement("a");
										node.setAttribute("href", response.src);
										var createAText = document.createTextNode("letöltés");
										node.appendChild(createAText);
										node.setAttribute("target", "_blank");
										node.setAttribute("id", response.id);

										if(response.mime_type > ""){
											switch(response.mime_type){
												case "image/jpg":
												case "image/jpeg":
												case "image/png":
												case "image/gif":
												case "image/tif":
													node = document.createElement("img");
													//a szerver oldalon generált id-val tesszük le a képet, így a form post során regexppel ki tudjuk venni a
													// megmaradó elemeket (gc a feleslegesen feltöltött file-ok számára)
													node.setAttribute("src", response.src);
													node.setAttribute("id", response.id);
													// $(el).summernote("editor.insertImage", url);
													break;
												default:
													console.log(node);
													break;
											}
										}

										if(typeof last_focused_el != 'undefined'){

											var range = document.createRange();
											var sel = window.getSelection();

											range.setStart(last_focused_el, last_focused_el.length); // put the cursor in last position of the element
											range.collapse(true);
											sel.removeAllRanges();
											sel.addRange(range);
											var self = $(currentSummernoteEditor).summernote('code');

											try {
												last_focused_el.focus();
											}
											catch(err) {
												console.log(err.message);
											}

											$(currentSummernoteEditor).summernote('editor.insertNode', node);
										}

									}, 'json');
									return false;
								});

								insertAtChar = function(){

									$('.dataTable tr.selected td:nth-child(1)').each(function(i,item){
										var id = parseInt($(item).html());
//mediaUseUrl = '/backoffice/mediause/'+id;
										if(typeof mediaUseUrl == 'undefined'){
											alert('Please specify upload url!');
											return false;
										}
										$.get(mediaUseUrl, function (response) {
											var node = document.createElement("a");
											node.setAttribute("href", response.src);
											var createAText = document.createTextNode('letöltés');
											node.appendChild(createAText);
											node.setAttribute("target", "_blank");
											node.setAttribute("id", id);

											if(response.mime_type > ""){
												switch(response.mime_type){
													case "image/jpg":
													case "image/jpeg":
													case "image/png":
													case "image/gif":
													case "image/tif":
														node = document.createElement("img");
														//a szerver oldalon generált id-val tesszük le a képet, így a form post során regexppel ki tudjuk venni a
														// megmaradó elemeket (gc a feleslegesen feltöltött file-ok számára)
														node.setAttribute("src", response.src);
														node.setAttribute("id", response.id);
														// $(el).summernote("editor.insertImage", url);
														break;
													default:
														console.log(node);
														break;
												}
											}

											$(currentSummernoteEditor).summernote('editor.insertNode', node);
										}, 'json');
									});

								}
							});

						}, 'json');



						// if (options.uploadfile.encode) {
						// 	var noteText = $note.summernote('code');
						// 	$note.summernote('code', escape(noteText));
						// 	this.form.submit();
						// 	$note.summernote('code', noteText);
						// } else {
						// 	this.form.submit();
						// }
						// $editor.find('.note-save .btn').removeClass('btn-danger');
					}
				});
				return button.render();
			});
			this.events = {
				'summernote.change':function (we, e) {
					$editor.find('.note-save .btn').addClass('btn-danger');
				},
				'summernote.mousedown':function (we, e) {

					var focused_element = window.getSelection().focusNode;
					var parent = $(e.target).get(0);
					if ($.contains(parent, focused_element))
					{
						// $(me.sn_editor).data('last_focused_element', focused_element)
						last_focused_el = focused_element;
					};
					// last_focused_el = window.getSelection().focusNode;
				},
				'summernote.keydown':function (we, e) {
					var focused_element = window.getSelection().focusNode;
					var parent = $(e.target).get(0);
					if ($.contains(parent, focused_element))
					{
						// $(me.sn_editor).data('last_focused_element', focused_element)
						last_focused_el = focused_element;
					};

					if(e.keyCode == 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
						e.preventDefault();
						if (options.save.encode) {
							var noteText = $note.summernote('code');
							$note.summernote('code', escape(noteText));
							this.form.submit();
							$note.summernote('code', noteText);
						} else {
							this.form.submit();
						}
						$editor.find('.note-save .btn').removeClass('btn-danger');
					}
				}
			};
			// $(window).bind('beforeunload',function () {
			// 	if (unsaved) return lang.save.unsaved;
			// });
		}
	});

	// $(document).on('click', '.lastUploaded', function (event) {
	// 	var id = $(this).attr('id').split('-')[1];
	// 	var url = '/backoffice/mediause/'+id;
	// 	$.get(url, function (response) {
	//
	//
	// 		var node = document.createElement("a");
	// 		node.setAttribute("href", response.src);
	// 		var createAText = document.createTextNode("letöltés");
	// 		node.appendChild(createAText);
	// 		node.setAttribute("target", "_blank");
	// 		node.setAttribute("id", response.id);
	//
	// 		if(response.mime_type > ""){
	// 			switch(response.mime_type){
	// 				case "image/jpg":
	// 				case "image/jpeg":
	// 				case "image/png":
	// 				case "image/gif":
	// 				case "image/tif":
	// 					node = document.createElement("img");
	// 					//a szerver oldalon generált id-val tesszük le a képet, így a form post során regexppel ki tudjuk venni a
	// 					// megmaradó elemeket (gc a feleslegesen feltöltött file-ok számára)
	// 					node.setAttribute("src", response.src);
	// 					node.setAttribute("id", response.id);
	// 					// $(el).summernote("editor.insertImage", url);
	// 					break;
	// 				default:
	// 					console.log(node);
	// 					break;
	// 			}
	// 		}
	//
	// 		if(typeof last_focused_el != 'undefined'){
	//
	// 			var range = document.createRange();
	// 			var sel = window.getSelection();
	//
	// 			range.setStart(last_focused_el, last_focused_el.length); // put the cursor in last position of the element
	// 			range.collapse(true);
	// 			sel.removeAllRanges();
	// 			sel.addRange(range);
	// 			var self = $(currentSummernoteEditor).summernote('code');
	//
	// 			try {
	// 				last_focused_el.focus();
	// 			}
	// 			catch(err) {
	// 				console.log(err.message);
	// 			}
	//
	// 			$(currentSummernoteEditor).summernote('editor.insertNode', node);
	// 		}
	//
	// 	}, 'json');
	// 	return false;
	// });

}));

function ajaxSummernoteUploadFile(file, el, url) {
	var form_data = new FormData();
	form_data.append("embedfile", file);
	$.ajax({
		data: form_data,
		type: "POST",
		url: url,
		cache: false,
		contentType: false,
		processData: false,
		dataType: "json",
		success: function(response) {
			var node = document.createElement("a");
			node.setAttribute("href", response.src);
			var createAText = document.createTextNode("letöltés");
			node.appendChild(createAText);
			node.setAttribute("target", "_blank");
			node.setAttribute("id", response.id);

			if(response.mime_type > ""){
				switch(response.mime_type){
					case "image/jpg":
					case "image/jpeg":
					case "image/png":
					case "image/gif":
					case "image/tif":
						node = document.createElement("img");
						//a szerver oldalon generált id-val tesszük le a képet, így a form post során regexppel ki tudjuk venni a
						// megmaradó elemeket (gc a feleslegesen feltöltött file-ok számára)
						node.setAttribute("src", response.src);
						node.setAttribute("id", response.id);
						// $(el).summernote("editor.insertImage", url);
						break;
					default:
						console.log(node);
						break;
				}
			}
			$(el).summernote("editor.insertNode", node);
		}
	});
}
