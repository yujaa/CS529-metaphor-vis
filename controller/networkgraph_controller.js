var App = App || {};

///////////link////////////////////////
function link_mouseover_tooltip(d) {
  tooltip.transition()
    .duration(300)
    .style("opacity", .8);
  tooltip.html("<b>Word: </b>" + d.source.id + "<b><p/>Metaphor: </b>" + d.target.id + "<b><p/>Novelty: </b>" + d.score)
    .style("left", (d3.event.pageX) + "px")
    .style("top", (d3.event.pageY + 10) + "px");
}

function link_mouseout_tooltip() {
  tooltip.transition()
    .duration(100)
    .style("opacity", 0);
}

function link_mousemove() {
  tooltip.style("left", (d3.event.pageX) + "px")
    .style("top", (d3.event.pageY + 10) + "px");
}


//////////node/////////////////////////
function node_mouseover_tooltip(d) {
  tooltip.transition()
    .duration(300)
    .style("opacity", .8);
  if (d.type == "w") {
    tooltip.html("<b>Word: </b>" + d.id + "<p/><b>Type: </b>" + "word")
      .style("left", (d3.event.pageX) + "px")
      .style("top", (d3.event.pageY + 10) + "px");
  }
  if (d.type == "b") {
    tooltip.html("<b>Word: </b>" + d.id + "<p/><b>Type: </b>" + "word/metaphor")
      .style("left", (d3.event.pageX) + "px")
      .style("top", (d3.event.pageY + 10) + "px");
  }
  if (d.type == "m") {
    tooltip.html("<b>Word: </b>" + d.id + "<p/><b>Type: </b>" + "metaphor")
      .style("left", (d3.event.pageX) + "px")
      .style("top", (d3.event.pageY + 10) + "px");
  }
}

function node_mouseout_tooltip() {
  tooltip.transition()
    .duration(100)
    .style("opacity", 0);
}

function node_mousemove() {
  tooltip.style("left", (d3.event.pageX) + "px")
    .style("top", (d3.event.pageY + 10) + "px");
}

function node_click(d) {
  getSentences(d.id);
  //document.getElementById("zoomed_image").style.visibility = "visible";
  document.getElementById("pos-graph-div").style.visibility = "visible";

  App.selectedNode = d.id;
  search();
}



//starting from here to line 170 are for checking the neighbours(level-1) of a highlighted node 

function isConnected(a, b) {
  return linkedByIndex[`${a.index},${b.index}`] || linkedByIndex[`${b.index},${a.index}`] || a.index === b.index;
}

// fade the rest of the graph except the neighbours of a highlighted node
function fade(opacity) {
  return d => {
    node.style('stroke-opacity', function (o) {
      const thisOpacity = isConnected(d, o) ? 1 : opacity;
      this.setAttribute('fill-opacity', thisOpacity);
      return thisOpacity;
    });

    link.style('stroke-opacity', o => (o.source === d || o.target === d ? 1 : opacity));

  };

  //console.log(d.id)
}

//called to zoom
function zoomnode(d) {
  //add zoom capabilities 
  var zoom_handler = d3.zoom()
    .scaleExtent([1 / 2, 6])
    .on("zoom", zoom_actions);
  zoom_handler(App.svg);
}

//these functions are for dragging
function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.5).restart();
  p1 = d.x;
  p2 = d.y;
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

