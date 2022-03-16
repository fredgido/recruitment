
//Global variables
  const nodeArray = [{
    cardId: "",
    question: { input: "", score: 0 },
    lines: [{ lineId: "", input: "", score: 0 }],
    type:"",
}];

let selectId = "";
let flag = false;
let formData;

var emptyArray = {
  contest_id: null,
  type: "",
  description: "",
  options: "",
  scores: ""
};


//Card to single question
function newQuestion1(ContestQuestion) {
  const temp = { cardId: "", question: { input: "", score: 0 }, lines: [], type:"Text" };
  if (nodeArray.length > 0) {
    flag = false;
    for (let i = 0; i < nodeArray.length; i++) {
      if (nodeArray[i].cardId == "") {
        nodeArray[i].cardId = "card" + i;
        nodeArray[i].lines = [];
        nodeArray[i].question.input = "";
        nodeArray[i].question.score = 0;
        nodeArray[i].type = 'Text';
        selectId = nodeArray[i].cardId;
        flag = true;
        break;
      }
    }
    if (flag == false) {
      selectId = "card" + nodeArray.length;
      temp.cardId = selectId;
      temp.question = { input: "", score: 0 };
      temp.question.input = "";
      temp.question.score = 0;
      temp.lines = [];
      temp.type = 'Text';
      nodeArray.push(temp);
    }
  } else {
    temp.cardId = "card0";
    temp.lines = [];
    temp.question.input = "";
    temp.question.score = 0;
    temp.type = 'Text';
    nodeArray.push(temp);
    selectId = nodeArray[0].cardId;
  }

  const para = document.getElementById("container");
  const nodeNewQuestion = document.createElement("div");
  nodeNewQuestion.id = selectId;
  nodeNewQuestion.classList.add("questionCard");
  nodeNewQuestion.innerHTML =
    `<br>
      <div class="card w-26">
        <div class="card-header rounded">
          <h5 class="card-title">Pergunta Livre</h5>
          <button class="btn-close float-end" id='btn_close' onclick="deleteCard(\'` +selectId +`\')"></button>
        </div>
        <div class="card-body">
            <div class="row">
                <div class="col-md-10 mb-3">
                <input type="hidden" name="type" value="Texto" class="form-control"/>
                      <input id="` +selectId +"_question_input" +`" name="description" value="`+ ContestQuestion.description +`" type="text" class="form-control" required placeholder="Insira uma pergunta" />
                </div>
                <div class="col-md-2 mb-3">
                    <input id="` +selectId +"_question_score" +`" name="scores" value="`+ ContestQuestion.scores +`" type="text" class="form-control" placeholder="Pontuação" required>
                </div>
            </div>
          </div>
        </div>    `;
  para.appendChild(nodeNewQuestion);
};
document.querySelector("#new-question1").onclick = function (){
  newQuestion1(emptyArray);
}

