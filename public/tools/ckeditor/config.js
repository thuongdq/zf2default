/**
 * @license Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here.
	// For complete reference see:
	// http://docs.ckeditor.com/#!/api/CKEDITOR.config

	// The toolbar groups arrangement, optimized for two toolbar rows.
	config.toolbarGroups = [
		{ name: 'clipboard',   groups: [ 'clipboard', 'undo' ] },
		{ name: 'editing',     groups: [ 'find', 'selection', 'spellchecker' ] },
		{ name: 'links' },
		{ name: 'insert' },
		{ name: 'forms' },
		{ name: 'tools' },
		{ name: 'document',	   groups: [ 'mode', 'document', 'doctools' ] },
		{ name: 'others' },
		'/',
		{ name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
		{ name: 'paragraph',   groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ] },
		{ name: 'styles' },
		{ name: 'colors' },
		{ name: 'about' }
	];

	// Remove some buttons provided by the standard plugins, which are
	// not needed in the Standard(s) toolbar.
	config.removeButtons = 'Underline,Subscript,Superscript';

	// Set the most common block elements.
	config.format_tags = 'p;h1;h2;h3;pre';

	// Simplify the dialog windows.
	config.removeDialogTabs = 'image:advanced;link:advanced';
	config.width = "600px"
	
//    config.filebrowserBrowseUrl = BASEPATH + '/kcfinder-2.52/browse.php?opener=ckeditor&type=files';
//    config.filebrowserImageBrowseUrl = BASEPATH + '/kcfinder-2.52/browse.php?opener=ckeditor&type=images';
//    config.filebrowserFlashBrowseUrl = BASEPATH + '/kcfinder-2.52/browse.php?opener=ckeditor&type=flash';
//    config.filebrowserUploadUrl = BASEPATH + '/kcfinder-2.52/upload.php?opener=ckeditor&type=files';
//    config.filebrowserImageUploadUrl = BASEPATH + '/kcfinder-2.52/upload.php?opener=ckeditor&type=images';
//    config.filebrowserFlashUploadUrl = BASEPATH + '/kcfinder-2.52/upload.php?opener=ckeditor&type=flash';
	
    
//    config.filebrowserBrowseUrl = BASEPATH + '/ckfinder/ckfinder.html',
//    config.filebrowserImageBrowseUrl = BASEPATH + '/ckfinder/ckfinder.html?type=Images',
//    config.filebrowserUploadUrl = BASEPATH + '/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Files',
//    config.filebrowserImageUploadUrl = BASEPATH + '/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Images'
		
		config.filebrowserBrowseUrl = BASEPATH +'filemanager/dialog.php?type=2&editor=ckeditor&fldr=',
		config.filebrowserUploadUrl = BASEPATH + 'filemanager/dialog.php?type=2&editor=ckeditor&fldr=',
		config.filebrowserImageBrowseUrl = BASEPATH + 'filemanager/dialog.php?type=1&editor=ckeditor&fldr='
};
