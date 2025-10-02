document.addEventListener('DOMContentLoaded',() =>{
   const input = document.getElementById('fileInput');
   input.addEventListener('change',function(event){
    const files = Array.from(event.target.files);
    let refrencesong = null;
    let songlist = [];
    let filesread =0;
    files.forEach(file =>{
        const reader = new FileReader();
        reader.onload = function(e){
            try{
                const data = JSON.parse(e.target.result);
                if(Array.isArray(data)){
                    songlist = data;
                }else{
                    refrencesong = data;
                    }
                
            }catch (err){
                console.error(`error parsing ${file.name}:`,err);
            } finally{
                filesread++;
                if(filesread==files.length){
                    if(refrencesong && songlist.length>0){
                        sortbybpm(refrencesong,songlist);
                        sortbyart(refrencesong,songlist);
                        sortbygen(refrencesong,songlist);
                    }else{
                        console.error("missing refsong or list");
                    }
                }
            }
            
        };
        reader.readAsText(file);
    });
   });

});


function sortbybpm(ref,songs){
    const refbpm = ref.bpm;
    const sorted = songs.map(song => ({
        ...song,bpmdif: Math.abs(song.bpm - refbpm)
    })).sort((a,b)=> a.bpmdif - b.bpmdif);
    console.log(`Targetsong: ${ref.title}(${refbpm})`);
    console.log("Songs Sorted by BPM Difference");
    const songhold = document.getElementById('songhold');
    sorted.forEach(song =>{
        console.log(`${song.title} (${song.bpm}bpm) - dif:${song.bpmdif}`)
        const paratext = document.createElement('p');
        paratext.textContent = `${song.title} (${song.bpm}bpm) - dif:${song.bpmdif}`;
        songhold.appendChild(paratext);
    });
}

function sortbyart(ref,songs){
    const refart = ref.artist;
    const sorted = songs.map(song => ({
    ...song,artdif: song.artist == refart ? true:false
    })).sort((a,b) => b.artdif - a.artdif);
    console.log(`Target Artist ${refart}`);
    console.log(`Sorted by Artist Match`);
    sorted.forEach(song =>{
        console.log(`${song.title} (${song.artist}) - target:${song.artdif}`);
    });
}

function sortbygen(ref,songs){
    const refgen = ref.genres;
    const sorted = songs.map(song =>({
       ...song,genmat: song.genres.filter((gen) => refgen.some(ref => gen.includes(ref))) 
    })).sort((a,b) => b.genmat.length - a.genmat.length);
    sorted.forEach(song => {
        console.log(`${song.title} (${song.genres}) - matches:${song.genmat}`);
    });
}