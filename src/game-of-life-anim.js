// game-of-life-anim.js

(function() {

	var canvas = null;
	var context = null;
	var color = 'rgba(255,170,1,0.2)';
	var field = [];
	var fieldBuffer = [];
	var cellSize = 10;
	var timer = null;
	var timerInterval = 100;
	var loopFlag = true;

	window.addEventListener('load', function(event) {
		if (window.innerWidth < 50 || window.innerHeight < 50) return;
		init();
		var centerX = Math.floor(field[0].length / 2);
		var centerY = Math.floor(field.length / 2);
		printToField(field, centerY - 4, centerX - 3, [
			// 23334M
			[0,0,1,0,0],
			[1,1,0,0,0],
			[0,1,0,0,0],
			[1,0,0,1,0],
			[0,0,0,0,1],
			[0,1,0,0,1],
			[0,0,1,0,1],
			[0,1,0,0,0]
		]);
		startTimer();
	});

	var init = function() {
		createCanvas();
		createField();
		initOnResize();
	};

	var reset = function() {
		eachCells(field, function(x, y, val) { field[x][y] = 0; });
		eachCells(fieldBuffer, function(x, y, val) { fieldBuffer[x][y] = 0; });
	};

	var createCanvas = function() {
		canvas = document.createElement('canvas');
		canvas.id = '__background_animation_canvas__';
		canvas.style.position = 'fixed';
		canvas.style.top = 0;
		canvas.style.left = 0;
		canvas.style.zIndex = -1;
		canvas.style.margin = '0';
		canvas.style.padding = '0';

		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		context = canvas.getContext('2d');

		document.body.appendChild(canvas);
	};

	var createField = function() {
		var w = Math.floor(window.innerWidth / cellSize);
		var h = Math.floor(window.innerHeight / cellSize);
		var create = function() {
			var f = [];
			for (var y = 0; y < h; y++) {
				f[y] = [];
				for (var x = 0; x < w; x++) {
					f[y][x] = 0;
				}
			}
			return f;
		};
		field = create();
		fieldBuffer = create();
	};

	var printToField = function(targetField, y, x, dots) {
		var yMax = targetField.length;
		var xMax = targetField[0].length;
		eachCells(dots, function(iy, ix, val) {
			var _y = y + iy;
			var _x = x + ix;
			if (0 <= _x && _x < xMax && 0 <= _y && _y < yMax) {
				targetField[_y][_x] = val;
			}
		});
	};

	var eachCells = function(field, callback) {
		var yLength = field.length;
		for (var y = 0; y < yLength; y++) {
			var row = field[y];
			var xLength = row.length;
			for (var x = 0; x < xLength; x++) {
				callback(y, x, row[x]);
			}
		}
	};

	var draw = function() {
		context.clearRect(0, 0, canvas.width, canvas.height);
		eachCells(field, function(y, x, val) {
			if (val > 0) {
				var xPos = x * cellSize;
				var yPos = y * cellSize;
				context.fillStyle = color;
				context.fillRect(xPos, yPos, cellSize, cellSize);
			}
		});
	};

	var bufferToFront = function() {
		eachCells(fieldBuffer, function(y, x, val) {
			field[y][x] = val;
		});
	};

	var frontToBuffer = function() {
		eachCells(field, function(y, x, val) {
			fieldBuffer[y][x] = val;
		});
	};

	var update = function() {
		frontToBuffer();
		var yMax = field.length;
		var xMax = field[0].length;
		eachCells(field, function(y, x, val) {
			var count = 0;
			for (var iy = -1; iy <= 1; iy++) {
				for (var ix = -1; ix <= 1; ix++) {
					var _y = y + iy;
					var _x = x + ix;
					if (loopFlag) {
						if (_x < 0) _x = xMax - 1;
						if (_y < 0) _y = yMax - 1;
						if (xMax <= _x) _x = 0;
						if (yMax <= _y) _y = 0;
						if ((ix != 0 || iy != 0) && field[_y][_x] > 0) {
							count++;
						}
					} else {
						if (0 <= _x && _x < xMax && 0 <= _y && _y < yMax
							&& (ix != 0 || iy != 0) && field[_y][_x] > 0) {
							count++;
						}
					}
				}
			}
			if (val > 0) {
				if (count == 2 || count == 3) fieldBuffer[y][x] = 1;
				if (count <= 1) fieldBuffer[y][x] = 0;
				if (count >= 4) fieldBuffer[y][x] = 0;
			} else {
				if (count == 3) fieldBuffer[y][x] = 1;
			}
		});
		bufferToFront();
	};

	var startTimer = function() {
		timer = window.setInterval(function() {
			try {
				draw();
				update();
			} catch (e) {
				console.log(e);
				stopTimer();
			}
		}, timerInterval);
	};

	var stopTimer = function() {
		window.clearInterval(timer);
	};

	var initOnResize = function() {
		var timer = null;
		window.addEventListener('resize', function() {
			if (timer === null) window.clearTimeout(timer);
			timer = window.setTimeout(function() {
				canvas.width = window.innerWidth;
				canvas.height = window.innerHeight;
				var _field = field;
				createField();
				printToField(field, 0, 0, _field);
				timer = null;
			}, 500);
		});
	};

})();

