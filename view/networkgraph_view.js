var App = App || {};

var width = document.getElementById("net-graph-div").getBoundingClientRect().width;
var height = 600;
var simulation;

//load data
function draw_graph(data, mode, word, metaphor) {
  graph = data;
  //console.log(data);
  d3.select("g").selectAll("*").remove();
  //append a group for the links and load links from json
  link = g.selectAll(".link")
    .data(graph.links)
    .enter()
    .append("line")
    .attr("class", "links")
    .attr("stroke-width", function (d) {

      return d.score;
    });

  link.append("title")
    .text(function (d) { return d.score });

  edgepaths = g.selectAll(".edgepath")
    .data(graph.links)
    .enter()
    .append('path')
    .attr('class', 'edgepath')
    //  .attr('fill-opacity', 1)
    //     .attr('stroke-opacity', 1)
    .attr('id', function (d, i) { return 'edgepath' + i })
  //      .style("pointer-events", "none");

  edgelabels = g.selectAll(".edgelabel")
    .data(graph.links)
    .enter()
    .append('text')
    .style("fill-opacity", 0)
    .attr('class', 'edgelabel')
    .attr('id', function (d, i) { return 'edgelabel' + i })
    .attr('font-size', "5px")
  //    .attr('fill', '#aaa')


  textlink = edgelabels.append('textPath')
    .attr('xlink:href', function (d, i) { return '#edgepath' + i })
    .style("text-anchor", "middle")
    //    .style("pointer-events", "none")
    .attr("startOffset", "50%")
    .text(function (d) {
      var f = d3.format(".3f")
      return f(d.score)
    })
  //console.log(edgelabels);



  //tooltip to display link details
  link
    .on('mouseover.tooltip', function (d) {
      link_mouseover_tooltip(d);
    })
    .on("mouseout.tooltip", function () {
      link_mouseout_tooltip()
    })
    .on('mouseout.fade', fade(1))
    .on("mousemove", function () {
      link_mousemove();
    });

  //append a group for the nodes and load node data from json
  var node = g
    .append("g")
    .attr("class", "nodes")
    .selectAll("g")
    .data(graph.nodes)
    .enter()
    .append("g")
    .attr('id', d => `node-${d.id}`)
    .style('transform-origin', '50% 50%')
    .call(
      d3.drag() //functions to drag and drop
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

  //append circles to the node group and add tooltip details
  node.append('circle')
    .attr("r", function (d) { return radius(d.freq) * .5; })
    .attr("fill", function (d) {
      return color(d.type);
    })
    .on('mouseover.tooltip', function (d) {
      node_mouseover_tooltip(d);
    })
    .on('mouseover.fade', fade(0.1))
    .on("mouseout.tooltip", function () {
      node_mouseout_tooltip();
    })
    .on('mouseout.fade', fade(1))
    .on('mouseover.show_novelty', show_novelty(0))
    .on('mouseout.fade_novelty', fade_novelty())
    .on("mousemove", function () {
      node_mousemove();
    })
    //call zoomnode to zoom nodes on click
    .on('dblclick', zoomnode)

    .on('click', function (d) {
      //console.log(d.id)
      clear_search();
      getSentences(d.id);
      App.selectedNode = d.id;
      search();

    })



  //add texts to nodes    
  var text = g
    .selectAll('.node-text')
    .data(graph.nodes)
    .enter()
    .append("text")
    .attr('class', 'node-text')
    .attr("dy", ".4em")
    .attr("text-anchor", "middle")
    .style("font-size", function (d) { return font_size(d.freq); })
    .style("font-weight", 900)
    .style("stroke-width", function (d) { return font_size(d.freq) * .015; })
    .style("opacity", d => {
      return font_size(d.freq) < 18 ? 0 : 1;
    })
    .text(function (d) { return d.id; })


  //the simulation that controls the layout
  simulation = d3.forceSimulation()
    .force("link",
      d3.forceLink().id(function (d) { return d.id; })
        .distance(function (d) { return radius(d.source.freq * 1.9) + radius(d.target.freq * 1.9); }) //distance among nodes that are connected
      //.strength(function (d) { return 0.09; }) //how zoomed it is
    )
    .force("charge",
      d3
        .forceManyBody()
        .strength(-2)
        .distanceMax(width / 3, height / 3))

    .force("collide", d3.forceCollide(30).strength(1).iterations(10))
    //.force('x', d3.forceX(width / 2).strength(0.5))
    .force('center', d3.forceCenter(width*2.5, height))
    .force('y', d3.forceY(height / 2).strength(0.03));

  simulation
    .nodes(graph.nodes)
    .on("tick", ticked);

  simulation.force("link")
    .links(graph.links);

  //add zoom capabilities 
  var zoom_handler = d3.zoom()
  .scaleExtent([1 / 2, 10])
    .on("zoom", function() {
              translate = d3.event.translate;
              scale = d3.event.scale;
              k = d3.event.transform.k;
              zoom_actions();
});

  zoom_handler(svg);


  //Zoom function-currently need to work on it.
  function zoom_actions() {

    var transform = d3.event.transform;
    g.attr("transform", transform.toString())
    d3.selectAll('.node-text')
      .style('font-size', d => font_size(d.freq) / transform.k)
      .style("stroke-width", function (d) { return font_size(d.freq)*.015/transform.k;})

      .style('opacity', d => {
        return font_size(d.freq) * transform.k < 18 ? 0 : 1;
      })
  /*  svg.selectAll(".legend")
             .attr("transform",transform.toString())*/



    if (transform.k < 1.5) {
    }
    else {
      var hull = d3.selectAll('.edgelabel')
      hull.attr("visibility", "visible")

    }


  }

  function ticked() {
    link
      .attr("x1", function (d) { return d.source.x; })
      .attr("y1", function (d) { return d.source.y; })
      .attr("x2", function (d) { return d.target.x; })
      .attr("y2", function (d) { return d.target.y; });

    node
      .attr("transform", function (d) {
        return "translate(" + d.x + "," + d.y + ")";
      })

    text
      .attr("transform", d => {
        return 'translate(' + d.x + ',' + d.y + ')';
      });

    edgepaths.attr('d', function (d) {
      return 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y;
    });

    edgelabels.attr('transform', function (d) {
      if (d.target.x < d.source.x) {
        var bbox = this.getBBox();

        rx = bbox.x + bbox.width / 2;
        ry = bbox.y + bbox.height / 2;
        return 'rotate(180 ' + rx + ' ' + ry + ')';
      }
      else {
        return 'rotate(0)';
      }
    });

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

  }

  //starting from here to line 170 are for checking the neighbours(level-1) of a highlighted node 
  var linkedByIndex = {};

  graph.links.forEach(d => {
    linkedByIndex[`${d.source.index},${d.target.index}`] = 1;
  });

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

      text.style('fill-opacity', function (o) {
        const thisOpacity = isConnected(d, o) ? 1 : opacity;
        return thisOpacity;
      })

      link.style('stroke-opacity', o => (o.source === d || o.target === d ? 1 : opacity));

    };
  }

  function show_novelty(opacity) {
    return d => {

      edgelabels.style('fill-opacity', o => (o.source === d || o.target === d ? 1 : opacity));


    };

    //console.log(d.id)
  }
  function fade_novelty(opacity) {
    return d => {

      edgelabels.style('fill-opacity', 0);


    };

    //console.log(d.id)
  }


  //called to zoom
  function zoomnode(d) {
    //add zoom capabilities 
    var zoom_handler = d3.zoom()
      .scaleExtent([1 / 2, 10])
      .on("zoom", zoom_actions);
    zoom_handler(App.svg);
  }
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


