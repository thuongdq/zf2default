CKEDITOR.dialog.add( 'thumbDialog', function( editor ) {
	return {
		title : 'Thumbnail '+editor.lang.flash.propertiesTab,
		minWidth : 400,
		minHeight : 160,
		contents : [
			{
				id : 'general',
				label : 'Settings',
				elements : [
					{
						type : 'text',
						id : 'file_url',
						label : editor.lang.common.url,
						validate : CKEDITOR.dialog.validate.notEmpty( 'The link must have a URL.' ),
						required : true,
						setup: function( element ) {
							if(element.hasClass('thumbnailbox')) {
								this.setValue( element.find('.thumbnail').getItem(0).getChild(0).getAttribute( 'src' ) );
							}
							if(element.hasClass('lightbox-css')) {
								this.setValue( element.find('.lightbox').getItem(0).getChild(0).getAttribute( 'src' ) );
							}
                        },
						commit : function( data ) {
							data.file_url = this.getValue();
						}
					},
					{
						id:'img_url',
						type:'text',
						hidden : true,
						label:editor.lang.image.url,accessKey:'A',
						'default':'',
						setup: function( element ) {
                            if(element.hasClass('thumbnailbox')) {
								this.setValue( element.find('.thumbnail').getItem(0).getAttribute( 'href' ) );
							}
							if(element.hasClass('lightbox-css')) {
								var img_id = element.find('.lightbox').getItem(0).getAttribute( 'href' ).replace('#', '');
								var img_div = editor.document.getById( img_id );
								this.setValue( img_div.find('.lightboxcssImg').getItem(0).getAttribute( 'src' ) );
							}
                        },
						commit : function( data ) {
							data.img_url = this.getValue();
						}
					},
					{
					type: 'hbox',
					children: [
						{
							type: 'html',
							id: 'htmlPreview',
							html: '<div>' + CKEDITOR.tools.htmlEncode( editor.lang.common.preview ) + '<br>' +
							'<div class="ImagePreview" id="ImagePreviewBox" style="border: 2px ridge black;height: 80px;width: 80px;background-color: white;background-size:100% auto;"></div></div>',
							setup: function( element ) {
								if(element.hasClass('thumbnailbox')) {
									CKEDITOR.document.getById( 'ImagePreviewBox' ).setStyle( 'background-image', 'url("'+element.getChild(0).getAttribute( 'src' )+'")' );
								}
								else if(element.hasClass('lightbox-css')) {
									CKEDITOR.document.getById( 'ImagePreviewBox' ).setStyle( 'background-image', 'url("'+element.find('.lightbox').getItem(0).getChild(0).getAttribute( 'src' )+'")' );
								}
							},
						},
						{
							type: 'select',
							id: 'img_option',
							label: 'Thumbnail type',
							items:[[editor.lang.common.notSet,'']],
							'default': '',
							onChange: function( api ) {
								var dialog = CKEDITOR.dialog.getCurrent();
								var element_id = CKEDITOR.document.getById( 'ImagePreviewBox' );
								var thumb_url = dialog.getContentElement( 'general', 'file_url' ).getValue();
								if(this.getValue() != '') {
									element_id.setStyle('background-image', 'url("'+thumb_url+'")');
									var thumb_name = thumb_url.substr(thumb_url.lastIndexOf("\/") + 1);
									dialog.setValueOf( 'general', 'file_url', thumb_url.replace(thumb_name, this.getValue()) );
								}
							},
							setup: function( element ) {
								var value;
								var dialog = CKEDITOR.dialog.getCurrent();
								var thumb_url = dialog.getContentElement( 'general', 'file_url' ).getValue();
								var thumb_name = thumb_url.substr(thumb_url.lastIndexOf("\/") + 1);
								var thumb_urls = dialog.getContentElement( 'general', 'img_url' ).getValue();
								var thumb_names = thumb_urls.substr(thumb_urls.lastIndexOf("\/") + 1);
								var thumb_full_path = thumb_url.substr(0, thumb_url.lastIndexOf("\/")+1);
								var thumb_path = thumb_full_path.substr(thumb_full_path.lastIndexOf('data')-1, thumb_full_path.lastIndexOf("\/")+1);
								$.post('../plugins/responsivefilemanager/fileList.php?path='+thumb_path+'&thumb='+thumb_names, function(data) {
									var obj = JSON.parse(data);
									dialog.getContentElement( 'general', 'img_option' ).clear();
									dialog.getContentElement( 'general', 'img_option' ).add(editor.lang.common.notSet,'');
									for (var i = 0; i < obj.length; i++) {
										for (var categoryid in obj[i]) {
											var category = obj[i][categoryid];
											if(categoryid == 'name') {
												th_name = category;
											}
											if(categoryid == 'dimensions') {
												th_dimen = category;
											}
										}
										if(obj.length < 2) {
											dialog.getContentElement( 'general', 'img_option' ).disable();
										} else {
											dialog.getContentElement( 'general', 'img_option' ).enable();
											dialog.getContentElement( 'general', 'img_option' ).add(th_dimen, th_name);
											if(th_name == thumb_name) {
												value = th_name;
											}
										}
									}
									valueIsReady(value);
								});
								function valueIsReady(value) {
									dialog.getContentElement( 'general', 'img_option' ).setValue( value );
								}
							},
							commit : function( data ) {
								data.img_Opt = this.getValue();
							}
						},
						{
							type : 'button',
							hidden : true,
							id : 'browse',
							style : 'position: absolute;right: 16px;',
							align : 'center',
							label : editor.lang.common.browseServer,
							filebrowser : {
							action : 'Browse',
							onSelect : function( fileUrl, data ) {
								var dialog = this.getDialog();
								dialog.getContentElement( 'general', 'file_url' ).setValue( fileUrl.replace('uploads', 'thumbs') );
								dialog.getContentElement( 'general', 'img_url' ).setValue( fileUrl );
								var thumb_url = dialog.getContentElement( 'general', 'file_url' ).getValue();
								var thumb_name = thumb_url.substr(thumb_url.lastIndexOf("\/") + 1);
								var thumb_full_path = thumb_url.substr(0, thumb_url.lastIndexOf("\/")+1);
								var thumb_path = thumb_full_path.substr(thumb_full_path.lastIndexOf('data')-1, thumb_full_path.lastIndexOf("\/")+1);
								var element_id = CKEDITOR.document.getById( 'ImagePreviewBox' );
								element_id.setStyle('background-image', 'url("'+thumb_url+'")');
								$.post('../plugins/responsivefilemanager/fileList.php?path='+thumb_path+'&thumb='+thumb_name, function(data) {
									var obj = JSON.parse(data);
									dialog.getContentElement( 'general', 'img_option' ).clear();
									dialog.getContentElement( 'general', 'img_option' ).add(editor.lang.common.notSet,'');
									for (var i = 0; i < obj.length; i++) {
										for (var categoryid in obj[i]) {
											var category = obj[i][categoryid];
											if(categoryid == 'name') {
												th_name = category;
											}
											if(categoryid == 'dimensions') {
												th_dimen = category;
											}
										}
										if(obj.length < 2) {
											dialog.getContentElement( 'general', 'img_option' ).disable();
										} else {
											dialog.getContentElement( 'general', 'img_option' ).enable();
											dialog.getContentElement( 'general', 'img_option' ).add(th_dimen, th_name);
										}
									}
								});
								return false;
							}
							}
						}
					]
					},
					{
						id:'txtAlt',
						type:'text',
						label:editor.lang.image.alt,accessKey:'A',
						'default':'',
						setup: function( element ) {
                            if(element.hasClass('thumbnailbox')) {
								this.setValue( element.find('.thumbnail').getItem(0).getChild(0).getAttribute( 'alt' ) );
							}
							if(element.hasClass('lightbox-css')) {
								var img_id = element.find('.lightbox').getItem(0).getAttribute( 'href' ).replace('#', '');
								var img_div = editor.document.getById( img_id );
								this.setValue( img_div.find('.lightbox-title').getItem(0).getText() );
							}
                        },
						commit : function( data ) {
							data.txtAlt = this.getValue();
						}
					},
					{
					type:'hbox',
					children:[
						{
							type: 'select',
							id: 'img_Align',
							label: editor.lang.common.align,
							items:[[editor.lang.common.notSet,''], [editor.lang.common.alignLeft,'left'],[editor.lang.common.alignRight,'right']],
							'default':'left',
							setup: function( element ) {
								var value = element.getStyle( 'float' );
								this.setValue( value );
							},
							commit : function( data ) {
								data.img_Align = this.getValue();
							}
						},
						{
							type: 'select',
							id: 'img_loader',
							label: editor.lang.common.target,
							items:[[editor.lang.common.targetNew,'_blank'], [editor.lang.common.targetSelf,'_self'], ['Simple Thumb','simplethumb'], ['prettyPhoto','prettyPhoto'], ['FancyBox','fancybox'], ['BaguetteBox','baguettebox'], ['LightBox CSS','lightboxcss']],
							onChange: function( api ) {
								var dialog = CKEDITOR.dialog.getCurrent();
								var element_id = dialog.getContentElement( 'general', 'baguette_settings' );
								var lightboxcss_id = dialog.getContentElement( 'general', 'lightboxcss_settings' );
								var gall_id = dialog.getContentElement( 'general', 'gallery_id' );
								if(this.getValue() == 'baguettebox') {
									element_id.getElement().show();
									lightboxcss_id.getElement().show();
									gall_id.disable();
								}
								else {
									lightboxcss_id.getElement().show();
									element_id.getElement().hide();
									gall_id.enable();
								}
								if(!this.insertMode) {
									this.disable();
								}
							},
							setup: function( element ) {
								var value = element.getAttribute( 'class' );
								var loader;
								if(element.getAttribute( 'target' ) == '_blank') loader = '_blank';
								if(element.getAttribute( 'target' ) == '_self') loader = '_self';
								if (value.indexOf('simplethumb') >= 0) loader = 'simplethumb';
								if (value.indexOf('prettyPhoto') >= 0) loader = 'prettyPhoto';
								if (value.indexOf('fancybox') >= 0) loader = 'fancybox';
								if (value.indexOf('baguette') >= 0) loader = 'baguettebox';
								if (value.indexOf('lightbox-css') >= 0) loader = 'lightboxcss';
								this.setValue( loader );
								if(!this.insertMode) {
									this.disable();
								}
							},
							commit : function( data ) {
								data.img_loader = this.getValue();
							}
						},
						{
							id:'img_margins',
							type:'text',
							label:'Margins (px)',
							validate: CKEDITOR.dialog.validate.integer(editor.lang.common.validateNumberFailed),
							'default':'',
							setup: function( element ) {
								var value = element.getStyle( 'margin' );
								var p_class = element.getAttribute( 'class' );
								p_class = p_class.substring(p_class.lastIndexOf('animation'),p_class.length);
								if(p_class == 'animation-polaroid') {
									value = value.substring(8,value.split('px', 3).join('px').length);
								}
								else if(p_class == 'animation-zoom') {
									value = value.substring(3,value.split('px', 2).join('px').length);
								}
								else if(p_class == 'animation-default') {
									value = value.substring(3,value.split('px', 2).join('px').length);
								}
								else { value = value.replace('px', ''); }
								if(value != null) {
									this.setValue( value.trim() );
								}
							},
							commit : function( data ) {
								data.img_margins = this.getValue();
							}
						},
					]},
					{
						type:'hbox',
						id:'lightboxcss_settings',
						hidden : false,
						children:[
							{
								id:'gallery_id',
								type:'text',
								label:'Gallery ID',
								title: 'Gallery ID class name (eg.: gallery-1)',
								'default':'',
								setup: function( element ) {
									var dialog = CKEDITOR.dialog.getCurrent();
									var loader = dialog.getContentElement( 'general', 'img_loader' ).getValue();
									if(loader == 'lightboxcss') {
										var img_id = element.find('.lightbox').getItem(0).getAttribute( 'href' ).replace('#', '');
										var img_div = editor.document.getById( img_id );
										var value = img_div.getAttribute( 'class' ).replace('lightbox-target', '');
									}
									else if(loader == 'baguettebox') {
										var value = 'baguetteBox';
										this.disable();
									}
									else {
										var value = element.find('.thumbnail').getItem(0).getAttribute( 'rel' );
										value = value.substring(value.lastIndexOf('[')+1,value.lastIndexOf(']'));
									}
									if(value != null) {
										this.setValue( value.trim() );
									}
								},
								commit : function( data ) {
									data.gallery_id = this.getValue();
								}
							},
							{
								type: 'select',
								id: 'lightboxcss_class',
								label: 'Gallery type',
								title: 'Choose a gallery animation class name',
								items:[[editor.lang.common.notSet,''], ['Default','animation-default'], ['Zoom','animation-zoom'], ['Polaroid','animation-polaroid'], ['Custom','animation-custom']],
								'default': 'animation-default',
								setup: function( element ) {
									var value = element.getAttribute( 'class' );
									value = value.substring(value.lastIndexOf('animation'),value.length);
									this.setValue( value );
								},
								commit : function( data ) {
									data.lightboxcss_settings = this.getValue();
								}
							},
							{
								id:'round_corner',
								type:'text',
								label:'Border radius (px)',
								validate: CKEDITOR.dialog.validate.integer(editor.lang.common.validateNumberFailed),
								'default':'',
								setup: function( element ) {
									var value = element.getStyle( 'border-radius' );
									this.setValue( value.replace('px', '') );
								},
								commit : function( data ) {
									data.round_corner = this.getValue();
								}
							},
					]},
					{
						type:'hbox',
						id:'baguette_settings',
						hidden : true,
						children:[
							{
								type: 'checkbox',
								id: 'baguette_first',
								label: 'Start a new gallery',
								title: 'Check if this image is the first in the gallery',
								'default': false,
								commit : function( data ) {
									data.baguette_first = this.getValue();
								}
							},
					]},
				]
			}
		],
		onShow: function() {
            var selection = editor.getSelection();
            var element = selection.getStartElement();
			var p_element = selection.getStartElement();
			if ( element.getAscendant( 'p' ) !== null && element.getAscendant( 'p', true ).hasClass('thumbnailbox') ) {
                element = element.getAscendant( 'p', true );
				this.insertMode = false;
			}
			else if ( element.getAscendant( 'p' ) !== null && element.getAscendant( 'p', true ).hasClass('lightbox-css') ) {
                element = element.getAscendant( 'p', true );
				this.insertMode = false;
			}
            else {
                this.insertMode = true;
			}
			console.log("Insert Mode: "+this.insertMode);
            this.element = element;
            if ( !this.insertMode ) {
                this.setupContent( this.element );
			}
			else
				CKEDITOR.document.getById( 'ImagePreviewBox' ).setStyle('background-image', 'none');
		},
		onOk : function() {
			var dialog = this, data = {}, reff = editor.document.createElement( 'a' );
			var styles = 'border: 0 none;';
			this.commitContent( data );
			var p_elem = this.element;
			if(data.img_loader == 'lightboxcss') {
				p_elem.setAttribute( 'class', 'lightbox-css '+data.lightboxcss_settings );
				var p_elems = editor.document.find( '.lightbox-css' ).count();
				p_elem.setAttribute( 'id', 'lightboxcss'+'-'+p_elems );
			}
			else if(data.img_loader == 'baguettebox') {
				if(!data.baguette_first && this.insertMode) {
					var p_elems = editor.document.find( '.baguettebox' ).count();
					var baguete_parent = p_elem.getParent();
					var baguete_p = CKEDITOR.dom.element.createFromHtml( '<p class="new_temp"></p>' );
					editor.document.getById( baguete_parent.getId() ).append( baguete_p );
					var p_last = editor.document.find('.new_temp').getItem(0);
					var range = new CKEDITOR.dom.range(editor.document);
					range.moveToElementEditablePosition(p_last, true);
					editor.getSelection().selectRanges([range]);
					p_elem = p_last;
				}
				p_elem.setAttribute( 'class', 'thumbnailbox baguette '+data.lightboxcss_settings );
			}
			else if(data.img_loader != 'simplethumb') {
				if(this.insertMode == false) {
					p_elem.removeAttribute( 'class' );
				}
				p_elem.setAttribute( 'class', 'thumbnailbox '+data.img_loader+' '+data.lightboxcss_settings );
				var p_elems = editor.document.find( '.thumbnailbox' ).count();
					p_elem.setAttribute( 'id', 'thumbnailbox'+'-'+p_elems );
			}
			if(data.img_Align == 'left' || data.img_Align == 'right') {
				var floats = 'float: '+data.img_Align+';';
			}
			else {
				var floats = '';
			}
			if(data.img_margins != '') {
				if(data.img_loader == 'simplethumb') {
					var margins = 'margin: '+data.img_margins+'px;';
				}
				else {
					var margins = 'margin:0 '+data.img_margins+'px '+data.img_margins/2+'px 0;';
				}
			}
			else {
				var margins = 'margin:0;';
			}
			if(data.round_corner != '') {
				var border_r = 'border-radius: '+data.round_corner+'px;';
			}
			else {
				var border_r = '';
			}
			if(data.lightboxcss_settings == 'animation-polaroid') {
				var margins = 'margin:0 0 10px 0;';
				var border_r = '';
			}
			var tmpImg = new Image();
			tmpImg.src = data.file_url;
			var thumb_width = 'width:'+tmpImg.width+'px;';
			var thumb_height = 'height:'+tmpImg.height+'px;';
			if(data.img_loader != 'simplethumb') {
				p_elem.setAttribute( 'style', floats+margins+border_r+thumb_width+thumb_height );
			}
			reff.setAttribute('href', data.img_url);
			if(data.img_loader == '_blank' || data.img_loader == '_self') {
				reff.setAttribute('target', data.img_loader);
				reff.setAttribute('class', 'thumbnail');
			} else if(data.img_loader == 'baguettebox') {
				reff.setAttribute('class', 'thumbnail');
			}
			else {
				if(data.img_loader != 'baguettebox' && data.img_loader != 'lightboxcss') {
					reff.setAttribute('class', 'thumbnail');
					if(data.gallery_id != '') {
						reff.setAttribute('rel', data.img_loader+'['+data.gallery_id+']');
					}
					else {
						reff.setAttribute('rel', data.img_loader);
					}
				}
			}
			if(data.baguette_first && this.insertMode) {
				divf = editor.document.createElement( 'div' );
				var p_elems = editor.document.find( '.baguettebox' ).count();
				divf.setAttribute('class', 'baguettebox');
				divf.setAttribute( 'id', 'baguette'+'-'+p_elems );
				if(data.lightboxcss_settings == 'animation-polaroid') {
					var bag_span = '<span class="polaroid-title">'+data.txtAlt+'</span>';
				}
				else if(data.lightboxcss_settings == 'animation-default') {
					var bag_span = '<span class="default-title">'+data.txtAlt+'</span>';
				}
				else {
					var bag_span = '';
				}
				var p_elem_styles = floats+margins+border_r+thumb_width+thumb_height;
				p_elem_styles = p_elem_styles.trim();
				divf.setHtml( '<p class="thumbnailbox baguette '+data.lightboxcss_settings+'" style="'+p_elem_styles+'"><a href="'+data.img_url+'" class="thumbnail"><img class="'+data.img_loader+'Img" alt="'+data.txtAlt+'" src="'+data.file_url+'" style="'+styles+'" />'+bag_span+'</a></p><p class="new_temp"></p>' );
				editor.insertElement( divf );
				var p_last = editor.document.find('.new_temp').getItem(0);
				var range = new CKEDITOR.dom.range(editor.document);
				range.moveToElementEditablePosition(p_last, true);
				editor.getSelection().selectRanges([range]);
			}
			else if(data.img_loader == 'lightboxcss' && this.insertMode) {
				var thumb_url = dialog.getContentElement( 'general', 'file_url' ).getValue();
				var thumb_name = thumb_url.substr(thumb_url.lastIndexOf("\/") + 1, thumb_url.lastIndexOf("."));
				thumb_name = thumb_name.toLowerCase();
				thumb_name = thumb_name.split(".");
				thumb_name.pop();
				thumb_name.join('');
				var target_class = data.lightboxcss_settings;
				var gallery_class = data.gallery_id;
				if(gallery_class != '') {
					var elements = editor.document.find( '.'+gallery_class+'.lightbox-target' ), i = 0, element;
					var elements_count = elements.count();
					var prev_id, next_id;
					while ( element = elements.getItem( i++ ) ) {
						var el_prev = editor.document.getById( element.getId() ).find( '.'+gallery_class+' .prevLight' );
						var el_next = editor.document.getById( element.getId() ).find( '.'+gallery_class+' .nextLight' );
						if(elements_count != 0) {
							if( i == 1 && elements_count == 1) {
								var prev = CKEDITOR.dom.element.createFromHtml( '<a class="prevLight" href="#'+gallery_class+'-'+thumb_name+'">&nbsp;</a>' );
								editor.document.getById( elements.getItem(0).getId() ).append( prev );
								var next = CKEDITOR.dom.element.createFromHtml( '<a class="nextLight" href="#'+gallery_class+'-'+thumb_name+'">&nbsp;</a>' );
								editor.document.getById( elements.getItem(0).getId() ).append( next );
							}
							if( i == 1 && elements_count == 2) {
								elements.getItem(0).find('.prevLight').getItem(0).setAttribute('data-cke-saved-href', '#'+gallery_class+'-'+thumb_name);
								elements.getItem(0).find('.nextLight').getItem(0).setAttribute('data-cke-saved-href', '#' + elements.getItem(1).getId());
								elements.getItem(1).find('.prevLight').getItem(0).setAttribute('data-cke-saved-href', '#' + elements.getItem(0).getId());
								elements.getItem(1).find('.nextLight').getItem(0).setAttribute('data-cke-saved-href', '#'+gallery_class+'-'+thumb_name);
							}
							if( i == 2 && elements_count == 3) {
								elements.getItem(1).find('.prevLight').getItem(0).setAttribute('data-cke-saved-href', '#' + elements.getItem(0).getId());
								elements.getItem(1).find('.nextLight').getItem(0).setAttribute('data-cke-saved-href', '#' + elements.getItem(2).getId());
								elements.getItem(2).find('.prevLight').getItem(0).setAttribute('data-cke-saved-href', '#' + elements.getItem(1).getId());
								elements.getItem(2).find('.nextLight').getItem(0).setAttribute('data-cke-saved-href', '#'+gallery_class+'-'+thumb_name);
							}
							if( i == elements_count ) {
								if(elements_count == 1) {
									prev_id = '#' + elements.getItem(0).getId();
									next_id = '#' + elements.getItem(0).getId();
								}
								if(elements_count == 2) {
									prev_id = '#' + elements.getItem(1).getId();
									next_id = '#' + elements.getItem(0).getId();
								}
								if(elements_count > 2) {
									prev_id = '#' + elements.getItem(elements_count-1).getId();
									next_id = '#' + elements.getItem(0).getId();
									elements.getItem(elements_count-1).find('.nextLight').getItem(0).setAttribute('data-cke-saved-href', '#'+gallery_class+'-'+thumb_name);
								}
								var prev_el = elements.getItem(0).find('.prevLight').getItem(0);
								if(prev_el != null) {
									elements.getItem(0).find('.prevLight').getItem(0).setAttribute('data-cke-saved-href', '#'+gallery_class+'-'+thumb_name);
								}
							}
						}
					} //end while
				}
				else gallery_class = 'single';
				if(data.lightboxcss_settings == 'animation-polaroid') {
					var imgHtml = CKEDITOR.dom.element.createFromHtml('<a href="#'+gallery_class+'-'+thumb_name+'" class="lightbox"><img class="thumbnail" src="'+data.file_url+'" /><span class="polaroid-title">'+data.txtAlt+'</span></a>');
				}
				else if(data.lightboxcss_settings == 'animation-default') {
					var imgHtml = CKEDITOR.dom.element.createFromHtml('<a href="#'+gallery_class+'-'+thumb_name+'" class="lightbox"><img class="thumbnail" src="'+data.file_url+'" /><span class="default-title"></span></a>');
				}
				else {
					var imgHtml = CKEDITOR.dom.element.createFromHtml('<a href="#'+gallery_class+'-'+thumb_name+'" class="lightbox"><img class="thumbnail" src="'+data.file_url+'" /></a>');
				}
				if(data.txtAlt != '') {
					var add_title = '<span class="lightbox-title">'+data.txtAlt+'</span>';
				}
				else {
					var add_title = '';
				}
				if(elements_count == 0 || gallery_class == 'single') {
					var imgHtml1 = CKEDITOR.dom.element.createFromHtml('<div id="'+gallery_class+'-'+thumb_name+'" class="'+gallery_class+' lightbox-target"><img class="'+data.img_loader+'Img" alt="'+data.txtAlt+'" src="'+data.img_url+'" />'+add_title+'<a class="lightbox-close" href="#">&nbsp;</a></div>');
				}
				else {
					var imgHtml1 = CKEDITOR.dom.element.createFromHtml('<div id="'+gallery_class+'-'+thumb_name+'" class="'+gallery_class+' lightbox-target"><img class="'+data.img_loader+'Img" alt="'+data.txtAlt+'" src="'+data.img_url+'" />'+add_title+'<a class="lightbox-close" href="#">&nbsp;</a><a class="prevLight" href="'+prev_id+'">&nbsp;</a><a class="nextLight" href="'+next_id+'">&nbsp;</a></div>');
				}
				editor.insertElement( imgHtml );
				editor.insertElement( imgHtml1 );
				
			}
			else {
				if(data.lightboxcss_settings == 'animation-polaroid') {
					reff.setHtml( '<img class="'+data.img_loader+'Img" alt="'+data.txtAlt+'" src="'+data.file_url+'" /><span class="polaroid-title">'+data.txtAlt+'</span>' );
				}
				else if(data.lightboxcss_settings == 'animation-default') {
					reff.setHtml( '<img class="'+data.img_loader+'Img" alt="'+data.txtAlt+'" src="'+data.file_url+'" /><span class="default-title">'+data.txtAlt+'</span>' );
				}
				else {
					if(!this.insertMode) {
						var is_span = this.element.find('span').getItem(0);
						if(is_span != null) {
							this.element.find('span').getItem(0).remove();
						}
					}
					if(data.img_loader == 'simplethumb') {
						simplet = editor.document.createElement( 'img' );
						simplet.setAttribute('class', 'simple-thumb');
						simplet.setAttribute('alt', data.txtAlt);
						simplet.setAttribute('src', data.file_url);
						simplet.setAttribute('style', styles+floats+margins+border_r);
					}
					else {
						reff.setHtml( '<img class="'+data.img_loader+'Img" alt="'+data.txtAlt+'" src="'+data.file_url+'" style="'+styles+'" />' );
					}
				}
			}
			if ( !this.insertMode ) {
				$( '.thumbnail' ).remove();
			}
			if(data.img_loader != 'simplethumb') {
				editor.insertElement( reff );
			}
			else {
				editor.insertElement( simplet );
			}
		}
	};
});