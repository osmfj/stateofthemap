(function( $ ) {
	
	window.bt_event_time = 0;
	window.bt_event_interval = 1500;	
	
	$( document ).ready(function() {
		
		var $pages = $( 'section.step' );
		var pagesCount = $pages.length;
		
		var current = 0;

		$( '.btContent' ).attr( 'id', 'impress' );
		
		impress().init();

		var api = impress();
		
		$( '.btPageWrap' ).append( btGetNavHTML( pagesCount ) );
		
		$( '.btAnimNav li.btAnimNavDot' ).first().addClass( 'active' );

		$( '.btAnimNav li' ).on( 'click', function( e ) {
			
			if ( ( ! $( this ).hasClass( 'active' ) || $( this ).hasClass( 'btAnimNavPrev' ) || $( this ).hasClass( 'btAnimNavNext' ) ) ) {
				
				if ( e.originalEvent !== undefined ) { // human
					clearInterval( window.bt_autoplay_interval );
				}
				
				if ( $( this ).hasClass( 'btAnimNavPrev' ) ) {
					var next = current - 1;
				} else if ( $( this ).hasClass( 'btAnimNavNext' ) ) {
					var next = current + 1;
				} else {
					var next = parseInt( $( this ).data( 'count' ) );
				}
				
				if ( next < 0 ) {
					next = pagesCount - 1;
				} else if ( next > pagesCount - 1 ) {
					next = 0;
				}				
				
				$( '.btAnimNav li' ).removeClass( 'active' );
				$( '.btAnimNav li.btAnimNavDot' ).eq( next ).addClass( 'active' );
				
				api.goto( next );
				
				current = next;
				
			}
			
		});
		
		// mouse wheel & keydown
		$( window ).on( 'mousewheel DOMMouseScroll keydown', function( e ) {
			if ( ( new Date ).getTime() - window.bt_event_time > window.bt_event_interval ) {	
				if ( e.originalEvent.wheelDelta > 0 || e.originalEvent.detail < 0 || e.which == '38' || e.which == '37' ) {
					window.bt_event_time = ( new Date ).getTime();					
					$( 'li.btAnimNavPrev' ).trigger( 'click' );
					clearInterval( window.bt_autoplay_interval );
				} else if ( e.originalEvent.wheelDelta < 0 || e.originalEvent.detail > 0 || e.which == '40' || e.which == '39' || e.which == '32' || e.which == '13' ) {
					window.bt_event_time = ( new Date ).getTime();					
					$( 'li.btAnimNavNext' ).trigger( 'click' );
					clearInterval( window.bt_autoplay_interval );
				}
			}
			if ( e.type != 'keydown' || ( e.which == '38' && e.which == '37' && e.which == '40' && e.which == '39' && e.which == '32' && e.which == '13' ) ) {
				e.preventDefault();
			}
		});
		
		boldthemes_swipedetect( window, function( swipedir ) { // "none", "left", "right", "top", or "down"
			if ( ( new Date ).getTime() - window.bt_event_time > window.bt_event_interval ) {
				if ( swipedir == 'left' || swipedir == 'top' ) {
					window.bt_event_time = ( new Date ).getTime();
					$( 'li.btAnimNavPrev' ).trigger( 'click' );
					clearInterval( window.bt_autoplay_interval );
				} else if ( swipedir == 'right' || swipedir == 'down' ) {
					window.bt_event_time = ( new Date ).getTime();
					$( 'li.btAnimNavNext' ).trigger( 'click' );
					clearInterval( window.bt_autoplay_interval );
				}
			}
		});
		
	});
	
})( jQuery );