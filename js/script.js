function nopx ( s ) { return s.substr ( 0, s.length-2 ) }

var bird, game_over = false;

function bird_constuctor(){
	var bird_position, bird_x;
	return {
		speed: 0,
		acceleration: 9.81,
		movement_stop: function(){
			clearInterval(this.interval);
		},
		move: function( duration ){
			if ( game_over ) {
				this.movement_stop();
			}
		
			this.position += duration * this.speed;
			this.speed += duration * this.acceleration;
						
			this.element.css('top', this.position + 'px');
			
			if ( this.position > this.element.parent().innerHeight() ) {
				game_over = true;
			}
		},
		up: function(){
			this.position -= 30;
			this.speed = 0;
			
			this.element.css('top', this.position + 'px');
		},
		movement_start: function(){
			var self = this;
			this.interval = setInterval(
				function(){
					self.move ( 1/25 )
				},
				1000/25
			);
		},
		element: (function(){
			var element = $('<span class="bird"></span>');
			$('.content').append(element);
			bird_position = nopx ( element.css('top') );
			bird_x = nopx ( element.css('left') );
			return element;
		})(),
		position: Number(bird_position),
		x: Number(bird_x),
		width: 34,
		height: 25,
	}
}

function obstacle_construction(){
	const padding = 100;
	const height = ( $('content').innerHeight - padding ) / 2;
	var obstacle_hole_top;
	return {	
		position: 0,
		speed: 100,
		width: 51,
		element: (function(){
			var element = $('<div class="obstacle"><span></span><span></span></div>');
			element.css( 'right', 0 );
			var top_span = $(element.find( 'span' )[0]);
			var margin_top = Math.floor(Math.random() * height - height / 2);
			top_span.css( 'margin-top', margin_top + 'px' );
			obstacle_hole_top = margin_top + top_span.height();
			$('.content').append( element );
			return element;
		})(),
		movement_start: function(){
			var self = this;
			this.interval = setInterval(
				function(){
					self.move ( 1/25 )
				},
				1000/25
			);
		},
		movement_stop: function(){
			clearInterval(this.interval);
		},
		hole_top: obstacle_hole_top,
		hole_size: 100,
		check: function(){
			if ( this.position + this.width < bird.x  || this.positin > bird.x + bird.width || this.hole_top > bird.position && this.hole_top+this.hole_size < bird.position + bird.height ) {
				return false;
			}
			console.log('loose');
			game_over = true;
			return true;
		},
		move: function( duration ){
		
			if ( game_over ) {
				this.movement_stop();
			}
			
			this.position += duration * this.speed;
			this.element.css('right', this.position + 'px');
			if ( this.element.parent().innerWidth() > this.element ) {
				this.element.remove();
				this.movement_stop();
				return;
			}
			this.check();
		}
	}
}

function obstacle_generator(){
	return {
		start: function(){
			this.interval = setInterval(
				function(){
					var new_obstacle = obstacle_construction();
					new_obstacle.movement_start();
				},
				3000				
			);
		},
		stop: function(){
			clearInterval ( this.interval );
		}
	};
}

$(document).ready(function(){
	bird = bird_constuctor();
	bird.movement_start();
	obstacle_generator().start();
	$('.content').click(function(){bird.up()});
})