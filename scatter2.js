var svgWidth = window.innerWidth*0.7;
var svgHeight =svgWidth*0.65;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 320
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("AlcoholAbuse.csv").then(function(AlcoholAbuse) {

  // Step 1: Parse Data/Cast as numbers
  // ==============================
  AlcoholAbuse.forEach(function(data) {
    data.Alcohol_Consumption = +data.Alcohol_Consumption;
    data.Alcohol_Use_Disorder = +data.Alcohol_Use_Disorder;
  });

  // Step 2: Create scale functions
  // ==============================
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(AlcoholAbuse, d => d.Alcohol_Consumption)-0.5, d3.max(AlcoholAbuse, d => d.Alcohol_Consumption)])
    .range([0, width]);

  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(AlcoholAbuse, d => d.Alcohol_Use_Disorder)])
    .range([height, 0]);

  // Step 3: Create axis functions
  // ==============================
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Step 4: Append Axes to the chart
  // ==============================
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chartGroup.append("g")
    .call(leftAxis);

  // Step 5: Create Circles
  // ==============================
  var circlesGroup = chartGroup.selectAll("circle")
  .data(AlcoholAbuse)
  .enter()
  .append("circle")
  .attr("cx", d => xLinearScale(d.Alcohol_Consumption))
  .attr("cy", d => yLinearScale(d.Alcohol_Use_Disorder))
  .attr("r", "5")
  .attr("fill", "green")
  .attr("opacity", ".5");

  // Step 6: Initialize tool tip
  // ==============================
  var toolTip = d3.tip()
    .attr("class", "tooltip2")
    .offset([80, -60])
    .html(function(d) {
      return (`<strong>${d.Entity}<br>Alcohol Consumption: ${d.Alcohol_Consumption}<br>Alcohol Disorder %: ${d.Alcohol_Use_Disorder}%`);
    });

  // Step 7: Create tooltip in the chart
  // ==============================
  chartGroup.call(toolTip);

  // Step 8: Create event listeners to display and hide the tooltip
  // ==============================
  circlesGroup.on("click", function(data) {
    toolTip.show(data, this);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  // Create axes labels
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 250)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Percentage of Population with Alcohol Use Disorder");

  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("Alcohol Consumption (Liters per capita)");
}).catch(function(error) {
  console.log(error);
});
