
var App={};

width = document.getElementById("net-graph-div").getBoundingClientRect().width;
height = 600;

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


//set font size of the text
var font_size = d3.scaleLinear()
  .domain([1,50])
  .range([12,28]);
  
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
.force("charge", d3.forceManyBody().strength(-10))
.force("collide", d3.forceCollide(30).strength(1).iterations(1))
.force('x', d3.forceX(width/2).strength(0.5))
.force('y', d3.forceY(height/2).strength(10));


//legend
var legend = svg.append("g")
.attr("class", "legend")
.attr("transform", "translate(" + (50) + "," + (height - 20) + ")")
  .selectAll("g")
    .data([10, 30, 50])
  .enter().append("g");

legend.append("circle")
    .attr("cy", function(d) { return -radius(d); })
    .attr("r", radius);

legend.append("text")
    .attr("y", function(d) { return -2 * radius(d); })
    .attr("dy", "1.3em")
    .text(d3.format(".1s"));

    function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.5).restart();
  p1=d.x;
  p2=d.y;
  d.fx = d.x;
  d.fy = d.y;
  
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);

  d.fx = null;
  d.fy = null;
}