//Card to multi question
function newQuestion2(ContestQuestion) {
  const temp = { cardId: "", question: { input: "", score: 0 }, lines: [],type:"Multi" };
  if (nodeArray.length > 0) {
    flag = false;
    for (let i = 0; i < nodeArray.length; i++) {
      if (nodeArray[i].cardId == "") {
        nodeArray[i].cardId = "card" + i;
        nodeArray[i].question.input = "";
        nodeArray[i].question.score = "";
        nodeArray[i].lines = [];
        nodeArray[i].type = 'Multi';
        selectId = nodeArray[i].cardId;
        flag = true;
        break;
      }
    }
    if (flag == false) {
      selectId = "card" + nodeArray.length;
      temp.cardId = selectId;
      temp.question.input = "";
      temp.question.score = "";
      temp.lines = [];
      temp.type = 'Multi';
      nodeArray.push(temp);
    }
  } else {
    temp.cardId = "card0";
    temp.question.input = "";
    temp.question.score = "";
    temp.lines = [];
    temp.type = 'Multi';
    nodeArray.push(temp);
    selectId = nodeArray[0].cardId;
  }


  const para = document.getElementById("container");
  const nodeNewQuestion = document.createElement("div");
  nodeNewQuestion.id = selectId;
  nodeNewQuestion.classList.add("questionCard");
  nodeNewQuestion.innerHTML =
    `
    <br>
<div class="card w-26">
    <div class="card-header rounded">
      <h5 class="card-title">Escolha Múltlipla</h5>
      <button id="new-multi" type="button" class="btn btn-primary" id='btn_close' onclick="addQuestion(\'` + selectId +`\')">Adicionar</button>
      <button class="btn-close float-end" id='btn_close' onclick="deleteCard(\'` + selectId +`\')"></button>
    </div>
    <div class="card-body">
      <div class="row">
        <div class="col-md-12 mb-3 ">
            <input type="hidden" name="type" value="Selecao" class="form-control" />
            <input id="` +selectId +"_question_input" +`" name="description" value="`+ ContestQuestion.description +`" type="text" class="form-control" required placeholder="Insira uma pergunta" />
        </div>
        
        <!--<div class="col-md-2 mb-3">
            <input id="` +selectId +"_question_score" +`" name="scores" value="`+ ContestQuestion.scores +`" type="text" class="form-control" placeholder="Pontuação" required>
        </div>-->
      </div>
        <div id='multi-requirements' class="multi-list-group-item">
            <div class="container"  id="multi">                           
            </div>
        </div>
    </div>
</div>
`;

  para.appendChild(nodeNewQuestion);

  for(var l = 0; l < ContestQuestion.options.length; l++){
    addQuestion(selectId, {options: ContestQuestion.options[l], scores: ContestQuestion.scores[l]});
  }
  
};
document.querySelector("#new-question2").onclick = function () {
  newQuestion2(emptyArray);
}

//Card to line to multi question
function addQuestion(cardId, ContestQuestion) {
  if(ContestQuestion == null){
    ContestQuestion = emptyArray;
  }
  const tempLine = {};
  tempLine.lineId = "";
  tempLine.input = "";
  tempLine.score = 0;
  if (nodeArray[cardId.slice(4)].lines.length > 0) {
    flag = false;
    for (let j = 0; j < nodeArray[cardId.slice(4)].lines.length; j++) {
      if (nodeArray[cardId.slice(4)].lines[j].lineId == "") {
        nodeArray[cardId.slice(4)].lines[j].lineId = "line" + j;
        lineId = nodeArray[cardId.slice(4)].lines[j].lineId;
        flag = true;
        break;
      }
    }
    if (flag == false) {
      lineId = "line" + nodeArray[cardId.slice(4)].lines.length;
      tempLine.lineId = lineId;
      nodeArray[cardId.slice(4)].lines.push(tempLine);
    }
  } else {
    if (nodeArray[cardId.slice(4)].lines[0] != undefined) {
      nodeArray[cardId.slice(4)].lines[0].lineId = "line0";
    } else {
      tempLine.lineId = "line0";
      nodeArray[cardId.slice(4)].lines.push(tempLine);
    }
    lineId = nodeArray[cardId.slice(4)].lines[0].lineId;
  }

  const cardDoc = document.querySelector("#" + cardId + " .card-body");
  const newQ = document.createElement("div");
  newQ.classList.add("card-body");
  newQ.id = lineId;
  newQ.innerHTML =
    `
    <div class="row">
      <input class="form-check-input" type="radio" name="exampleForm" id="radio1" />
      <div class="col-md-5 mb-3 ">
          <input type="hidden" name="type" value="Selecao" class="form-control" />
          <input id="` + cardId + "_" + lineId + "_input" + `" name="option" value="`+ ContestQuestion.options +`" type="text" class="form-control" required placeholder="Insira uma pergunta" />
      </div>       
      <div class="col-md-2 mb-3">
          <input id="` + cardId + "_" + lineId + "_score" + `" name="scores" value="`+ ContestQuestion.scores +`" type="text" class="form-control" placeholder="Pontuação" required>
      </div>
      <button class="btn-close float-right" id='btn_close' onclick="deleteLine(\'` + cardId + `\',\'` + lineId + `\')"></button>
    </div>
       `;
  cardDoc.parentElement.append(newQ);
}

