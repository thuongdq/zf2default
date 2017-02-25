CKEDITOR.plugins.add( 'thumb', {
    icons: 'thumb',
    init: function( editor ) {
        editor.addCommand( 'thumbDialog', new CKEDITOR.dialogCommand( 'thumbDialog' ) );
        editor.ui.addButton( 'Thumb', {
            label: 'Insert Thumbnail',
            command: 'thumbDialog',
			icon: this.path + 'icons/thumb.png',
            toolbar: 'insert'
        });
		if (editor.addMenuItems) {
			editor.addMenuItem('thumbDialog', {
				label: 'Edit Thumbnail',
				command: 'thumbDialog',
				icon: this.path + 'icons/thumb.png',
				group: 'image', order: 3
			});
		}
		if (editor.contextMenu) {
			editor.contextMenu.addListener(function(element, selection) {
				if ( element.getAscendant( 'a', true ) && element.getAscendant( 'a', true ).hasClass('thumbnail') || element.getAscendant( 'a', true ) && element.getAscendant( 'a', true ).hasClass('lightbox') ) {
					editor.contextMenu.removeAll();
					return { thumbDialog: CKEDITOR.TRISTATE_OFF };
				}
			});
		}
		CKEDITOR.dialog.add( 'thumbDialog', this.path + 'dialogs/thumb.js' );	
    }
});