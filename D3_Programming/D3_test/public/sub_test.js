/**
 * http://usejsdoc.org/
 */

var data = [
            {date: "01-May-11", close: "58.13"},
            {date: "30-Apr-11", close: "37.98"},
            {date: "27-Apr-11", close: "67.00"},
            {date: "26-Apr-11", close: "45.70"},
            {date: "25-Apr-11", close: "60.00"}
           ];

var parseDate = d3.time.format("%d-%b-%y").parse;
var margin = {top: 30, right: 40, bottom: 100, left: 50};
var width = 800 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;
var xScale = d3.time.scale().range([0, width]);
var yScale = d3.scale.linear().range([height, 0]);
var xAxis = d3.svg.axis().scale(xScale).orient("bottom").ticks(5).tickFormat(d3.time.format("%Y-%m-%d"));
var yAxis = d3.svg.axis().scale(yScale).orient("left").ticks(20);

var dataAlt = [
               {date: "01-May-11", close: "58.13"},
               {date: "30-Apr-11", close: "37.98"},
               {date: "27-Apr-11", close: "67.00"},
               {date: "26-Apr-11", close: "45.70"},
               {date: "25-Apr-11", close: "60.00"}
              ];

function updateData() {
	
	dataAlt.forEach(function (d) {
		d.date = parseDate(d.date);
		d.close = +d.close;
	});
	
	xScale.domain(d3.extent(dataAlt, function (d) {
		return d.date;
	}));
	
	yScale.domain([0, d3.max(dataAlt, function (d) {
		return d.close + 10;
	})]);
	
	var svg = d3.select("body").transition();
	
	svg.select(".line")
	.duration(500)
	.attr("d", valueLine(dataAlt));
	
	svg.select(".area")
	.duration(500)
	.attr("d", valueArea(dataAlt));
	
	svg.select(".x.axis")
	.duration(500)
	.call(xAxis)
	.selectAll("text")
	.style("text-anchor", "end")
	.attr("dx", "-0.8em")
	.attr("dy", "0.15em")
	.attr("transform", function (d) {
		return "rotate(-65)";
	});
	
	svg.select(".y.axis")
	.duration(500)
	.call(yAxis);
	
	svg.select(".grid")
	.duration(500)
	.call(make_x_axis()
			.tickSize(-height, 0, 0)
			.tickFormat("")
	);
}

var valueLine = d3.svg.line()
.interpolate("basis") // linear, step-before, step-after, basis, cadinal, monotone
.x(function (d) {
	return xScale(d.date);
})
.y(function (d) {
	return yScale(d.close);
});

var valueArea = d3.svg.area()
.x(function (d) {
	return xScale(d.date);
})
.y0(height)
.y1(function (d) {
	return yScale(d.close);
});

function make_x_axis() {
	return d3.svg.axis()
	.scale(xScale)
	.orient("bottom")
	.ticks(5);
}

function make_y_axis() {
	return d3.svg.axis()
	.scale(yScale)
	.orient("left")
	.ticks(20);
}

data.forEach(function (d) {
	//alert('Before : ' + d.date + ', ' + d.close);
	d.date = parseDate(d.date);
	d.close = +d.close;
	//alert('After : ' + d.date + ', ' + d.close);
});

xScale.domain(d3.extent(data,
		function (d) {
	return d.date;
}));

yScale.domain([0, d3.max(data,
		function (d) {
	return d.close;
})]);

// D3.js has a function (D3.max) which calculates the maximum value of an array.

var svg = d3.select("body")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

svg.append("path")
.datum(data)
.attr("class", "area")
.attr("d", valueArea);
svg.append("path")
.attr("class", "line")
.attr("d", valueLine(data));

// The SVG Group Element is defined by <g> and </g>.
svg.append("g")
.attr("class", "x axis")
.attr("transform", "translate(0, " + height + ")")
.call(xAxis)
.selectAll("text")
.style("text-anchor", "end")
.attr("dx", "-.8em")
.attr("dy", ".15em")
.attr("transform", function (d) {
	return "rotate(-65)";
});

svg.append("g")
.attr("class", "y axis")
.style("fill", "blue")
.call(yAxis);
svg.append("g")
.attr("class", "grid")
.attr("transform", "translate(0," + height + ")")
.call(make_x_axis()
		.tickSize(-height, 0, 0)
		.tickFormat("")
);

svg.append("g")
.attr("class", "grid")
.call(make_y_axis()
		.tickSize(-width, 0, 0)
		.tickFormat("")
);

svg.append("text")
.attr("x", width/2)
.attr("y", height + margin.bottom)
.style("text-anchor", "middle")
.text("Date Range");

svg.append("text")
.attr("transform", "rotate(-90)")
.attr("y", 0 - (margin.left))
.attr("x", 0 - (height / 2))
.attr("dy", "1em")
.style("text-anchor", "middle")
.text("Value");

svg.append("text")
.attr("x", (width / 2))
.attr("y", 0 - (margin.top / 2))
.attr("text-anchor", "middle")
.style("font-size", "16px")
.style("text-decoration", "underline")
.text("D3.js Test Source by YYS");

function get_data(d){
	dataAlt = d;
}