//Card to file question
function newQuestion3(ContestQuestion) {
  const temp = { cardId: "", question: { input: "", score: 0 }, lines: [],type:"File" };
  if (nodeArray.length > 0) {
    flag = false;
    for (let i = 0; i < nodeArray.length; i++) {
      if (nodeArray[i].cardId == "") {
        nodeArray[i].cardId = "card" + i;
        nodeArray[i].question.input = "";
        nodeArray[i].question.score = "";
        nodeArray[i].lines = [];
        nodeArray[i].type = 'File';
        selectId = nodeArray[i].cardId;
        flag = true;
        break;
      }
    }
    if (flag == false) {
      selectId = "card" + nodeArray.length;
      temp.cardId = "card" + nodeArray.length;
      temp.question.input = "";
      temp.question.score = "";
      temp.lines = [];
      temp.type = 'File';
      nodeArray.push(temp);
    }
  } else {
    temp.cardId = "card0";
    temp.question.input = "";
    temp.question.score = "";
    temp.lines = [];
    temp.type = 'File';
    nodeArray.push(temp);
    selectId = nodeArray[0].cardId;
  }


  const para = document.getElementById("container");
  const nodeNewQuestion = document.createElement("div");
  nodeNewQuestion.id = selectId;
  nodeNewQuestion.classList.add("questionCard");
  nodeNewQuestion.innerHTML =
    `
    <br>
    <div class="card w-26"> 
      <div class="card-header rounded"> 
        <h5 class="card-title">Ficheiro</h5>
        <button  class="btn-close float-end" id='btn_close' onclick="deleteCard(\'` + selectId +`\')"></button>
      </div> 
      <div class="card-body rounded">
        <div class="row">
          <div class="col-md-10 mb-3 ">
              <input type="hidden" name="type" value="Selecao" class="form-control" />
              <input id="` +selectId +"_question_input" +`" name="description" value="`+ ContestQuestion.description +`" type="text" class="form-control" required placeholder="Insira uma pergunta" />
          </div>
          <div class="col-md-2 mb-3">
              <input id="` +selectId +"_question_score" +`" name="scores" value="`+ ContestQuestion.scores +`" type="text" class="form-control" placeholder="Pontuação" required>
          </div>
        </div>
        <div class="wrapperfile">
          <form id="formfile">
            <input class="file-input" type="file"  hidden>
              <i class="fas fa-cloud-upload-alt"></i>
              <p>Inserir ficheiro</p>
          </form>
          <section class="progress-area"></section>
          <section class="uploaded-area"></section>
        </div>   
      </div>
    </div>
   
    
    `;
  para.appendChild(nodeNewQuestion);

  //File handler
  const form = document.querySelector("#formfile"),
    fileInput = document.querySelector(".file-input"),
    progressArea = document.querySelector(".progress-area"),
    uploadedArea = document.querySelector(".uploaded-area");
  form.addEventListener("click", () => {
    fileInput.click();
  });
  fileInput.onchange = ({ target }) => {
    let file = target.files[0];
    if (file) {
      let fileName = file.name;
      if (fileName.length >= 12) {
        let splitName = fileName.split(".");
        fileName = splitName[0].substring(0, 13) + "... ." + splitName[1];
      }
      uploadFile(fileName);
    }
  };

  function uploadFile(name) {
    let xhr = new XMLHttpRequest();

    xhr.open("POST", "/uploadfile", true);

    xhr.upload.addEventListener("progress", ({ loaded, total }) => {
      let fileLoaded = Math.floor((loaded / total) * 100);
      let fileTotal = Math.floor(total / 1000);
      let fileSize;
      fileTotal < 1024
        ? (fileSize = fileTotal + " KB")
        : (fileSize = (loaded / (1024 * 1024)).toFixed(2) + " MB");
      let progressHTML = `<li class="row">
                            <i class="fas fa-file-alt"></i>
                            <div class="content">
                              <div class="details">
                                <span class="name">${name} • Uploading</span>
                                <span class="percent">${fileLoaded}%</span>
                              </div>
                              <div class="progress-bar">
                                <div class="progress" style="width: ${fileLoaded}%"></div>
                              </div>
                            </div>
                          </li>`;
      uploadedArea.classList.add("onprogress");
      progressArea.innerHTML = progressHTML;
      if (loaded == total) {
        progressArea.innerHTML = "";
        let uploadedHTML = `<li class="row">
                              <div class="content upload">
                                <i class="fas fa-file-alt"></i>
                                <div class="details">
                                  <span class="name">${name} • Uploaded</span>
                                  <span class="size">${fileSize}</span>
                                </div>
                              </div>
                            </li>`;
        uploadedArea.classList.remove("onprogress");
        uploadedArea.insertAdjacentHTML("afterbegin", uploadedHTML);
      }
    });
    let data = new FormData(form);
    xhr.send(data);
  }
  
};
document.querySelector("#new-question3").onclick = function () {
  newQuestion3(emptyArray);
}


