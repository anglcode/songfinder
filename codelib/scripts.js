    function songtake(filename){
    const input = document.getElementById('filename')
    input.addEventListener('change',function(event){
    const file2 = event.target.files[0];
    const read = new FileReader();
    read.onload = function(e){
    const json2 = JSON.parse(e.target.result);
    console.log(json2);
    return json2;
    };
    read.readAsText(file2);
});
    };