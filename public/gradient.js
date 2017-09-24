var SIZE = 600;
var b = 0;
var m = 0;
var learning_rate = 0.01;
var points = [];
var iterations = 1000;
var canvas;
var min_value_x = 1000000, min_value_y = 1000000;
var max_value_x = -1, max_value_y = -1;
var ready = false;

function squared_min_difference(b, m, points) {
	var total_error = 0;
	for (var i = 0; i < points.length; i++) {
		var x = points[i][0];
		var y = points[i][1];
		total_error += (y - (m * x + b)) ** 2;
	}
	return total_error / (points.length).toFixed(0);
}

function step_gradient(current_b, current_m, points, learning_rate) {
	var gradient_b = 0;
	var gradient_m = 0;
	var N = points.length.toFixed(0);
	for (var i = 0; i < N; i++) {
		var x = points[i][0];
		var y = points[i][1];
		gradient_b += -(2/N) * (y - (current_m * x + current_b));
		gradient_m += -(2/N) * x * (y - (current_m * x + current_b));
	}
	var new_b = current_b - (learning_rate * gradient_b);
	var new_m = current_m - (learning_rate * gradient_m);
	return [new_b, new_m];
}

function normalize_x(value) {
	return (value - min_value_x) * SIZE / (max_value_x - min_value_x);
}

function normalize_y(value) {
	return SIZE - ((value - min_value_y) * SIZE / (max_value_y - min_value_y));
}

function get_extreme_points(b, m) {
	/*
		x = (y - b) / m
	*/
	var function_calc = function (y) {
		return (y - b) / m;
	}
	var y1 = 0;
	var x1 = function_calc(y1);
	var y2 = 600;
	var x2 = function_calc(y2);
	return [normalize_x(x1), normalize_y(y1), normalize_x(x2), normalize_y(y2)];
}

function init_drawing(data) {
	var all_text_lines = data.split(/\r\n|\n/);
	var entries = [];
	for (var i = 0; i < all_text_lines.length - 1; i++) {
		var array = all_text_lines[i].split(',');
		array[0] = parseFloat(array[0]);
		array[1] = parseFloat(array[1]);
		if (array[0] < min_value_x)
			min_value_x = array[0];
		if (array[1] < min_value_y)
			min_value_y = array[1];
		if (array[0] > max_value_x)
			max_value_x = array[0];
		if (array[1] > max_value_y)
			max_value_y = array[1];
		entries.push(array);
	}

	for(var i = 0; i < entries.length; i++) {
		var x_y = entries[i].slice(0);
		x_y[0] = normalize_x(x_y[0]);
		x_y[1] = normalize_y(x_y[1]);
		ellipse(x_y[0], x_y[1], 2, 2);
	}

	return entries;
}

function gdb() {
	var values = step_gradient(b, m, points, learning_rate);
	b = values[0];
	m = values[1];
	// change values of b and m from index
	values = get_extreme_points(b, m);
	line(values[0], values[1], values[2], values[3]);
}

function start_gradient() {
	$.ajax({
		type: 'GET',
		url: '/static/hours_score.csv',
		datatype: "text"
	}).done(function (data) {
		points = init_drawing(data);
		ready = true;
	});
}

function setup() {
	canvas = createCanvas(SIZE, SIZE);
	canvas.parent('data-holder');
	background('#C0C0C0');
	start_gradient();
}

function draw() {
	if (ready && iterations > 0) {
		gdb();
		iterations--;
	}
}