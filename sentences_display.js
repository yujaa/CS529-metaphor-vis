
var myJson;
myJson = {
    "nodes": [
        {
            "id": "worth",
            "freq": 3,
            "type": "b"
        },
        {
            "id": "mills",
            "freq": 1,
            "type": "w"
        },
        {
            "id": "commercial",
            "freq": 2,
            "type": "w"
        },
        {
            "id": "growth",
            "freq": 2,
            "type": "b"
        },
        {
            "id": "makes",
            "freq": 1,
            "type": "w"
        },
        {
            "id": "arguments",
            "freq": 1,
            "type": "w"
        },
        {
            "id": "people",
            "freq": 1,
            "type": "w"
        },
        {
            "id": "contrast",
            "freq": 1,
            "type": "w"
        },
        {
            "id": "reduced",
            "freq": 1,
            "type": "w"
        },
        {
            "id": "genial",
            "freq": 1,
            "type": "w"
        },
        {
            "id": "free",
            "freq": 1,
            "type": "m"
        },
        {
            "id": "regiment",
            "freq": 1,
            "type": "m"
        },
        {
            "id": "plans",
            "freq": 1,
            "type": "m"
        },
        {
            "id": "pressures",
            "freq": 2,
            "type": "m"
        },
        {
            "id": "powerful",
            "freq": 2,
            "type": "m"
        },
        {
            "id": "express",
            "freq": 1,
            "type": "m"
        },
        {
            "id": "role",
            "freq": 1,
            "type": "m"
        },
        {
            "id": "landmark",
            "freq": 1,
            "type": "m"
        }
    ],
    "links": [
        {
            "source": "worth",
            "target": "free",
            "score": 0.369248292,
            "sentence": "So I get a free twenty five pound worth of Marks and Spencers erm gift vouchers which ."
        },
        {
            "source": "worth",
            "target": "regiment",
            "score": 0.488326962,
            "sentence": "I told Northcliffe that if his people would make enquiries at our Central Office , he would find that our nightly regiment of speakers was at least as well worth reporting as the Radical contingent , but that I realized that from the Press point of view , no doubt , our speakers did not play up to the reporters by> handing them their speeches in advance , and by other tricks of the kind to which the Radical orators have recourse ."
        },
        {
            "source": "mills",
            "target": "worth",
            "score": 0.382523847,
            "sentence": "But Bankside is nevertheless a sound structure which , like the best mills of the Industrial Revolution , is well worth preserving and is perfectly capable of adaptation for a new commercial use ."
        },
        {
            "source": "commercial",
            "target": "plans",
            "score": 0.68437755,
            "sentence": "Take away or subsidise all nuclear power stations and you lose the commercial logic of the privatisation plans ."
        },
        {
            "source": "commercial",
            "target": "pressures",
            "score": 0.548916423,
            "sentence": "Under strain for a start because it was technically ill-equipped to avert disaster or to cope with the consequences when disaster struck ; under strain from commercial pressures which , as the inquiry puts it , compromised safety ; under strain above all because the people on the spot could n't or would n't cope , were weary from gruesome working hours ( the senior signal technician who heads the list of the culpable had had only one day off in the past 13 weeks ) , lacked adequate training , or simply could n't be bothered ."
        },
        {
            "source": "growth",
            "target": "pressures",
            "score": 0.504554631,
            "sentence": "This was by no means an accident , since throughout the 1970s a powerful body of media , political , and academic opinion had been constructed around the theme of how Britain was drifting into a violent society, and how the basis of consent was being shifted by the pressures of immigration and the growth of multi-racial inner city areas ."
        },
        {
            "source": "makes",
            "target": "growth",
            "score": 0.478775974,
            "sentence": "Unlike Lukcs ' insignificant event from which the universal is precariously drawn out through the narrative , Sartre 's singularity works synecdochally in a conventional antinomy with the universal , the relation between the two structured according to the familiar nineteenth-century model of organic growth or process in which each singular event makes up the whole while , as he puts it , the whole is entirely present in the part as its present meaning and as its destiny."
        },
        {
            "source": "arguments",
            "target": "powerful",
            "score": 0.731905413,
            "sentence": "There are powerful arguments in favour of saying that there are other killings where an intent to kill can not be established , and yet where the moral or social culpability is equal to that in most intentional killings ."
        },
        {
            "source": "people",
            "target": "powerful",
            "score": 0.66794984,
            "sentence": "The British people have in the past found them rather more powerful than the corporations which are popularly supposed to finance the Conservative party ."
        },
        {
            "source": "contrast",
            "target": "express",
            "score": 0.203022634,
            "sentence": "In contrast , only a minority of girls express an interest in science at any age but there is no obvious swing from science in the middle and late teens ."
        },
        {
            "source": "reduced",
            "target": "role",
            "score": 0.647485672,
            "sentence": "During his term as President of FISA he gradually reduced his role in Eduard Keller Ltd and used the company offices to provide a world headquarters for rowing ."
        },
        {
            "source": "genial",
            "target": "landmark",
            "score": 1.334043647,
            "sentence": "He seemed a genial and indestructible landmark in the history of American music , in spite of defective hearing which had bothered him since the late Seventies ."
        }
    ]
}
let linkArray = myJson.links;
let sentences = linkArray.map(a => a.sentence);

document.getElementById("sentences-heading").innerHTML = "The sentences with the word-metaphor are:";


function makeUL(array) {
    // Create the list element:
    var list = document.createElement('ol');


    for(var i = 0; i < array.length; i++) {
        // Create the list item:
        var item = document.createElement('li');

        // Set its contents:
        item.appendChild(document.createTextNode(array[i]));

        // Add it to the list:
        list.appendChild(item);
    }

    // Finally, return the constructed list:
    return list;
}

function getSentences(word){
    let sentenceArr= [];
    let wordArr=[];
    let metaphorArr=[];
    for (let d in linkArray){
        //console.log(linkArray[d])
        if(linkArray[d].source == word || linkArray[d].target == word){
            sentenceArr.push(linkArray[d].sentence)
            wordArr.push(linkArray[d].source)
            metaphorArr.push(linkArray[d].target)
        }
    }

    document.getElementById('sentences-list').innerHTML = ''

    //print 
    for(let d in sentenceArr){

        console.log(sentenceArr[d]);
        var newNode = document.createElement('p');
        console.log(wordArr[d]);
        //highlight words
        sentenceArr[d] = sentenceArr[d].replace(wordArr[d], "<text style='color:limegreen; font-size:18px'>"+wordArr[d]+"</text>");
        sentenceArr[d] = sentenceArr[d].replace(metaphorArr[d], "<text style='color:orange; font-size:18px'>"+metaphorArr[d]+"</text>");
        console.log(sentenceArr[d]);
        newNode.innerHTML="* " + sentenceArr[d];

        // Add the contents of sentences to #sentences-tab
        document.getElementById('sentences-list').appendChild(newNode);
    }


}

//getSentences("powerful");


//document.getElementById('sentences-list').appendChild(makeUL(sentences));