var randNum = function () {
  return '_' + Math.random().toString(36).substr(2, 9);
};

function gradient(el, wordPercent, i) {
  var gradi = svg.append("defs")
    .append("linearGradient")
    .attr('id', 'gradient' + i)
    .attr('x1', '0%')
    .attr('y1', '100%')
    .attr('x2', '0%')
    .attr('y2', '0%');

  gradi.append('stop')
    .attr('offset', '0%')
    .attr('stop-color', 'orange');

  gradi.append('stop')
    .attr('offset', wordPercent)
    .attr('stop-color', 'orange');

  gradi.append('stop')
    .attr('offset', wordPercent)
    .attr('stop-color', 'skyblue');

  gradi.append('stop')
    .attr('offset', '100%')
    .attr('stop-color', 'skyblue');
}


//detailed graph
function draw_detailed_graph(data, mode, word, metaphor) {


  //set size of nodes based on the frequencies
  var radius = d3.scaleSqrt()
    .range([0, 6]);

  let graph = data,
    width = document.getElementById("net-detailed-div").getBoundingClientRect().width,
    height = document.getElementById("net-detailed-div").getBoundingClientRect().height;

  var posPosition = { "Noun": { x: 0, y: 0 }, "Verb": { x: width, y: 0 }, "Adverb": { x: 0, y: height }, "Adjective": { x: width, y: height } };

  var posDict = {};

  graph.links.forEach(function (d) {
    if (d.source == App.selectedNode)
      posDict[d.target] = d.target_POS;
    else if (d.target == App.selectedNode)
      posDict[d.source] = d.source_POS;
  });

  var forceX = d3.forceX(function (d) { return posPosition[posDict[d.id]] ? posPosition[posDict[d.id]].x : 250 })
    .strength(0.05)

  var forceY = d3.forceY(function (d) { return posPosition[posDict[d.id]] ? posPosition[posDict[d.id]].y : 250 })
    .strength(0.05)

  d3.select("#net-detailed-div").selectAll("*").remove();

  let svg = d3.select("#net-detailed-div").append('svg')
    .attr("width", width)
    .attr("height", height);


  let color = d3.scaleOrdinal(d3.schemeCategory20),
    valueline = d3.line()
      .x(function (d) { return d[0]; })
      .y(function (d) { return d[1]; })
      .curve(d3.curveCatmullRomClosed),
    paths,
    groups,
    groupIds,
    scaleFactor = 1.5,
    polygon,
    centroid,
    node,
    link,
    simulation = d3.forceSimulation()
      .force("link",
        d3.forceLink().id(function (d) { return d.id; })
          .distance(function (d) { return radius(d.source.freq * 2.5) + radius(d.target.freq * 2.5); }) //distance among nodes that are connected
        // .strength(function (d) { return 0.09; }) //how zoomed it is
      )
      .force("charge",
        d3
          .forceManyBody()
          .strength(-90)
          .distanceMax(width / 3, height / 3))

      //.force('x', d3.forceX(width / 2).strength(0.5))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force("x", forceX)
      .force("y", forceY);
  //.force('y', d3.forceY(height / 2).strength(0.03));



  // create groups, links and nodes

  groups = svg.append('g').attr('class', 'groups');
  
  let g = svg.append('g');

  
  g.append("text")
    .text("NOUN")
    .attr("class","detailed-text")
    .attr("transform", "translate(10,20)");

    g.append("text")
    .text("VERB")
    .attr("class","detailed-text")
    .attr("transform", "translate("+(width-80)+",20)");

    g.append("text")
    .text("ADVERB")
    .attr("class","detailed-text")
    .attr("transform", "translate(10,"+(height-20)+")");

    g.append("text")
    .text("ADJECTIVE")
    .attr("class","detailed-text")
    .attr("transform", "translate("+(width-120)+","+(height-20)+")");

    

  link = g.selectAll(".link")
    .data(graph.links)
    .enter()
    .append("line")
    .attr("class", "links")
    .attr("stroke-width", function (d) {
      return d.score * 4;
    });

  link.append("title")
    .text(function (d) { return d.score });

  edgepaths_d = g.selectAll(".edgepath_d")
    .data(graph.links)
    .enter()
    .append('path')
    .attr('class', 'edgepath_d')
    //  .attr('fill-opacity', 1)
    //     .attr('stroke-opacity', 1)
    .attr('id', function (d, i) { return 'edgepath_d' + i })
  //      .style("pointer-events", "none");

  edgelabels_d = g.selectAll(".edgelabel_d")
    .data(graph.links)
    .enter()
    .append('text')
    .style("fill-opacity", 0)
    .attr('class', 'edgelabel_d')
    .attr('id', function (d, i) { return 'edgelabel_d' + i })
    .attr('font-size', "5px")
  //    .attr('fill', '#aaa')


  textlink = edgelabels_d.append('textPath')
    .attr('xlink:href', function (d, i) { return '#edgepath_d' + i })
    .style("text-anchor", "middle")
    //    .style("pointer-events", "none")
    .attr("startOffset", "50%")
    .text(function (d) {
      var f = d3.format(".3f")
      return f(d.score)
    })

  //tooltip to display link details
  link
    .on('mouseover.tooltip', function (d) {
      link_mouseover_tooltip(d);
    })
    .on("mouseout.tooltip", function () {
      link_mouseout_tooltip()
    })
    .on('mouseout.fade', fade(1))
    .on("mousemove", function () {
      link_mousemove();
    });


  node = g
    .attr("class", "nodes")
    .selectAll("g")
    .data(graph.nodes)
    .enter()
    .append("g")
    .attr('id', d => `node-${d.id}`)
    .style('transform-origin', '50% 50%')
    .call(
      d3.drag() //functions to drag and drop
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

  //append circles to the node group and add tooltip details
  node.append('circle')
    .attr("r", function (d) { return radius(d.freq) * .5; })
    .attr("fill", function (d) {
      if (mode == 1) {
        if (d.id == App.keyword) {
          //2 colors in one node
          var totalLinks = d.freq;
          var wordPercent = (word.length / totalLinks) * 100;
          if (word.length === 0) {
            return 'skyblue';
          }
          else if (metaphor.length === 0) {
            return 'orange';
          }
          else {
            var rand = randNum();
            var grad1 = svg.append('g');
            gradient(grad1, wordPercent + "%", (rand));
            return 'url(#gradient' + (rand) + ')';
          }

        }
        else {
          //color metaphor and word nodes
          //console.log(d.id);
          //console.log(metaphor);
          if (metaphor.includes(d.id))
            return 'orange';
          if (word.includes(d.id))
            return 'skyblue';
        }
      }
      else
        return color(d.type);
    })
    .on('mouseover.tooltip', function (d) {
      node_mouseover_tooltip(d);
    })
    .on('mouseover.fade', fade(0.1))
    .on("mouseout.tooltip", function () {
      node_mouseout_tooltip();
    })
    .on('mouseout.fade', fade(1))
    .on('mouseover.show_novelty', show_novelty(0))
    .on('mouseout.fade_novelty', fade_novelty())
    .on("mousemove", function () {
      node_mousemove();
    })
    //call zoomnode to zoom nodes on click
    .on('dblclick', zoomnode)

    .on('click', function (d) {
      //console.log(d.id)
      getSentences2(d.id, App.selectedNode);
      // App.selectedNode = d.id;
      // search();

    });

  //add texts to nodes    
  var text = g
    .selectAll('.zoomed-node-text')
    .data(graph.nodes)
    .enter()
    .append("text")
    .attr('class', 'zoomed-node-text')
    .attr("dy", ".5em")
    .attr("text-anchor", "middle")
    .style("font-size", function (d) { return font_size(d.freq); })
    .style("font-weight", 900)
    .style("stroke-width", function (d) { return font_size(d.freq) * .015; })
    .style("opacity", d => {
      return font_size(d.freq) < 18 ? 0 : 1;
    })
    .text(function (d) { return d.id; })



  //on simulation, load ticks to adjust positions
  simulation
    .nodes(graph.nodes)
    .on("tick", ticked);

  simulation.force("link")
    .links(graph.links);

  //add zoom capabilities 
  var zoom_handler = d3.zoom()
    .scaleExtent([1 / 3, 12])
    .scaleExtent([1 / 2, 10])
    .on("zoom", function() {
              translate = d3.event.translate;
              scale = d3.event.scale;
              k = d3.event.transform.k;
              zoom_actions();
});

  zoom_handler(svg);

  //Zoom function-currently need to work on it.
  function zoom_actions() {

    var transform = d3.event.transform;
    g.attr("transform", transform.toString())
    d3.selectAll('.zoomed-node-text')
      .style('font-size', d => font_size(d.freq) / transform.k)
      .style("stroke-width", function (d) { return font_size(d.freq) * .015 / transform.k; })
      .style('opacity', d => {
        return font_size(d.freq) * transform.k < 18 ? 0 : 1;
      })

  

    if (transform.k < 1.5) {
    }
    else {
      var hull = d3.selectAll('.edgelabel_d')
      hull.attr("visibility", "visible")

    }


  }

  //GROUP
  groupIds = d3
    .set(graph.links.map(
      function (n) {
        if (n.source.id == App.selectedNode)
          return n.target_POS;
        else
          return n.source_POS;
      }))
    .values()
 
  var colorArr={"Noun":"#32CD32","Verb":"#542788", "Adjective":"#FF69B4", "Adverb":"#7F3B08"};

  paths = groups.selectAll('.path_placeholder')
    .data(groupIds, function (d) { return +d; })
    .enter()
    .append('g')
    .attr('class', 'path_placeholder')
    .append('path')
    .attr('class', 'group-path')
    .attr('stroke', function (d) { ; })
    .attr('fill', function (d) { return colorArr[d]; })
    .attr('opacity', 0);

  paths
    .transition()
    .duration(2000)
    .attr('opacity', 1);

  // add interaction to the groups
  groups.selectAll('.path_placeholder')
    .call(d3.drag()
      .on('start', group_dragstarted)
      .on('drag', group_dragged)
      .on('end', group_dragended)
    );

  node.append('title')
    .text(function (d) { return d.id; });

  simulation
    .nodes(graph.nodes)
    .on('tick', ticked)
    .force('link')
    .links(graph.links);

  function ticked() {
    link
      .attr("x1", function (d) { return d.source.x; })
      .attr("y1", function (d) { return d.source.y; })
      .attr("x2", function (d) { return d.target.x; })
      .attr("y2", function (d) { return d.target.y; });

    node
      .attr("transform", function (d) {
        return "translate(" + d.x + "," + d.y + ")";
      })

    text
      .attr("transform", d => {
        return 'translate(' + d.x + ',' + d.y + ')';
      });

    edgepaths_d.attr('d', function (d) {
      return 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y;
    });

    edgelabels_d.attr('transform', function (d) {
      if (d.target.x < d.source.x) {
        var bbox = this.getBBox();

        rx = bbox.x + bbox.width / 2;
        ry = bbox.y + bbox.height / 2;
        return 'rotate(180 ' + rx + ' ' + ry + ')';
      }
      else {
        return 'rotate(0)';
      }
    });


    updateGroups();

  }


  // select nodes of the group, retrieve its positions
  // and return the convex hull of the specified points
  // (3 points as minimum, otherwise returns null)
  var polygonGenerator = function (groupId) {

    var node_coords = node
      .filter(function (d) {
        return posDict[d.id] == groupId;
      })
      .data()
      .map(function (d) { return [d.x, d.y]; });

    if (node_coords.length == 0)
      return null;

    else if (node_coords.length < 3) {
      node_coords.push([node_coords[0][0] + 0.1, node_coords[0][1] + 0.1]);
      node_coords.push([node_coords[0][0] - 0.1, node_coords[0][1] - 0.1]);
    }

    return d3.polygonHull(node_coords);
  };



  function updateGroups() {

    groupIds.forEach(function (groupId) {
      if (polygonGenerator(groupId) == null)
        groupIds.pop(groupId);
    });

    //console.log(groupIds);

    groupIds.forEach(function (groupId) {
      var path = paths.filter(function (d) {
        return d == groupId;
      })
        .attr('transform', 'scale(1) translate(0,0)')
        .attr('d', function (d) {
          polygon = polygonGenerator(d);
          centroid = d3.polygonCentroid(polygon);

          // to scale the shape properly around its points:
          // move the 'g' element to the centroid point, translate
          // all the path around the center of the 'g' and then
          // we can scale the 'g' element properly
          return valueline(
            polygon.map(function (point) {
              return [point[0] - centroid[0], point[1] - centroid[1]];
            })
          );
        });

      d3.select(path.node().parentNode).attr('transform', 'translate(' + centroid[0] + ',' + (centroid[1]) + ') scale(' + scaleFactor + ')');
    });
  }


  // drag nodes
  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
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

  // drag groups
  function group_dragstarted(groupId) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d3.select(this).select('.group-path').style('stroke-width', 3);
  }

  function group_dragged(groupId) {
    node
      .filter(function (d) { return d.group == groupId; })
      .each(function (d) {
        d.x += d3.event.dx;
        d.y += d3.event.dy;
      })
  }

  function group_dragended(groupId) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d3.select(this).select('.group-path').style('stroke-width', 1);
  }




  //starting from here to line 170 are for checking the neighbours(level-1) of a highlighted node 
  var linkedByIndex = {};

  graph.links.forEach(d => {
    linkedByIndex[`${d.source.index},${d.target.index}`] = 1;
  });

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

      text.style('fill-opacity', function (o) {
        const thisOpacity = isConnected(d, o) ? 1 : opacity;
        return thisOpacity;
      })

      link.style('stroke-opacity', o => (o.source === d || o.target === d ? 1 : opacity));
      //    edgelabels.style('fill-opacity', o => (o.source === d || o.target === d ? 1 : opacity));
      //   edgepaths.style('fill-opacity', o => (o.source === d || o.target === d ? 1 : opacity));
      //     textlink.style('fill-opacity', o => (o.source === d || o.target === d ? 1 : opacity));

    };

    //console.log(d.id)
  }

  function show_novelty(opacity) {
    return d => {

      edgelabels_d.style('fill-opacity', o => (o.source === d || o.target === d ? 1 : opacity));


    };

    //console.log(d.id)
  }
  function fade_novelty(opacity) {
    return d => {

      edgelabels_d.style('fill-opacity', 0);


    };

    //console.log(d.id)
  }


  //called to zoom
  function zoomnode(d) {
    //add zoom capabilities 
    var zoom_handler = d3.zoom()
      .scaleExtent([1 / 2, 10])
      .on("zoom", zoom_actions);
    zoom_handler(App.svg);
  }
}