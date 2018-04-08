(function( $ ) {
	
	window.bt_event_time = 0;
	window.bt_event_interval = 1200;
	
	$( document ).ready(function() {
	
		$( 'body' ).addClass( 'btPageTransitions' );
		
		$( '.btContent .boldSection' ).addClass( 'btSectionTransitions fullScreenHeight' );
		$( '.btContent' ).addClass( 'fullScreenHeight' );
		
		var current = $( '#' + window.location.hash.replace( /^#\/?/, '' ) ).index();
		if ( current == -1 ) {
			current = 0;
		}

		var $pages = $( 'section.btSectionTransitions' ),
		pagesCount = $pages.length,
		isAnimating = false,
		endCurrPage = false,
		endNextPage = false,
		endCurrPageHalf = false,
		endNextPageHalf = false,
		animEndEventNames = {
			'WebkitAnimation' : 'webkitAnimationEnd',
			'OAnimation' : 'oAnimationEnd',
			'msAnimation' : 'MSAnimationEnd',
			'animation' : 'animationend'
		},
		// animation end event name
		animEndEventName = animEndEventNames[ Modernizr.prefixed( 'animation' ) ],
		// support css animations
		support = Modernizr.cssanimations;
		
		$( '.btPageWrap' ).append( btGetNavHTML( pagesCount ) );
		
		// half page
		
		var bt_half_page = false;
		
		if ( $( 'body' ).hasClass( 'btHalfPage' ) ) {
			bt_half_page = true;
			var $pages_half = new Array();
			$( '.btContentHolder' ).append( '<div class="btHalfPageContainer"></div>' );
			//$( '.btHalfPageContainer' ).addClass('btContent fullScreenHeight');
			$pages.each( function() {
				var clone = $( this ).clone();
				clone.attr( 'id', clone.attr( 'id' ) + '_half_page' );
				clone.addClass( 'btHalfPageSection' ).appendTo( '.btHalfPageContainer' );
				$pages_half.unshift( clone );
			});
		}

		function init() {

			if( $pages.first().data( 'animation' ) === undefined || $pages.first().data( 'animation' ) === '' ) {
				$pages.first().data( 'animation', 1 );
			}
			
			if( $pages.first().data( 'animation-back' ) === undefined || $pages.first().data( 'animation-back' ) === '' ) {
				$pages.first().data( 'animation-back', $pages.first().data( 'animation' ) );
			}

			$pages.each( function() {
				var $page = $( this );
				$page.data( 'originalClassList', $page.attr( 'class' ) );
	
				if ( $page.data( 'animation' ) === undefined || $page.data( 'animation' ) === '' ) {
					$page.data( 'animation', $pages.first().data( 'animation' ) );
				}
				
				if ( $page.data( 'animation-back' ) === undefined || $page.data( 'animation-back' ) === '' ) {
					$page.data( 'animation-back', $pages.first().data( 'animation-back' ) );
				}				
			});
			
			if ( bt_half_page ) {
				for ( var i = 0; i < $pages_half.length; i++ ) {
					$pages_half[ i ].data( 'originalClassList', $pages_half[ i ].attr( 'class' ) );
				}
			}

			$pages.eq( current ).addClass( 'btSectionTransitions-current' );
			if ( bt_half_page ) {
				$pages_half[ pagesCount - 1 - current ].addClass( 'btSectionTransitions-current' );
			}

			$( window ).on( 'btload', function() {
				$pages.eq( current ).find( '.animate' ).addClass( 'animated' );
				if ( bt_half_page ) {
					$pages_half[ pagesCount - 1 - current ].find( '.animate' ).addClass( 'animated' );
				}
				$( window ).trigger( 'boldthemes_section_animation_end', [ $pages.eq( current ) ] );
			});
			
			$( '.btAnimNav li.btAnimNavDot' ).eq( current ).addClass( 'active' );

			$( '.btAnimNav li' ).on( 'click', function( e ) {
				
				if ( ( ! $( this ).hasClass( 'active' ) || $( this ).hasClass( 'btAnimNavPrev' ) || $( this ).hasClass( 'btAnimNavNext' ) ) && ! isAnimating ) {
					
					if ( e.originalEvent !== undefined ) { // human
						clearInterval( window.bt_autoplay_interval );
					}
					
					isAnimating = true;
					
					if ( $( this ).hasClass( 'btAnimNavPrev' ) ) {
						var next = current - 1;
					} else if ( $( this ).hasClass( 'btAnimNavNext' ) ) {
						var next = current + 1;
					} else {
						var next = parseInt( $( this ).data( 'count' ) );
					}
					
					var next_half = pagesCount - 1 - next;
					
					if ( next < 0 ) {
						next = pagesCount - 1;
					} else if ( next > pagesCount - 1 ) {
						next = 0;
					}
					
					if ( next_half < 0 ) {
						next_half = pagesCount - 1;
					} else if ( next_half > pagesCount - 1 ) {
						next_half = 0;
					}					
					
					$( '.btAnimNav li' ).removeClass( 'active' );
					$( '.btAnimNav li.btAnimNavDot' ).eq( next ).addClass( 'active' );
					
					var anim = parseInt( $pages.eq( next ).data( 'animation' ) );
					var anim_half = parseInt( $pages.eq( next ).data( 'animation-back' ) );
					
					if ( ( next < current && ! ( next == 0 && current == pagesCount - 1 ) ) || ( current == 0 && next == pagesCount - 1 ) ) {
						anim = parseInt( $pages.eq( next ).data( 'animation-back' ) );
						anim_half = parseInt( $pages.eq( next ).data( 'animation' ) );
					}

					nextPage( anim, next, anim_half, next_half );
				
				}
				
			});

		}

		function nextPage( anim, next, anim_half, next_half ) {

			isAnimating = true;
			
			var $currPage = $pages.eq( current );

			var $nextPage = $pages.eq( next ).addClass( 'btSectionTransitions-current' ),
				outClass = '', inClass = '';
	
			$currPage.find( '.animated' ).removeClass( 'animated' );

			switch( anim ) {

				case 1:
					outClass = 'btSectionTransitions-moveToLeft';
					inClass = 'btSectionTransitions-moveFromRight';
					break;
				case 2:
					outClass = 'btSectionTransitions-moveToRight';
					inClass = 'btSectionTransitions-moveFromLeft';
					break;
				case 3:
					outClass = 'btSectionTransitions-moveToTop';
					inClass = 'btSectionTransitions-moveFromBottom';
					break;
				case 4:
					outClass = 'btSectionTransitions-moveToBottom';
					inClass = 'btSectionTransitions-moveFromTop';
					break;
				case 5:
					outClass = 'btSectionTransitions-fade';
					inClass = 'btSectionTransitions-moveFromRight btSectionTransitions-ontop';
					break;
				case 6:
					outClass = 'btSectionTransitions-fade';
					inClass = 'btSectionTransitions-moveFromLeft btSectionTransitions-ontop';
					break;
				case 7:
					outClass = 'btSectionTransitions-fade';
					inClass = 'btSectionTransitions-moveFromBottom btSectionTransitions-ontop';
					break;
				case 8:
					outClass = 'btSectionTransitions-fade';
					inClass = 'btSectionTransitions-moveFromTop btSectionTransitions-ontop';
					break;
				case 9:
					outClass = 'btSectionTransitions-moveToLeftFade';
					inClass = 'btSectionTransitions-moveFromRightFade';
					break;
				case 10:
					outClass = 'btSectionTransitions-moveToRightFade';
					inClass = 'btSectionTransitions-moveFromLeftFade';
					break;
				case 11:
					outClass = 'btSectionTransitions-moveToTopFade';
					inClass = 'btSectionTransitions-moveFromBottomFade';
					break;
				case 12:
					outClass = 'btSectionTransitions-moveToBottomFade';
					inClass = 'btSectionTransitions-moveFromTopFade';
					break;
				case 13:
					outClass = 'btSectionTransitions-moveToLeftEasing btSectionTransitions-ontop';
					inClass = 'btSectionTransitions-moveFromRight';
					break;
				case 14:
					outClass = 'btSectionTransitions-moveToRightEasing btSectionTransitions-ontop';
					inClass = 'btSectionTransitions-moveFromLeft';
					break;
				case 15:
					outClass = 'btSectionTransitions-moveToTopEasing btSectionTransitions-ontop';
					inClass = 'btSectionTransitions-moveFromBottom';
					break;
				case 16:
					outClass = 'btSectionTransitions-moveToBottomEasing btSectionTransitions-ontop';
					inClass = 'btSectionTransitions-moveFromTop';
					break;
				case 17:
					outClass = 'btSectionTransitions-scaleDown';
					inClass = 'btSectionTransitions-moveFromRight btSectionTransitions-ontop';
					break;
				case 18:
					outClass = 'btSectionTransitions-scaleDown';
					inClass = 'btSectionTransitions-moveFromLeft btSectionTransitions-ontop';
					break;
				case 19:
					outClass = 'btSectionTransitions-scaleDown';
					inClass = 'btSectionTransitions-moveFromBottom btSectionTransitions-ontop';
					break;
				case 20:
					outClass = 'btSectionTransitions-scaleDown';
					inClass = 'btSectionTransitions-moveFromTop btSectionTransitions-ontop';
					break;
				case 21:
					outClass = 'btSectionTransitions-scaleDown';
					inClass = 'btSectionTransitions-scaleUpDown btSectionTransitions-delay300';
					break;
				case 22:
					outClass = 'btSectionTransitions-scaleDownUp';
					inClass = 'btSectionTransitions-scaleUp btSectionTransitions-delay300';
					break;
				case 23:
					outClass = 'btSectionTransitions-moveToLeft btSectionTransitions-ontop';
					inClass = 'btSectionTransitions-scaleUp';
					break;
				case 24:
					outClass = 'btSectionTransitions-moveToRight btSectionTransitions-ontop';
					inClass = 'btSectionTransitions-scaleUp';
					break;
				case 25:
					outClass = 'btSectionTransitions-moveToTop btSectionTransitions-ontop';
					inClass = 'btSectionTransitions-scaleUp';
					break;
				case 26:
					outClass = 'btSectionTransitions-moveToBottom btSectionTransitions-ontop';
					inClass = 'btSectionTransitions-scaleUp';
					break;
				case 27:
					outClass = 'btSectionTransitions-scaleDownCenter';
					inClass = 'btSectionTransitions-scaleUpCenter btSectionTransitions-delay400';
					break;
				case 28:
					outClass = 'btSectionTransitions-rotateRightSideFirst';
					inClass = 'btSectionTransitions-moveFromRight btSectionTransitions-delay200 btSectionTransitions-ontop';
					break;
				case 29:
					outClass = 'btSectionTransitions-rotateLeftSideFirst';
					inClass = 'btSectionTransitions-moveFromLeft btSectionTransitions-delay200 btSectionTransitions-ontop';
					break;
				case 30:
					outClass = 'btSectionTransitions-rotateTopSideFirst';
					inClass = 'btSectionTransitions-moveFromTop btSectionTransitions-delay200 btSectionTransitions-ontop';
					break;
				case 31:
					outClass = 'btSectionTransitions-rotateBottomSideFirst';
					inClass = 'btSectionTransitions-moveFromBottom btSectionTransitions-delay200 btSectionTransitions-ontop';
					break;
				case 32:
					outClass = 'btSectionTransitions-flipOutRight';
					inClass = 'btSectionTransitions-flipInLeft btSectionTransitions-delay500';
					break;
				case 33:
					outClass = 'btSectionTransitions-flipOutLeft';
					inClass = 'btSectionTransitions-flipInRight btSectionTransitions-delay500';
					break;
				case 34:
					outClass = 'btSectionTransitions-flipOutTop';
					inClass = 'btSectionTransitions-flipInBottom btSectionTransitions-delay500';
					break;
				case 35:
					outClass = 'btSectionTransitions-flipOutBottom';
					inClass = 'btSectionTransitions-flipInTop btSectionTransitions-delay500';
					break;
				case 36:
					outClass = 'btSectionTransitions-rotateFall btSectionTransitions-ontop';
					inClass = 'btSectionTransitions-scaleUp';
					break;
				case 37:
					outClass = 'btSectionTransitions-rotateOutNewspaper';
					inClass = 'btSectionTransitions-rotateInNewspaper btSectionTransitions-delay500';
					break;
				case 38:
					outClass = 'btSectionTransitions-rotatePushLeft';
					inClass = 'btSectionTransitions-moveFromRight';
					break;
				case 39:
					outClass = 'btSectionTransitions-rotatePushRight';
					inClass = 'btSectionTransitions-moveFromLeft';
					break;
				case 40:
					outClass = 'btSectionTransitions-rotatePushTop';
					inClass = 'btSectionTransitions-moveFromBottom';
					break;
				case 41:
					outClass = 'btSectionTransitions-rotatePushBottom';
					inClass = 'btSectionTransitions-moveFromTop';
					break;
				case 42:
					outClass = 'btSectionTransitions-rotatePushLeft';
					inClass = 'btSectionTransitions-rotatePullRight btSectionTransitions-delay180';
					break;
				case 43:
					outClass = 'btSectionTransitions-rotatePushRight';
					inClass = 'btSectionTransitions-rotatePullLeft btSectionTransitions-delay180';
					break;
				case 44:
					outClass = 'btSectionTransitions-rotatePushTop';
					inClass = 'btSectionTransitions-rotatePullBottom btSectionTransitions-delay180';
					break;
				case 45:
					outClass = 'btSectionTransitions-rotatePushBottom';
					inClass = 'btSectionTransitions-rotatePullTop btSectionTransitions-delay180';
					break;
				case 46:
					outClass = 'btSectionTransitions-rotateFoldLeft';
					inClass = 'btSectionTransitions-moveFromRightFade';
					break;
				case 47:
					outClass = 'btSectionTransitions-rotateFoldRight';
					inClass = 'btSectionTransitions-moveFromLeftFade';
					break;
				case 48:
					outClass = 'btSectionTransitions-rotateFoldTop';
					inClass = 'btSectionTransitions-moveFromBottomFade';
					break;
				case 49:
					outClass = 'btSectionTransitions-rotateFoldBottom';
					inClass = 'btSectionTransitions-moveFromTopFade';
					break;
				case 50:
					outClass = 'btSectionTransitions-moveToRightFade';
					inClass = 'btSectionTransitions-rotateUnfoldLeft';
					break;
				case 51:
					outClass = 'btSectionTransitions-moveToLeftFade';
					inClass = 'btSectionTransitions-rotateUnfoldRight';
					break;
				case 52:
					outClass = 'btSectionTransitions-moveToBottomFade';
					inClass = 'btSectionTransitions-rotateUnfoldTop';
					break;
				case 53:
					outClass = 'btSectionTransitions-moveToTopFade';
					inClass = 'btSectionTransitions-rotateUnfoldBottom';
					break;
				case 54:
					outClass = 'btSectionTransitions-rotateRoomLeftOut btSectionTransitions-ontop';
					inClass = 'btSectionTransitions-rotateRoomLeftIn';
					break;
				case 55:
					outClass = 'btSectionTransitions-rotateRoomRightOut btSectionTransitions-ontop';
					inClass = 'btSectionTransitions-rotateRoomRightIn';
					break;
				case 56:
					outClass = 'btSectionTransitions-rotateRoomTopOut btSectionTransitions-ontop';
					inClass = 'btSectionTransitions-rotateRoomTopIn';
					break;
				case 57:
					outClass = 'btSectionTransitions-rotateRoomBottomOut btSectionTransitions-ontop';
					inClass = 'btSectionTransitions-rotateRoomBottomIn';
					break;
				case 58:
					outClass = 'btSectionTransitions-rotateCubeLeftOut btSectionTransitions-ontop';
					inClass = 'btSectionTransitions-rotateCubeLeftIn';
					break;
				case 59:
					outClass = 'btSectionTransitions-rotateCubeRightOut btSectionTransitions-ontop';
					inClass = 'btSectionTransitions-rotateCubeRightIn';
					break;
				case 60:
					outClass = 'btSectionTransitions-rotateCubeTopOut btSectionTransitions-ontop';
					inClass = 'btSectionTransitions-rotateCubeTopIn';
					break;
				case 61:
					outClass = 'btSectionTransitions-rotateCubeBottomOut btSectionTransitions-ontop';
					inClass = 'btSectionTransitions-rotateCubeBottomIn';
					break;
				case 62:
					outClass = 'btSectionTransitions-rotateCarouselLeftOut btSectionTransitions-ontop';
					inClass = 'btSectionTransitions-rotateCarouselLeftIn';
					break;
				case 63:
					outClass = 'btSectionTransitions-rotateCarouselRightOut btSectionTransitions-ontop';
					inClass = 'btSectionTransitions-rotateCarouselRightIn';
					break;
				case 64:
					outClass = 'btSectionTransitions-rotateCarouselTopOut btSectionTransitions-ontop';
					inClass = 'btSectionTransitions-rotateCarouselTopIn';
					break;
				case 65:
					outClass = 'btSectionTransitions-rotateCarouselBottomOut btSectionTransitions-ontop';
					inClass = 'btSectionTransitions-rotateCarouselBottomIn';
					break;
				case 66:
					outClass = 'btSectionTransitions-rotateSidesOut';
					inClass = 'btSectionTransitions-rotateSidesIn btSectionTransitions-delay200';
					break;
				case 67:
					outClass = 'btSectionTransitions-rotateSlideOut';
					inClass = 'btSectionTransitions-rotateSlideIn';
					break;

			}
			
			$currPage.addClass( outClass ).on( animEndEventName, function() {
				$currPage.off( animEndEventName );
				endCurrPage = true;
				if ( endNextPage ) {
					onEndAnimation( $currPage, $nextPage );
				}
			});
			
			$currPage.find( '.animated' ).removeClass( 'animated' );
			$( window ).trigger( 'boldthemes_section_animation_out', [ $currPage ] );

			$nextPage.addClass( inClass ).on( animEndEventName, function() {
				$nextPage.off( animEndEventName );
				endNextPage = true;
				if ( endCurrPage ) {
					onEndAnimation( $currPage, $nextPage );
				}
			});

			if ( ! support ) {
				onEndAnimation( $currPage, $nextPage );
			}
			
			// half page
			if ( bt_half_page ) {
				var $currPageHalf = $pages_half[ pagesCount - 1 - current ];
				
				var $nextPageHalf = $pages_half[ next_half ].addClass( 'btSectionTransitions-current' ),
				outClass = '', inClass = '';
				
				$currPageHalf.find( '.animated' ).removeClass( 'animated' );
				
				switch( anim_half ) {

					case 1:
						outClass = 'btSectionTransitions-moveToLeft';
						inClass = 'btSectionTransitions-moveFromRight';
						break;
					case 2:
						outClass = 'btSectionTransitions-moveToRight';
						inClass = 'btSectionTransitions-moveFromLeft';
						break;
					case 3:
						outClass = 'btSectionTransitions-moveToTop';
						inClass = 'btSectionTransitions-moveFromBottom';
						break;
					case 4:
						outClass = 'btSectionTransitions-moveToBottom';
						inClass = 'btSectionTransitions-moveFromTop';
						break;
					case 5:
						outClass = 'btSectionTransitions-fade';
						inClass = 'btSectionTransitions-moveFromRight btSectionTransitions-ontop';
						break;
					case 6:
						outClass = 'btSectionTransitions-fade';
						inClass = 'btSectionTransitions-moveFromLeft btSectionTransitions-ontop';
						break;
					case 7:
						outClass = 'btSectionTransitions-fade';
						inClass = 'btSectionTransitions-moveFromBottom btSectionTransitions-ontop';
						break;
					case 8:
						outClass = 'btSectionTransitions-fade';
						inClass = 'btSectionTransitions-moveFromTop btSectionTransitions-ontop';
						break;
					case 9:
						outClass = 'btSectionTransitions-moveToLeftFade';
						inClass = 'btSectionTransitions-moveFromRightFade';
						break;
					case 10:
						outClass = 'btSectionTransitions-moveToRightFade';
						inClass = 'btSectionTransitions-moveFromLeftFade';
						break;
					case 11:
						outClass = 'btSectionTransitions-moveToTopFade';
						inClass = 'btSectionTransitions-moveFromBottomFade';
						break;
					case 12:
						outClass = 'btSectionTransitions-moveToBottomFade';
						inClass = 'btSectionTransitions-moveFromTopFade';
						break;
					case 13:
						outClass = 'btSectionTransitions-moveToLeftEasing btSectionTransitions-ontop';
						inClass = 'btSectionTransitions-moveFromRight';
						break;
					case 14:
						outClass = 'btSectionTransitions-moveToRightEasing btSectionTransitions-ontop';
						inClass = 'btSectionTransitions-moveFromLeft';
						break;
					case 15:
						outClass = 'btSectionTransitions-moveToTopEasing btSectionTransitions-ontop';
						inClass = 'btSectionTransitions-moveFromBottom';
						break;
					case 16:
						outClass = 'btSectionTransitions-moveToBottomEasing btSectionTransitions-ontop';
						inClass = 'btSectionTransitions-moveFromTop';
						break;
					case 17:
						outClass = 'btSectionTransitions-scaleDown';
						inClass = 'btSectionTransitions-moveFromRight btSectionTransitions-ontop';
						break;
					case 18:
						outClass = 'btSectionTransitions-scaleDown';
						inClass = 'btSectionTransitions-moveFromLeft btSectionTransitions-ontop';
						break;
					case 19:
						outClass = 'btSectionTransitions-scaleDown';
						inClass = 'btSectionTransitions-moveFromBottom btSectionTransitions-ontop';
						break;
					case 20:
						outClass = 'btSectionTransitions-scaleDown';
						inClass = 'btSectionTransitions-moveFromTop btSectionTransitions-ontop';
						break;
					case 21:
						outClass = 'btSectionTransitions-scaleDown';
						inClass = 'btSectionTransitions-scaleUpDown btSectionTransitions-delay300';
						break;
					case 22:
						outClass = 'btSectionTransitions-scaleDownUp';
						inClass = 'btSectionTransitions-scaleUp btSectionTransitions-delay300';
						break;
					case 23:
						outClass = 'btSectionTransitions-moveToLeft btSectionTransitions-ontop';
						inClass = 'btSectionTransitions-scaleUp';
						break;
					case 24:
						outClass = 'btSectionTransitions-moveToRight btSectionTransitions-ontop';
						inClass = 'btSectionTransitions-scaleUp';
						break;
					case 25:
						outClass = 'btSectionTransitions-moveToTop btSectionTransitions-ontop';
						inClass = 'btSectionTransitions-scaleUp';
						break;
					case 26:
						outClass = 'btSectionTransitions-moveToBottom btSectionTransitions-ontop';
						inClass = 'btSectionTransitions-scaleUp';
						break;
					case 27:
						outClass = 'btSectionTransitions-scaleDownCenter';
						inClass = 'btSectionTransitions-scaleUpCenter btSectionTransitions-delay400';
						break;
					case 28:
						outClass = 'btSectionTransitions-rotateRightSideFirst';
						inClass = 'btSectionTransitions-moveFromRight btSectionTransitions-delay200 btSectionTransitions-ontop';
						break;
					case 29:
						outClass = 'btSectionTransitions-rotateLeftSideFirst';
						inClass = 'btSectionTransitions-moveFromLeft btSectionTransitions-delay200 btSectionTransitions-ontop';
						break;
					case 30:
						outClass = 'btSectionTransitions-rotateTopSideFirst';
						inClass = 'btSectionTransitions-moveFromTop btSectionTransitions-delay200 btSectionTransitions-ontop';
						break;
					case 31:
						outClass = 'btSectionTransitions-rotateBottomSideFirst';
						inClass = 'btSectionTransitions-moveFromBottom btSectionTransitions-delay200 btSectionTransitions-ontop';
						break;
					case 32:
						outClass = 'btSectionTransitions-flipOutRight';
						inClass = 'btSectionTransitions-flipInLeft btSectionTransitions-delay500';
						break;
					case 33:
						outClass = 'btSectionTransitions-flipOutLeft';
						inClass = 'btSectionTransitions-flipInRight btSectionTransitions-delay500';
						break;
					case 34:
						outClass = 'btSectionTransitions-flipOutTop';
						inClass = 'btSectionTransitions-flipInBottom btSectionTransitions-delay500';
						break;
					case 35:
						outClass = 'btSectionTransitions-flipOutBottom';
						inClass = 'btSectionTransitions-flipInTop btSectionTransitions-delay500';
						break;
					case 36:
						outClass = 'btSectionTransitions-rotateFall btSectionTransitions-ontop';
						inClass = 'btSectionTransitions-scaleUp';
						break;
					case 37:
						outClass = 'btSectionTransitions-rotateOutNewspaper';
						inClass = 'btSectionTransitions-rotateInNewspaper btSectionTransitions-delay500';
						break;
					case 38:
						outClass = 'btSectionTransitions-rotatePushLeft';
						inClass = 'btSectionTransitions-moveFromRight';
						break;
					case 39:
						outClass = 'btSectionTransitions-rotatePushRight';
						inClass = 'btSectionTransitions-moveFromLeft';
						break;
					case 40:
						outClass = 'btSectionTransitions-rotatePushTop';
						inClass = 'btSectionTransitions-moveFromBottom';
						break;
					case 41:
						outClass = 'btSectionTransitions-rotatePushBottom';
						inClass = 'btSectionTransitions-moveFromTop';
						break;
					case 42:
						outClass = 'btSectionTransitions-rotatePushLeft';
						inClass = 'btSectionTransitions-rotatePullRight btSectionTransitions-delay180';
						break;
					case 43:
						outClass = 'btSectionTransitions-rotatePushRight';
						inClass = 'btSectionTransitions-rotatePullLeft btSectionTransitions-delay180';
						break;
					case 44:
						outClass = 'btSectionTransitions-rotatePushTop';
						inClass = 'btSectionTransitions-rotatePullBottom btSectionTransitions-delay180';
						break;
					case 45:
						outClass = 'btSectionTransitions-rotatePushBottom';
						inClass = 'btSectionTransitions-rotatePullTop btSectionTransitions-delay180';
						break;
					case 46:
						outClass = 'btSectionTransitions-rotateFoldLeft';
						inClass = 'btSectionTransitions-moveFromRightFade';
						break;
					case 47:
						outClass = 'btSectionTransitions-rotateFoldRight';
						inClass = 'btSectionTransitions-moveFromLeftFade';
						break;
					case 48:
						outClass = 'btSectionTransitions-rotateFoldTop';
						inClass = 'btSectionTransitions-moveFromBottomFade';
						break;
					case 49:
						outClass = 'btSectionTransitions-rotateFoldBottom';
						inClass = 'btSectionTransitions-moveFromTopFade';
						break;
					case 50:
						outClass = 'btSectionTransitions-moveToRightFade';
						inClass = 'btSectionTransitions-rotateUnfoldLeft';
						break;
					case 51:
						outClass = 'btSectionTransitions-moveToLeftFade';
						inClass = 'btSectionTransitions-rotateUnfoldRight';
						break;
					case 52:
						outClass = 'btSectionTransitions-moveToBottomFade';
						inClass = 'btSectionTransitions-rotateUnfoldTop';
						break;
					case 53:
						outClass = 'btSectionTransitions-moveToTopFade';
						inClass = 'btSectionTransitions-rotateUnfoldBottom';
						break;
					case 54:
						outClass = 'btSectionTransitions-rotateRoomLeftOut btSectionTransitions-ontop';
						inClass = 'btSectionTransitions-rotateRoomLeftIn';
						break;
					case 55:
						outClass = 'btSectionTransitions-rotateRoomRightOut btSectionTransitions-ontop';
						inClass = 'btSectionTransitions-rotateRoomRightIn';
						break;
					case 56:
						outClass = 'btSectionTransitions-rotateRoomTopOut btSectionTransitions-ontop';
						inClass = 'btSectionTransitions-rotateRoomTopIn';
						break;
					case 57:
						outClass = 'btSectionTransitions-rotateRoomBottomOut btSectionTransitions-ontop';
						inClass = 'btSectionTransitions-rotateRoomBottomIn';
						break;
					case 58:
						outClass = 'btSectionTransitions-rotateCubeLeftOut btSectionTransitions-ontop';
						inClass = 'btSectionTransitions-rotateCubeLeftIn';
						break;
					case 59:
						outClass = 'btSectionTransitions-rotateCubeRightOut btSectionTransitions-ontop';
						inClass = 'btSectionTransitions-rotateCubeRightIn';
						break;
					case 60:
						outClass = 'btSectionTransitions-rotateCubeTopOut btSectionTransitions-ontop';
						inClass = 'btSectionTransitions-rotateCubeTopIn';
						break;
					case 61:
						outClass = 'btSectionTransitions-rotateCubeBottomOut btSectionTransitions-ontop';
						inClass = 'btSectionTransitions-rotateCubeBottomIn';
						break;
					case 62:
						outClass = 'btSectionTransitions-rotateCarouselLeftOut btSectionTransitions-ontop';
						inClass = 'btSectionTransitions-rotateCarouselLeftIn';
						break;
					case 63:
						outClass = 'btSectionTransitions-rotateCarouselRightOut btSectionTransitions-ontop';
						inClass = 'btSectionTransitions-rotateCarouselRightIn';
						break;
					case 64:
						outClass = 'btSectionTransitions-rotateCarouselTopOut btSectionTransitions-ontop';
						inClass = 'btSectionTransitions-rotateCarouselTopIn';
						break;
					case 65:
						outClass = 'btSectionTransitions-rotateCarouselBottomOut btSectionTransitions-ontop';
						inClass = 'btSectionTransitions-rotateCarouselBottomIn';
						break;
					case 66:
						outClass = 'btSectionTransitions-rotateSidesOut';
						inClass = 'btSectionTransitions-rotateSidesIn btSectionTransitions-delay200';
						break;
					case 67:
						outClass = 'btSectionTransitions-rotateSlideOut';
						inClass = 'btSectionTransitions-rotateSlideIn';
						break;

				}
				
				$currPageHalf.addClass( outClass ).on( animEndEventName, function() {
					$currPageHalf.off( animEndEventName );
					endCurrPageHalf = true;
					if ( endNextPageHalf ) {
						onEndAnimationHalf( $currPageHalf, $nextPageHalf );
					}
				});
				
				$currPageHalf.find( '.animated' ).removeClass( 'animated' );
				$( window ).trigger( 'boldthemes_section_animation_out', [ $currPageHalf ] );

				$nextPageHalf.addClass( inClass ).on( animEndEventName, function() {
					$nextPageHalf.off( animEndEventName );
					endNextPageHalf = true;
					if ( endCurrPageHalf ) {
						onEndAnimationHalf( $currPageHalf, $nextPageHalf );
					}
				});

				if ( ! support ) {
					onEndAnimationHalf( $currPageHalf, $nextPageHalf );
				}				
			}
			
			current = next;

		}

		function onEndAnimation( $outpage, $inpage ) {
			endCurrPage = false;
			endNextPage = false;
			resetPage( $outpage, $inpage );
			isAnimating = false;
			$inpage.find( '.animate' ).addClass( 'animated' );
			$( window ).trigger( 'boldthemes_section_animation_end', [ $inpage ] );
			
			window.location.hash = '#/' + $inpage.attr( 'id' );
		}
		
		function onEndAnimationHalf( $outpage, $inpage ) {
			endCurrPageHalf = false;
			endNextPageHalf = false;
			resetPage( $outpage, $inpage );
			isAnimating = false;
			$inpage.find( '.animate' ).addClass( 'animated' );
			$( window ).trigger( 'boldthemes_section_animation_end', [ $inpage ] );
		}		

		function resetPage( $outpage, $inpage ) {
			$outpage.attr( 'class', $outpage.data( 'originalClassList' ) );
			$outpage.hide().show( 0 );
			$inpage.attr( 'class', $inpage.data( 'originalClassList' ) + ' btSectionTransitions-current' );
		}

		init();
		
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