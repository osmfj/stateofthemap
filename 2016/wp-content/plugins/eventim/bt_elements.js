(function( $ ) {
	
	window.btGetNavHTML = function( count ) {
		var html = '<div class="btAnimNavHolder"><ul class="btAnimNav">';
		html += '<li class="btAnimNavPrev"></li>';
		for ( var i = 0; i < count; i++ ) {
			html += '<li class="btAnimNavDot" data-count="' + i + '"><span>' + ( i + 1 ) + '/' + count + '<span></li>';
		}
		html += '<li class="btAnimNavNext"></li>';
		html += '</ul></div>';
		
		return html;
	}

	/* Animate elements */

	function btAnimateElements() {
		var $elems = $( '.btCounter:not(.animated), .btProgressBar:not(.animated)' );
		// classic animations
		$elems.each(function() {
			$elm = $( this );
			if ( 
			( $elm.isOnScreen() && ! $( 'body' ).hasClass( 'impress-enabled' ) ) ||
			( $elm.isOnScreen() && $( 'body' ).hasClass( 'impress-enabled' ) && $elm.closest( '.boldSection' ).hasClass( 'active' ) )
			) {
				$elm.addClass( 'animated' );
				if ( $elm.hasClass( 'btCounter' ) ) {
					btAnimateCounter( $elm );
				}
				if ( $elm.hasClass( 'btProgressBar' ) ) {
					btAnimateProgress( $elm );
				}
			}
		});
	}
	
	function btAnimateCounter( elm ) {
		var number_length = elm.data( 'digit-length' );
		for ( var i = parseInt( number_length ); i > 0; i-- ) {
			var digit = parseInt( elm.children( '.p' + i ).data( 'digit' ) );
			if ( digit == 0 || isNaN( digit ) ) digit = 10;
			for ( var j = 0; j <= digit; j++ ) {
				//elm.children( '.p' + i ).children( '.n' + j ).css( 'transform', 'translateY(-' + digit * elm.height() + 'px)' );
				elm.children( '.p' + i ).css( 'transform', 'translateY(-' + digit * elm.height() + 'px)' );
			}
			
		}
		return false;
	}
	
	function btAnimateCounterReset( elm ) {
		var number_length = elm.data( 'digit-length' );
		for ( var i = parseInt( number_length ); i > 0; i-- ) {
			var digit = elm.children( '.p' + i ).data( 'digit' );
			if ( digit == 0 || isNaN( digit ) ) digit = 10;
			for ( var j = 0; j <= parseInt( digit ); j++ ) {
				//elm.children( '.p' + i ).children( '.n' + j ).css( 'transform', 'translateY(0px)' );
				elm.children( '.p' + i ).css( 'transform', 'translateY(0px)' );
			}
			
		}
		return false;
	}	

	function btAnimateProgress( elm ) {
		elm.find( '.btProgressAnim' ).css( 'transition-delay', Math.round( Math.random() * 250 ) + 'ms' );
		elm.find( '.btProgressAnim' ).css( 'transform', 'translateX(-' + ( 100 - elm.find( '.btProgressAnim' ).data( 'percentage' ) ) + '%)' );
		return false;
	}
	
	function btAnimateProgressReset( elm ) {
		elm.find( '.btProgressAnim' ).css( 'transition-delay', Math.round( Math.random() * 250 ) + 'ms' );
		elm.find( '.btProgressAnim' ).css( 'transform', 'translateX(-100%)' );
		return false;
	}	
	
	$( window ).on( 'btload', function() {
		if ( ! $( 'body' ).hasClass( 'btPageTransitions' ) ) {
			btAnimateElements();
			$( window ).scroll(function(){
				btAnimateElements();
			});
		}
	});
	
	$( window ).on( 'boldthemes_section_animation_end', function( e, el ) {
		var $elems = $( el ).find( '.btCounter, .btProgressBar, span.headline .animate' );
		// classic animations
		$elems.each(function() {
			$elm = $( this );
			$elm.addClass( 'animated' );
			if ( $elm.hasClass( 'btCounter' ) ) {
				btAnimateCounter( $elm );
			}
			if ( $elm.hasClass( 'btProgressBar' ) ) {
				btAnimateProgress( $elm );
			}
		});
	});
	
	$( window ).on( 'boldthemes_section_animation_out', function( e, el ) {
		var $elems = $( el ).find( '.btCounter, .btProgressBar, span.headline .animate' );
		// classic animations
		$elems.each(function() {
			$elm = $( this );
			$elm.removeClass( 'animated' );
			if ( $elm.hasClass( 'btCounter' ) ) {
				btAnimateCounterReset( $elm );
			}
			if ( $elm.hasClass( 'btProgressBar' ) ) {
				btAnimateProgressReset( $elm );
			}
		});
	});
	
	function bt_video_background() {
		$( '.boldSection.video' ).each(function() {
			var video = $( this ).find( 'video' );
			var w = $( this ).outerWidth();
			var h = $( this ).outerHeight();
			if ( w / h > 16 / 9 ) {
				video.css( 'width', '105%' );
				video.css( 'height', '' );
			} else {
				video.css( 'width', '' );
				video.css( 'height', '105%' );
			}
		});
	}
	
	window.bt_video_callback = function( v ) {
		$( v ).parent().addClass( 'video_on' );
	}
	
	$( window ).on( 'resize', function( e ) {
		var $elems = $( '.btCounter' );
		// classic animations
		/*$elems.each(function() {
			$elm = $( this );
			if ( $elm.hasClass( 'btCounter' ) ) {
				btAnimateCounterReset( $elm );
			}
		});*/
		setTimeout( function() {
			var $elems = $( '.btCounter' );
			$elems.each(function() {
				$elm = $( this );
				btAnimateCounter( $elm );
			});
		}, 1000 );
		
		bt_video_background();		
		
	});
	
	/* Accordions and tabs */

	$( document ).ready(function () {
		
		/* Accordions */

		$( '.tabsVertical .tabAccordionContent' ).hide();
		
		$( '.tabsVertical .tabAccordionTitle' ).click(function() {
			if ( $( this ).hasClass( 'on' ) ) {
				$( this ).removeClass( 'on' ).next().slideUp( 250 );
			} else {
				$( this ).closest( '.tabsVertical' ).find( '.tabAccordionTitle' ).removeClass( 'on' );
				$( this ).closest( '.tabsVertical' ).find( '.tabAccordionContent' ).delay( 250 ).slideUp( 250 );
				$( this ).addClass( 'on' ).next().slideDown( 250 );
			}
		});
		
		$( '.tabsVertical' ).each(function(){
			$( this ).find( '.tabAccordionTitle' ).first().click();
		});

		/* Tabs */
		
		$( '.tabsHorizontal ul.tabsHeader li' ).click(function() {
			$(this).siblings().removeClass( 'on' );
			$( this ).addClass( 'on' );
			$( this ).parent().parent().find( '.tabPanes .tabPane' ).removeClass( 'on' );
			$( this ).parent().parent().find( '.tabPanes .tabPane' ).eq( $(this).index() ).addClass( 'on' );
		});

		$( '.tabsHorizontal ul.tabsHeader' ).each(function(){
			$( this ).find( 'li' ).first().click();
		});

		// Wrap inline row
		$( '.btIconImageRow > div' ).wrap( '<div class="btIconImageCell"></div>' );
		/*$.each( $( '.btIconImageRow' ), function() {
			$( this ).addClass( 'btCells-' + $( this ).children( 'div' ).length );
		});*/

		// Countdown
		
		$( '.btCountdownHolder' ).each(function() {
			
			var cd = $( this );
			var s = cd.data( 'init-seconds' );
			
			var seconds_arr = ['', ''];
			var seconds_arr_prev = ['', ''];
			
			var minutes_arr = ['', ''];
			var minutes_arr_prev = ['', ''];
			
			var hours_arr = ['', ''];
			var hours_arr_prev = ['', ''];

			var days_prev = 0;
			
			var countdown = function( selector, i, arr, arr_prev ) {
				if ( arr[ i ] !== arr_prev[ i ] ) {
					cd.find( selector ).children().addClass( 'countdown_anim' );
					cd.find( selector ).children().eq( 0 ).html( arr[ i ] );
					cd.find( selector ).children().eq( 1 ).html( arr_prev[ i ] );
					setTimeout(function() {
						cd.find( selector ).children().eq( 1 ).html( cd.find( selector ).children().eq( 0 ).html() );
						cd.find( selector ).children().removeClass( 'countdown_anim' );
					}, 300 );
				}
			}
			
			var output = function() {
				s = s - 1;
				if ( s < 0 ) {
					s = 0;
				}
				
				var delta = s;
				
				var days = Math.floor( delta / 86400 );
				delta -= days * 86400;

				var hours = Math.floor( delta / 3600 ) % 24;
				delta -= hours * 3600;

				var minutes = Math.floor( delta / 60 ) % 60;
				delta -= minutes * 60;

				var seconds = delta;
				
				if ( hours < 10 ) {
					hours = '0' + hours;
				}
				
				if ( minutes < 10 ) {
					minutes = '0' + minutes;
				}

				if ( seconds < 10 ) {
					seconds = '0' + seconds;
				}
				
				seconds_arr = seconds.toString().split( '' );
				minutes_arr = minutes.toString().split( '' );
				hours_arr = hours.toString().split( '' );
				
				for ( var i = 0; i <= 1; i++ ) {
					countdown( '.seconds .n' + i, i, seconds_arr, seconds_arr_prev );
					countdown( '.minutes .n' + i, i, minutes_arr, minutes_arr_prev );
					countdown( '.hours .n' + i, i, hours_arr, hours_arr_prev );
				}
				
				if ( days != days_prev ) {
					days_arr = days.toString().split( '' );
					
					var days_html = '';
					for ( var i = 0; i < days_arr.length; i++ ) {
						days_html += '<span>' + days_arr[ i ] + '</span>';
					}

					cd.find( '.days' ).html( days_html + '<span class="days_text"><span>' + cd.find( '.days' ).data( 'text' ) + '</span></span>' );
				}
				
				days_prev = days;				
				
				setTimeout(function() {
					seconds_arr_prev = seconds_arr;
					minutes_arr_prev = minutes_arr;
					hours_arr_prev = hours_arr;
				}, 400 );

			}
			
			output();

			setInterval(function() {
				output();
			}, 1000 );
		});
		
		// Video
		
		bt_video_background();		

	});

})( jQuery );