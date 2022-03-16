let formArray = []
window.onload = function() {
  let dataStr = document.getElementById('dataHidden').innerHTML;
  var data = JSON.parse(dataStr);
  formArray = data;
  data.forEach(element => {
    if(element.type=='Text'){
      respSimpQst(element)
    }else if(element.type == 'Multi'){
      respMulQst(element)
    }else{
      respFileQst(element)
    }
  });     
}


const respArray = [];

let responseId = "";
let flag = false;


//Response single question
function respSimpQst(ContestQuestion) {
const temp = {  respId: "", response: { resInput: ""}, lines: []};
 if (respArray.length > 0) {
      for (let i = 0; i < respArray.length; i++) {
          if (respArray[i].respId == "") {
          respArray[i].respId = "resp" + i;
          respArray[i].lines = [];
          respArray[i].response.resInput = "";
        responseId = respArray[i].respId;
          break;
        }
      }    
      if (flag == false) {
        responseId = "resp" + respArray.length;
        temp.respId = responseId;
        temp.response.resInput = "";
        temp.lines = [];
        respArray.push(temp);
      }
    } else {
      temp.respId = "resp0";
      temp.lines = [];
      temp.response.resInput = "";
      respArray.push(temp);
      responseId = respArray[0].respId;
    }

  const para = document.getElementById("container");
  const nodeResponse = document.createElement("div");
  nodeResponse.id = responseId;
  nodeResponse.classList.add("respQuestion");
  nodeResponse.innerHTML =
    `<br>       
    <div class="card w-26">
      <div class="card-body" id="` +responseId + `">
        <div class="row">
          <div class="col-md-10 mb-3 ">
            <div>
              <h3> `+ ContestQuestion.description +` </h3>
              <input type="hidden" id="idQst" value="`+ ContestQuestion.id +`">
              <input type="hidden" id='score' value="`+ ContestQuestion.scores +`">
            </div>  
            <br>
            <div>
              <input id="` + responseId +"_response_input" +`"class="form-control input-lg" id="inputlg" type="text" placeholder="Responda aqui por favor" required>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  para.appendChild(nodeResponse);
};

//Response multi question
function respMulQst(ContestQuestion) {
const temp = {  respId: "", response: { resInput: ""}, lines: []};
if (respArray.length > 0) {
  for (let i = 0; i < respArray.length; i++) {
      if (respArray[i].respId == "") {
      respArray[i].respId = "resp" + i;
      respArray[i].lines = [];
      respArray[i].response.resInput = "";
    responseId = respArray[i].respId;
      break;
    }
  }    
  if (flag == false) {
      responseId = "resp" + respArray.length;
    temp.respId = responseId;
    temp.response.resInput = "";
    temp.lines = [];
    respArray.push(temp);
  }
} else {
  temp.respId = "resp0";
  temp.lines = [];
  temp.response.resInput = "";
  respArray.push(temp);
  responseId = respArray[0].respId;
}
  const para = document.getElementById("container");
  const nodeResponse = document.createElement("div");
  nodeResponse.id = responseId;
  nodeResponse.classList.add("respQuestion");
  nodeResponse.innerHTML =
  `<br>       
  <div class="card w-26">
    <div class="card-body" id="` + responseId + `>
      <div class="row">
        <div class="col-md-10 mb-3 ">
          <div>
            <h3> `+ ContestQuestion.description +` </h3>
          </div>  
          <br>                              
          <div>
            <div id='multi-requirements' class="multi-list-group-item">
              <div class="container"  id="multi">
                `+addlinesMulti(responseId,ContestQuestion.options,ContestQuestion.scores)+`
              </div>
            </div>
        </div>
      </div>
    </div>
  </div>
`;
  para.appendChild(nodeResponse);
};

//Add options to multi question
function addlinesMulti(cardId, options, scores){
  let rtrnStr = '';
  if(options.length>0 && scores.length>0){
    for(let i=0;i<options.length;i++){
      lineId = "line" + i;
      idRadio = cardId + "_" + lineId
      rtrnStr += 
      `<div class="row">
        <input class="form-check-input" type="radio" name="`+i+`" id="`+ idRadio + `" value="`+scores[i]+`" onclick="checkedRadio(`+ idRadio + `)"/>
          `+options[i]+`
      </div>`;
    }
  }
  return rtrnStr;
}

//Checked button radio
function checkedRadio(selectedInput){
  let cardId = selectedInput.id.split('_');
  let Id = cardId[0].slice(4);
  let options = formArray[Id].options;
  for(let i = 0;i<options.length;i++){
    if(i!=selectedInput.name){
      let idInput = '#'+ cardId[0] + '_line' + i;
      document.querySelector(idInput).checked=false;
    }
  }
}

//Card to Input File 
function respFileQst(ContestQuestion) {
  const temp = {  respId: "", response: { resInput: ""}, lines: []};
  if (respArray.length > 0) {
        for (let i = 0; i < respArray.length; i++) {
            if (respArray[i].respId == "") {
            respArray[i].respId = "resp" + i;
            respArray[i].lines = [];
            respArray[i].response.resInput = "";
          responseId = respArray[i].respId;
            break;
          }
        }    
        if (flag == false) {
            responseId = "resp" + respArray.length;
          temp.respId = responseId;
          temp.response.resInput = "";
          temp.lines = [];
          respArray.push(temp);
        }
      } else {
        temp.respId = "resp0";
        temp.lines = [];
        temp.response.resInput = "";
        respArray.push(temp);
        responseId = respArray[0].respId;
      }
          
    const para = document.getElementById("container");
    const nodeResponse = document.createElement("div");
    nodeResponse.id = responseId;
    nodeResponse.classList.add("respQuestion");
    nodeResponse.innerHTML =
    `<br>    
    <div class="card w-26">
      <div class="card-body" id="` +responseId + `">         
        <div class="wrapperfile">
        <div class="row">
        <h3> `+ ContestQuestion.description +` </h3>
        </div>
        <input type="hidden" id='fileScore' value="`+ ContestQuestion.scores +`">
          <form id="formfile">
            <input class="file-input" type="file" name="file" hidden>
              <i class="fas fa-cloud-upload-alt"></i>
              <p>Inserir ficheiro</p>
          </form>
          <section class="progress-area"></section>
          <section class="uploaded-area"></section>           
        </div>  
      </div>
    </div>   
  `;
  para.appendChild(nodeResponse);

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
          let splitName = fileName.split('.');
          fileName = splitName[0].substring(0, 13) + "... ." + splitName[1];
        }
        uploadFile(fileName);
      }
    }

  function uploadFile(name) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/uploadfile", true);
    xhr.upload.addEventListener("progress", ({ loaded, total }) => {
      let fileLoaded = Math.floor((loaded / total) * 100);
      let fileTotal = Math.floor(total / 1000);
      let fileSize;
      (fileTotal < 1024) ? fileSize = fileTotal + " KB" : fileSize = (loaded / (1024 * 1024)).toFixed(2) + " MB";
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
}

//Create UUID number to associate in file name
function createUUID() {
   return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
   });
}

//Save function into DB
const respDbArray = [];
document.querySelector("#saveFormBtn").onclick = function () {
  let respDbArray=[];
  let userId = document.querySelector("#idUser").textContent.slice(14);
  const contestId = window.location.href.split("/")[window.location.href.split("/").length-1];

  for(let i = 0;i<formArray.length;i++){
    let tempResp={};
    let tempstr = '#resp'+i+'_line0';
    //document.querySelectorAll(".card-body")[1].querySelectorAll("#resp1_line0")
      tempResp.contest_id = contestId;    
      tempResp.user_id = userId;
      tempResp.question_id = i;
      tempResp.option = null,
      tempResp.validated = null
      tempResp.juri_id = null
    if(document.querySelectorAll(".card-body")[i].querySelectorAll(tempstr).length>0){
      if(document.querySelector("input:checked")!=undefined){
        tempResp.text = document.querySelector("input:checked").name
        tempResp.score = document.querySelector("input:checked").value
      }else{
        tempResp.option = null
        tempResp.score = 0
      }
    }else{
      if(document.querySelector('#resp' + i + "_response_input")!=undefined){
        tempResp.text = (document.querySelector('#resp' + i + "_response_input").value!=undefined)?document.querySelector('#resp' + i + "_response_input").value:null;
        tempResp.score = formArray[i].scores[0];
      }else{
        var fileInp = document.querySelector(".file-input");
        tempResp.text = fileInp.files[0].name;
        tempResp.score = document.querySelector("#fileScore").value;
      }
    }
    respDbArray.push(tempResp);
  }
  saveResponse ('/respondForm_submeter','POST', respDbArray)
}

//Fecth function
function saveResponse(sendPath, method, dataCtn) {
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
      window.location.href = `/concursos` 
    }
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}

//Clean template function
function cleanTempLine(){
  return {
    user_id: null,
    contest_id: null,
    question_id: null,
    text: null,
    option: null,
    score: null,
    validated: null,
    juri_id: null,
  }
}