//Function delete cards
function deleteCard(cardId) {
  const parent = cardId.slice(4);
  nodeArray[parent].cardId = "";
  nodeArray[parent].lines = [];
  
 for (let [i, card] of nodeArray.entries()) {
    if (card.cardId == cardId) {
      nodeArray.splice(i, 1);
    }
  }

  var element = document.getElementById(cardId);
  element.parentNode.removeChild(element);
}

//Function delete lines from multi question
function deleteLine(cardId, lineId) {
  const element = document.getElementById(cardId);
  const child = lineId.slice(4);
  nodeArray[cardId.slice(4)].lines[child] = "";
  var lineElem = element.querySelector("[id=" + lineId + "]");
  lineElem.parentNode.removeChild(lineElem);
  console.log(' nodeArray afterDelete ',nodeArray)
}

const dbArray = [];
//Function save survey o Data Base
document.querySelector("#saveFormBtn").onclick = function () {
   
    dbArray.length = 0;
    for (i = 0; i < nodeArray.length; i++) {
      var question_input = document.querySelector("#" + nodeArray[i].cardId + "_question_input");
      var question_score = document.querySelector("#" + nodeArray[i].cardId + "_question_score");    
      if(question_input != null){
        nodeArray[i].question.input = question_input.value;
        if(question_score != null){
          nodeArray[i].question.score = question_score.value;
        }
      }  
      if (nodeArray[i].lines.length > 0) {
        for (j = 0; j < nodeArray[i].lines.length; j++) {
          if(nodeArray[i].lines[j]!=""){
            nodeArray[i].lines[j].input = document.querySelector("#" +nodeArray[i].cardId +"_" +nodeArray[i].lines[j].lineId +"_input").value;
            nodeArray[i].lines[j].score = document.querySelector("#" +nodeArray[i].cardId +"_" +nodeArray[i].lines[j].lineId +"_score").value; 
          }       
        }
      }
    }

    console.log(nodeArray)


    let cardOrder = document.querySelectorAll(".questionCard");
    let orderedArray = [];
    cardOrder.forEach((card) => {
      for(i=0;i<nodeArray.length;i++){
        if(card.id === nodeArray[i].cardId){
          orderedArray.push(nodeArray[i]);
        }
      }
    });
    
    const contestId = window.location.href.split("/")[window.location.href.split("/").length-1];

    let tempLine = {
      contest_id: null,
      type:null,
      description:null,
      options: [],
      scores: [],
      order:null
    };

    orderedArray.forEach(card => {
      if(card.cardId != ""){          
        tempLine.contest_id = contestId;        
        //TEXTO
        if (card.type == "Text"){
          tempLine.type = card.type;
          tempLine.description = card.question.input;
          tempLine.options.push(card.lines.input);
          tempLine.scores.push(card.question.score);
        }

        //MULTIPLA
        if (card.type == "Multi"){
          tempLine.type = card.type;
          tempLine.description = card.question.input;
            if(card.lines.length>0){
                card.lines.forEach(line => {
                  if( line != ""){
                    tempLine.options.push(line.input);
                    tempLine.scores.push(line.score);
                  }
                });
            }          
        }
        //FICHEIRO
        if (card.type == "File"){
          tempLine.type = card.type;
          tempLine.description = card.question.input;
          tempLine.scores.push(card.question.score);
        }

        dbArray.push(tempLine);
        tempLine=cleanTempLine();
      }
    });
    console.log('dbArray ',dbArray)
    saveContent ('/insert_form_guardar','POST', dbArray, contestId)
  
};

