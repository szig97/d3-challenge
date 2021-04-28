  
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
        return data.healthcare;
    });

    xMax = d3.max(healthData, function(data) {
        return data.healthcare;
    });

    yMin = d3.min(healthData, function(data) {
        return data.poverty;
    });

    yMax = d3.max(healthData, function(data) {
        return data.poverty;
    });

    xLinearScale.domain([xMin, xMax]);
    yLinearScale.domain([yMin, yMax]);
    console.log(xMin);
    console.log(yMax);

    // 4. Append Axes to Chart
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
    .attr("cx", d => xLinearScale(d.healthcare +1.5))
    .attr("cy", d => yLinearScale(d.poverty +0.3))
    .attr("r", "12")
    .attr("fill", "blue")
    .attr("opacity", .5)

    .on("mouseout", function(data, index) {
        toolTip.hide(data);
    });

    // 6. Initialize toolTip
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
            return (abbr + '%');
        });
    // 7. Create tooltip in chart
    chartGroup.call(toolTip);

    // 8. Create Event listeners in display and hide tooltip
    circlesGroup.on("click", function(data) {
        toolTip.show(data);
    })
        // onmouseout event
        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        });
        
    // 9. Create axis labels
    chartGroup.append("text")
    .style("font-size", "12px")
    .selectAll("tspan")
    .data(healthData)
    .enter()
    .append("tspan")
        .attr("x", function(data) {
            return xLinearScale(data.healthcare +1.3);
        })
        .attr("y", function(data) {
            return yLinearScale(data.poverty +.1);
        })
        .text(function(data) {
            return data.abbr
        });
})