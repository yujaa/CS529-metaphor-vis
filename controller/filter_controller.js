var App = App ||{};

var filteredGraph;
var checked_w = ["Noun", "Verb", "Adjective", "Adverb"];
var checked_m = ["Noun", "Verb", "Adjective", "Adverb"];
var prevBrushRange;

function search(){
  d3.json("./model/data/train_graph_data.json", function(error, data) {
    //remember the brush range
    prevBrushRange = App.brushRange; 
    if(document.getElementById('search-box').value != ""){
      App.keyword = document.getElementById('search-box').value;
      App.selectedNode = App.keyword;
    }
    else if(App.selectedNode != "")
      App.keyword = App.selectedNode;

    //show detailed view 
    //draw_detailed_graph(data, App.keyword);

    filter_by_keyword_score(data, App.keyword, 0, 2.5);
    //Show all scores
    //brushAdjust(0, 2.5);

    //search box 
    document.getElementById("search-box").readOnly = true;
    document.getElementById("search-button").style.visibility = "hidden";
    document.getElementById("clear-button").style.visibility = "visible";
  })
}

function clear_search(){
    //search box 
    document.getElementById("search-box").removeAttribute("readonly");
    document.getElementById("search-box").value="";
    document.getElementById("search-button").style.visibility = "visible";
    document.getElementById("clear-button").style.visibility = "hidden";
    d3.json("./model/data/train_graph_data.json", function(error, data) {
      App.keyword = null;
      filter_by_keyword_score(data, null, prevBrushRange[0], prevBrushRange[1]);
      brushAdjust(prevBrushRange[0], prevBrushRange[1]);
    });
}


function checkbox(){

  checked_w = [];
  checked_m = [];

  if(document.getElementById("noun-w").checked)
    checked_w.push("Noun");
  if(document.getElementById("verb-w").checked)
    checked_w.push("Verb");
  if(document.getElementById("adjective-w").checked)
    checked_w.push("Adjective");
  if(document.getElementById("adverb-w").checked)
    checked_w.push("Adverb");

  if(document.getElementById("noun-m").checked)
    checked_m.push("Noun");
  if(document.getElementById("verb-m").checked)
    checked_m.push("Verb");
  if(document.getElementById("adjective-m").checked)
    checked_m.push("Adjective");
  if(document.getElementById("adverb-m").checked)
    checked_m.push("Adverb");

   filter_by_keyword_score(App.data,App.keyword, App.brushRange[0], App.brushRange[1]);

}

function getChecked_w()
{
  return checked_w;
}

function getChecked_m()
{
  return checked_m;
}