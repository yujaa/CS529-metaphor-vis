var App = App ||{};

var filteredGraph;

var keyword;
var checked = ["verb"];

function search(){
  d3.json("./model/data/train_graph_data.json", function(error, data) {
    keyword = document.getElementById('search-box').value;
    filter_by_keyword(data,keyword);

  })
  
}

function checkbox(){

  App.checked = [];
  if(document.getElementById("noun").checked)
    checked.push("Noun");
  if(document.getElementById("pronoun").checked)
    checked.push("Pronoun");
  if(document.getElementById("verb").checked)
    checked.push("Verb");
  if(document.getElementById("adjective").checked)
    checked.push("Adjective");
  if(document.getElementById("adverb").checked)
    checked.push("Adverb");


  filter_by_keyword(App.data,App.keyword);
  return checked;
}

function getChecked()
{
  return checked;
}