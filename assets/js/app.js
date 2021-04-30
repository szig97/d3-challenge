var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create SVG wrapper
var svg = d3.select("body")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);

d3.csv('data.csv').then(function(healthData, err) {
    if (err) throw err;
console.log(healthData)
    // 1. Parse Data as numbers
    healthData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    });

    // 2. Create scale functions
    var xLinearScale = d3.scaleLinear().range([0, width]);
    var yLinearScale = d3.scaleLinear().range([height, 0]);

    // 3. Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    var xMin;
    var xMax;
    var yMin;
    var yMax;

    xMin = d3.min(healthData, function(data) {
        return data.poverty;
    });

    xMax = d3.max(healthData, function(data) {
        return data.poverty;
    });

    yMin = d3.min(healthData, function(data) {
        return data.healthcare;
    });

    yMax = d3.max(healthData, function(data) {
        return data.healthcare;
    });

    xLinearScale.domain([xMin, xMax]);
    yLinearScale.domain([yMin, yMax]);
    console.log(xMin);
    console.log(yMax);

    // 4. Append Axes to Chart
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    // 5. Create Circles
    var circlesGroup = chartGroup.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty +1.5))
    .attr("cy", d => yLinearScale(d.healthcare +0.3))
    .attr("r", "12")
    .attr("fill", "gray")
    .attr("opacity", .5)

    // 6. Create labels

    // State Abbreviations
    chartGroup.append("text")
    .style("font-size", "12px")
    .selectAll("tspan")
    .data(healthData)
    .enter()
    .append("tspan")
        .attr("x", function(data) {
            return xLinearScale(data.poverty +1.3);
        })
        .attr("y", function(data) {
            return yLinearScale(data.healthcare +.1);
        })
        .text(function(data) {
            return data.abbr
        });

    // Axis labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 50)
        .attr("x", 0 - (height/2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Lacks Healthcare(%)")

    chartGroup.append("text")
        .attr("transform", `translate(${width/2}, ${height + margin.top + 15})`)
        .attr("class", "axisText")
        .text("In Poverty (%)");
});