
var App={};

width = 900
height = 400

//tooltip to show details
var tooltip = d3.select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

//append an svg for the network graph
App.svg = d3.select("#net-graph-div").append("svg")
    .attr("width", width)
    .attr("height", height);

var svg =  App.svg;


//add legend
svg.append("circle").attr("cx",20).attr("cy",50).attr("r", 6).style("fill", "limegreen")
svg.append("circle").attr("cx",20).attr("cy",75).attr("r", 6).style("fill", "orchid")
svg.append("circle").attr("cx",20).attr("cy",100).attr("r", 6).style("fill", "orange")
svg.append("text").attr("x", 35).attr("y", 50).text("word").style("font-size", "12px").attr("alignment-baseline","middle")
svg.append("text").attr("x", 35).attr("y", 75).text("word/metaphor").style("font-size", "12px").attr("alignment-baseline","middle")
svg.append("text").attr("x", 35).attr("y", 100).text("metaphor").style("font-size", "12px").attr("alignment-baseline","middle")

//add encompassing group for the zoom 
var g = svg.append("g")
    .attr("class", "everything");

//set color for each node type
var color = d3.scaleOrdinal()
  .domain(["w", "b", "m"])
  .range(["limegreen", "orchid", "orange"]);
  
//set size of nodes based on the frequencies
var radius = d3.scaleSqrt()
    .range([0, 6]);

//constants to set gravity 
const forceX = d3.forceX(width / 2).strength(0.25) 
const forceY = d3.forceY(height / 2).strength(0.25)


//the simulation that controls the layout
var simulation = d3.forceSimulation()
    .force("link", 
           d3.forceLink().id(function(d) { return d.id; })
                         .distance(function(d) { return radius(d.source.freq * 1.9) + radius(d.target.freq *1.9); }) //distance among nodes that are connected
                         .strength(function(d) {return 0.09; }) //how zoomed it is
          )
    .force("charge", d3.forceManyBody().strength(-195)) //distance among nodes that are not connected
  .force("collide", d3.forceCollide().radius(function(d) { return radius(d.freq / 6) + 6; }))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force('x', forceX)
    .force('y',  forceY);

