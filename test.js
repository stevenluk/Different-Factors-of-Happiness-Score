




// function createBubbles(features) {
// dimensions
var svgWidth = window.innerWidth*0.7;
var svgHeight =svgWidth*0.65;

// setting the margins 
var margin = {
  top: 20,
  right: 60,
  bottom: 40,
  left: 320
};

// defining the dimensions
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// Select SVG area to it
// is this correct? or should it be going to the "body"
var svg = d3.select(".chart2")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);


  // Appending a group area here
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


  // global variable, creating the scale
  var chosenXAxis = "HappinessScore";
  var chosenYAxis = "Total_Consumption";

  // updating the x-scale
  function xScale(csvData, chosenXAxis) {
    var xLinearScale = d3.scaleLinear()
    .domain([d3.min(csvData, d => d[chosenXAxis]) * 0.90,
     d3.max(csvData, d => d[chosenXAxis]) * 1.10
   ]) 
      .range([0, chartWidth]);

    return xLinearScale;
  }

  function yScale(csvData, chosenYAxis) {
  // creating the y-scale
  var yLinearScale = d3.scaleLinear()
  .domain([d3.min(csvData, d => d[chosenYAxis]) * 0.90 ,
      d3.max(csvData, d => d[chosenYAxis]) * 1.10 
    ]) 
  .range([chartHeight,-50]);
  return yLinearScale;
}

  function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
    xAxis.transition()
    .duration(1000)
    .call(bottomAxis);
    return xAxis;
  }
  function renderYAxes(newYScale, YAxis) {
    var leftAxis = d3.axisLeft(newYScale);
    YAxis.transition()
    .duration(1000)
    .call(leftAxis);
    return YAxis;
  }

  function renderCircles(circlesGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {
    console.log(chosenYAxis);
    console.log(circlesGroup.data())
    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]))
      .attr("cy", d => newYScale(d[chosenYAxis]));

    return circlesGroup;
  }

function renderText(textGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {

    textGroup.transition()
      .duration(1000)
      .attr("x", d => newXScale(d[chosenXAxis]))
      .attr("y", d => newYScale(d[chosenYAxis]))
      // .attr("x",d=>d.happinessScore);

    return textGroup;

  }

  function updateToolTip(label, chosenYAxis, circlesGroup) {

    var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80,-60])
    .html(function(d) {
      if (chosenYAxis === "Total_Consumption") {
        label = "Total Consumption: ";

      }
      else {
        chosenYAxis === "GDP_percapita"
        label = "GDP per capita: ";
      }
        return (`${d.Country}<br>${label}${d[chosenYAxis]}`);
      });
    circlesGroup.call(toolTip);
    circlesGroup
      .on("mouseover", function(data){toolTip.show(data);})
      .on("mouseout", function(data,index) {toolTip.hide(data);});

    return circlesGroup;
      
  }

// loading the data in here
d3.csv("alcoholconsumptionUPDATED.csv").then(function(csvData, err) {

  if(err) throw err;
  // features.forEach( f => {
  //   data = f.properties
  // if (err) throw err;

  csvData.forEach(function(data) {
    data.HappinessScore = +data.HappinessScore;

    data.Total_Consumption = +data.Total_Consumption;
    data.GDP_per_capita = +data.GDP_per_capita;

    data.Country = data.Country;

    // console.log(data)

  });
  // console.log(csvData);
  var yLinearScale = yScale(csvData, chosenYAxis);

  var xLinearScale = xScale(csvData,chosenXAxis);
    //                 d3.scaleLinear()
    // .domain([0, d3.max(csvData,d=>d.happinessScore)])
    // .range([chartHeight,0]);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(bottomAxis);

  // append y axis
  var YAxis = chartGroup.append("g")
    // .classed("y-axis",true)
    // .attr("transform",`translate(0,${chartHeight})`)
    .call(leftAxis);

  var circlesGroup = chartGroup.selectAll("circle")
    .data(csvData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 9)
    // .attr("opacity",".5")
    .attr("stroke-width", "1")
    .attr("fill","pink");
    
  
  var textGroup = chartGroup.selectAll("text")
    .exit() //because enter() before, clear cache
    .data(csvData)
    .enter()
    .append("text")
    .text(d => d.Country)
    .attr("x", d => xLinearScale(d[chosenXAxis]))
    .attr("y", d => yLinearScale(d[chosenYAxis]))
    .attr("font-size", "10px")
    .attr("text-anchor", "middle")
    .attr("class","stateText");

  // creating y axis groups
  var ylabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(-60,${chartHeight / 2})rotate(-90)`);

  var GDP_per_capitaLabel = ylabelsGroup.append("text")
    .attr("x",0)
    .attr("y", 20)
    .attr("value", "GDP_per_capita")
    .classed("inactive", true)
    .text("GDP_per_capita")

  var consumptionLabel = ylabelsGroup.append("text")
    .attr("x",0)
    .attr("y",5)
    .attr("value", "Total_Consumption")
    .classed("active", true)
    .text("Total Alcohol Consumption (liter)");

  var xlabelsGroup = chartGroup.append("g")
  .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);

  // creating x axis group
  var scoreLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "HappinessScore")
    .classed("axis-text", true)
    .text("Happiness Score");

  // var chosenYAxis = "GDP_per_capita"

  var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

  xlabelsGroup.selectAll("text")
    .on("click", function() {

      var value = d3.select(this).attr("value");
      
      if (value !== chosenXAxis) {

        chosenXAxis = value;

        xLinearScale = xScale(csvData, chosenXAxis);
        yLinearScale = yScale(csvData, chosenYAxis);

        xAxis = renderXAxes(xLinearScale, xAxis);

        circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
    
        // updates text with new x values
        textGroup = renderText(textGroup, xLinearScale,yLinearScale,chosenXAxis,chosenYAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        if (chosenYAxis === "HappinessScore") {
          scoreLabel
            .classed("active", true)
            .classed("inactive", false);
           }
        else {
        scoreLabel
          .classed("active", true)
          .classed("inactive", false);
      }

    }

  });

  ylabelsGroup.selectAll("text")
    
    .on("click", function(){

      var value = d3.select(this).attr("value");
      // console.log(value);
      // console.log(chosenYAxis);
      if (value !== chosenYAxis) {

        chosenYAxis = value;

        xLinearScale = xScale(csvData, chosenXAxis);
        yLinearScale = yScale(csvData, chosenYAxis);

        YAxis = renderYAxes(yLinearScale, YAxis);

      
        circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
        

        textGroup = renderText(textGroup, xLinearScale,yLinearScale,chosenXAxis,chosenYAxis);

        // circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        if (chosenYAxis === "Total_Consumption") {
          consumptionLabel
            .classed("active", true)
            .classed("inactive", false);
            GDP_per_capitaLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          consumptionLabel
            .classed("active", false)
            .classed("inactive", true)
            GDP_per_capitaLabel
            .classed("active", true)
            .classed("inactive", false)
        }

      }
    });
}).catch(function(error) {
  console.log(error);
});
// }
