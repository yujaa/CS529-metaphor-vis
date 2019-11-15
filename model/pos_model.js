var App;
// width = 300
// height = 300
// var pos_svg = d3.select("#pos-graph-div").append("svg")
// .attr("width", width)
// .attr("height", height);

var colors= ["#1b9e77", "#d95f02", "#386cb0", "#e7298a"];

////////////////////////////////////////////////////////////
//////////////////////// Set-up ////////////////////////////
////////////////////////////////////////////////////////////

var margin = {left: 20, top: 20, right: 20, bottom: 20},
  width = 300 - margin.left - margin.right,
  height = 300 - margin.top - margin.bottom;
    

////////////////////////////////////////////////////////////// 
///////////////////// Data &  Scales ///////////////////////// 
////////////////////////////////////////////////////////////// 
// d3.json("./word_metaphor_data.json", function(error, data){

// //   var word_POS={};
// //   var metaphor_POS={};
// //   for (let d of data){
// //     if(d.Word_POS_Tag);
// //   }

// // });

//Some random data
App.donutData = [
  {name: "Noun",  value: 3},
  {name: "Verb",    value: 2},
  {name: "Adverb",   value: 2},
  {name: "Adjective",   value: 2},
  {name: "Adjective",  value: 5},
  {name: "Adverb",    value: 2},
  {name: "Verb",   value: 1},
  {name: "Noun",   value: 2}
     ];

var donutData = App.donutData;

