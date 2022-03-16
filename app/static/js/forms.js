//Function to onload data
window.onload = function() {
    let dataStr = document.getElementById('dataHidden').innerHTML;
    var data = JSON.parse(dataStr);

    data.forEach(element => {
      if(element.type=='Text'){
        newQuestion1(element)
      }else if(element.type == 'Multi'){
        newQuestion2(element)
      }else{
        newQuestion3(element)
      }
    });
      
}
