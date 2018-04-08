(function( $ ) {

	window.bt_no_posts = false;
	window.bt_loading_grid = false;
	
	window.bt_ajax_req = [];

	$( document ).ready(function() {
	
		$( '.btGridContainer' ).height( window.innerHeight );
	
		$( '.tilesWall.btAjaxGrid' ).each(function() {
			window.bt_scroll_loading = $( this ).data( 'scroll-loading' ) == 'yes' ? true : false;
			window.bt_grid_type = $( this ).data( 'grid-type' );
			window.bt_tiled_format = $( this ).data( 'format' ) + '';
			if ( window.bt_tiled_format != '' ) {
				window.bt_tiled_format = window.bt_tiled_format.split( ',' );
			} else {
				window.bt_tiled_format = [];
			}
			var $c = $( this );

			$c.packery({
				itemSelector: '.gridItem',
				columnWidth: '.gridSizer',
				gutter: 0,
				percentPosition: true,
				transitionDuration: 0,
				isResizeBound: false
			});

			bt_load_posts( document.querySelector( '.tilesWall.btAjaxGrid' ) );

		});
		
		$( '.btCatFilterItem.all' ).addClass( 'active' );
		
		$( '.btCatFilterItem' ).click(function() {
			$( '.btCatFilterItem' ).removeClass( 'active' );
			$( this ).addClass( 'active' );
			$( '.tilesWall.btAjaxGrid' ).data( 'cat-slug', $( this ).data( 'slug' ) );
			for ( var n = 0; n < window.bt_ajax_req.length; n++ ) {
				window.bt_ajax_req[ n ].abort();
			}
			window.bt_ajax_req = [];
			
			$( '.btGridContainer' ).height( $( '.btGridContainer' ).height() );
			
			var $container = $( '.tilesWall.btAjaxGrid' ).packery();
			$container.packery( 'remove', $( '.gridItem' ) );
			$container.packery();

			window.bt_grid_offset = 0;

			window.bt_no_posts = false;
			$( '.btNoMore' ).hide();
			$( '.btLoaderGrid' ).show();
			bt_load_posts( document.querySelector( '.tilesWall.btAjaxGrid' ) );
		});
		
	});
	
	$( window ).resize(function() {
		$( '.tilesWall.btAjaxGrid' ).each(function() {
			$c = $( this );
			bt_packery_tweak( $c, window.bt_grid_type );
			setTimeout(function() {
				bt_packery_tweak( $c, window.bt_grid_type );
			}, 150 );
		});
	});
	
	$( window ).scroll(function() {
		if ( bt_is_load_scroll() && window.bt_scroll_loading && ! window.bt_no_posts && ! window.bt_loading_grid ) {
			window.bt_loading_grid = true;
			bt_load_posts( document.querySelector( '.tilesWall.btAjaxGrid' ) );
		}
	});

	var bt_is_load_scroll = function() {
		var $c = $( '.tilesWall.btAjaxGrid' );
		var height = window.innerHeight
		|| document.documentElement.clientHeight
		|| document.body.clientHeight;
		if ( $( window ).scrollTop() + height > $c.offset().top + $c.height() ) {
			return true;
		}
		return false;
	}

	// ajax loader
	
	window.bt_ajax_elems_all = [];
	
	var bt_load_posts = function( target ) {
		if ( typeof window.bt_grid_offset === 'undefined' ) window.bt_grid_offset = 0;
		var num = $( target ).data( 'num' );
		var data = {
			'action': 'bt_get_grid',
			'number': num,
			'offset': window.bt_grid_offset,
			'cat_slug': $( target ).data( 'cat-slug' ),
			'post_type': $( target ).data( 'post-type' ),
			'grid_type': $( target ).data( 'grid-type' ),
			'tiles_title': $( target ).data( 'tiles-title' ),
			'related': $( target ).data( 'related' ),
			'sticky_in_grid': $( target ).data( 'sticky' ),
			'format': window.bt_tiled_format.slice( window.bt_grid_offset, window.bt_grid_offset + num ).join()
		};
		window.bt_grid_offset = window.bt_grid_offset + num;
		$( '.btLoaderGrid' ).css( 'opacity', '1' );
		window.bt_ajax_req.push($.ajax({
			type: 'POST',
			url: window.BoldThemesAJAXURL,
			data: data,
			async: true,
			success: function( response ) {
			
				var iOS = ( navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false );
				
				if ( ! window.bt_scroll_loading ) $( '.btLoaderGrid' ).hide();

				if ( response.indexOf( 'no_posts' ) == 0 ) {
					$( '.btLoaderGrid' ).css( 'opacity', '0' );
					$( '.btLoaderGrid' ).hide();
					if ( window.bt_scroll_loading ) $( '.btNoMore' ).fadeIn();
					window.bt_no_posts = true;
					return;
				}
				
				$post = JSON.parse( response );

				window.bt_ajax_elems = [];
				
				$( '.btLoaderGrid' ).css( 'opacity', '0' );

				for ( var i = 0; i < $post.length; i++ ) {
					var elem = document.createElement( 'div' );
					elem.className = $post[ i ].container_class;

					$( elem ).append( $post[ i ].html );
					
					window.bt_ajax_elems.push( elem );
					window.bt_ajax_elems_all.push( elem );
					
					$( elem ).attr( 'data-i', i );
					
					imagesLoaded( window.bt_ajax_elems_all[ window.bt_ajax_elems_all.length - 1 ], function() {
						var n = $( this.elements[0] ).attr( 'data-i' );
						$( this.elements[0] ).css( { 'transition-delay': .1 + n * .1 + 's' } );
						$( this.elements[0] ).addClass( 'btGridItemLoaded' );
					});
				}

				for ( var i = 0; i < window.bt_ajax_elems.length; i++ ) {

					$( target ).append( window.bt_ajax_elems[ i ] );
					
					var $container = $( '.tilesWall.btAjaxGrid' ).packery();
					$container.packery( 'appended', window.bt_ajax_elems[ i ] );
					
					bt_packery_tweak( $( target ), window.bt_grid_type );
					
					if ( window.bt_grid_type == 'classic' ) {
						$( '.btMediaBox' ).each(function() {
							if ( $( this ).attr( 'data-hw' ) != undefined ) {
								$( this ).height( $( this ).outerWidth( true ) * $( this ).attr( 'data-hw' ) );
							}
						});
					}
					
					bt_packery_tweak( $( target ), window.bt_grid_type );
					
					$( '.btAjaxGrid .boldPhotoSlide:not(.btFeaturedPostsSlider)' ).each(function() {
						if ( ! $( this ).hasClass( 'slick-initialized' ) ) {
							$( this ).slick({
								dots: false,
								arrows: true,
								infinite: false,
								speed: 300,
								slide: '.bpbItem',
								slidesToShow: 1,
								slidesToScroll: 1,
								useTransform: true,
								prevArrow: window.boldthemes_prevArrowHtml_simple,
								nextArrow: window.boldthemes_nextArrowHtml_simple
							});
						}
					});

					$( '.btAjaxGrid .boldPhotoSlide.btFeaturedPostsSlider' ).each(function() {
						if ( ! $( this ).hasClass( 'slick-initialized' ) ) {
							$( this ).slick({
								dots: false,
								arrows: true,
								infinite: false,
								speed: 300,
								slide: '.bpbItem',
								slidesToShow: 3,
								slidesToScroll: 3,
								prevArrow: window.bt_prevArrowHtml,
								nextArrow: window.bt_nextArrowHtml,
								responsive: [
									{
										breakpoint: 880,
										settings: {
											slidesToShow: 1,
											slidesToScroll: 1
										}
									}
								]
							});
						}
					});
				}

				window.bt_loading_grid = false;
				
				$( '.btGridContainer' ).css( 'height', 'auto' );

				if ( bt_is_load_scroll() && window.bt_scroll_loading && ! window.bt_no_posts ) {
					bt_load_posts( document.querySelector( '.tilesWall.btAjaxGrid' ) );
				}

			},
			error: function( xhr, status, error ) {
				$( '.btLoaderGrid' ).css( 'opacity', '0' );
			}
			
		}));
	}

})( jQuery );