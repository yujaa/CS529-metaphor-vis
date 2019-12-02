var App = App ||{};

var filteredGraph;
var checked_w = ["Noun", "Verb", "Adjective", "Adverb"];
var checked_m = ["Noun", "Verb", "Adjective", "Adverb"];

function search(){
  d3.json("./model/data/train_graph_data.json", function(error, data) {
    App.keyword = document.getElementById('search-box').value;
    filter_by_keyword_score(data, App.keyword, 0, 2.5);
    //Show all scores
    brushAdjust(0, 2.5);

  })
  
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