//Function to submit survey
document.querySelector("#submitFormBtn").onclick = function () {
  dbArray.length = 0;

  for (i = 0; i < nodeArray.length; i++) {
    var question_input = document.querySelector("#" + nodeArray[i].cardId + "_question_input");
    var question_score = document.querySelector("#" + nodeArray[i].cardId + "_question_score");
    
    if(question_input != null){
      nodeArray[i].question.input = question_input.value;
      if(question_score != null){
        nodeArray[i].question.score = question_score.value;
      }
    }
    
    if (nodeArray[i].lines.length > 0) {
      for (j = 0; j < nodeArray[i].lines.length; j++) {
        nodeArray[i].lines[j].input = document.querySelector("#" +nodeArray[i].cardId +"_" +nodeArray[i].lines[j].lineId +"_input").value;
        nodeArray[i].lines[j].score = document.querySelector("#" +nodeArray[i].cardId +"_" +nodeArray[i].lines[j].lineId +"_score").value;
      }
    }
  }


  let cardOrder = document.querySelectorAll(".questionCard");
  let orderedArray = [];
  cardOrder.forEach((card) => {
    for(i=0;i<nodeArray.length;i++){
      if(card.id === nodeArray[i].cardId){
        orderedArray.push(nodeArray[i]);
      }
    }
  });

  const contestId = window.location.href.split("/")[window.location.href.split("/").length-1];

  let tempLine = {
    contest_id:1,
    type:'',
    description:'',
    options: [],
    scores: [],
    order:1
  };

  nodeArray.forEach(card => {
    tempLine.contest_id = contestId;
    
    //TEXTO
    if (card.type == "Text"){
      tempLine.type = card.type;
      tempLine.description = card.question.input;
      tempLine.options.push(card.lines.input);
      tempLine.scores.push(card.question.score);
    }

    //MULTIPLA
    if (card.type == "Multi"){
      tempLine.type = card.type;
      tempLine.description = card.question.input;
      
      if(card.lines.length>0){
        card.lines.forEach(line => {
          tempLine.options.push(line.input);
          tempLine.scores.push(line.score);
        });
      }
    }

    //FICHEIRO
    if (card.type == "File"){
      tempLine.type = card.type;
      tempLine.description = card.question.input;
      tempLine.scores.push(card.question.score);
    }

    dbArray.push(tempLine);
    tempLine=cleanTempLine();
  });

  saveContent ('/insert_form_submeter','POST', dbArray, contestId)
};

//Function to send JSON survey to backEnd
function saveContent(sendPath, method, dataCtn, contestId) {

  fetch(sendPath,  {
    method: method, // or 'PUT'
    headers: {
      'Content-Type': 'application/json',
    },
    body:(JSON.stringify(dataCtn))   
  })
  .then(response => response.json())
  .then(data => {
    if(data.status == 400)
      alert("");
    else{ 
      window.location.href = `/formularios/${contestId}` 
    }
  })
  .catch((error) => {
    console.error('Error:', error);
  });

}

//Function to clean template
function cleanTempLine(){
  return {
    contest_id:1,
    type:'',
    description:'',
    options: [],
    scores: [],
    order:1
  };
}



