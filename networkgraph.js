
// var svg = d3.select("#net-graph-div").append("svg")
    width = 800
    height = 400
    const forceX = d3.forceX(width / 2).strength(0.015)
const forceY = d3.forceY(height / 2).strength(0.015)
    var svg = d3.select("#net-graph-div").append("svg")
    .attr("width", width)
    .attr("height", height);

var color = d3.scaleOrdinal()
  .domain(["w", "b", "m"])
  .range(["green", "purple", "orange"]);
  
var radius = d3.scaleSqrt()
    .range([0, 6]);

var simulation = d3.forceSimulation()
    .force("link", 
           d3.forceLink().id(function(d) { return d.id; })
           	.distance(function(d) { return radius(d.source.freq * 5) + radius(d.target.freq * 5); }) //distance among nodes that are connected
          .strength(function(d) {return 0.6; })
          )
    .force("charge", d3.forceManyBody().strength(-20)) //distance among nodes
		.force("collide", d3.forceCollide().radius(function(d) { return radius(d.freq / 2) + 2; }))
    .force("center", d3.forceCenter(width / 2, height / 2))
     .force('x', forceX)
  .force('y',  forceY);

d3.json("./data/metaphor_graph.json", function(error, graph) {
  if (error) throw error;

  var link = svg.append("g")
      .attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter().append("line")
      .attr("stroke-width", function(d) { return d.score*5 });


  var node = svg.append("g")
      .attr("class", "nodes")
    .selectAll("g")
    .data(graph.nodes)
    .enter().append("g")
  .style('transform-origin', '50% 50%')
   .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));
  
  node.append('circle')
      .attr("r", function(d) { return radius(d.freq); })
      .attr("fill", function(d) { return color(d.type); })
    
  
  node.append("text")
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .text(function(d) { return d.id; });

  simulation
      .nodes(graph.nodes)
      .on("tick", ticked);

  simulation.force("link")
      .links(graph.links);

  function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
        .attr("transform", function(d) {
          return "translate(" + d.x + "," + d.y + ")";
        })
  }
});

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
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