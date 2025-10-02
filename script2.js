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
                        algdecide(
                        sortbybpm(refrencesong,songlist),
                        sortbyart(refrencesong,songlist),
                        sortbygen(refrencesong,songlist),
                        songlist);
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
    sorted.forEach(song =>{
        console.log(`${song.title} (${song.bpm}bpm) - dif:${song.bpmdif}`)
    });
    return sorted;
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
    return sorted;
}

function sortbygen(ref,songs){
    const refgen = ref.genres;
    const sorted = songs.map(song =>({
       ...song,genmat: song.genres.filter((gen) => refgen.some(ref => gen.includes(ref))) 
    })).sort((a,b) => b.genmat.length - a.genmat.length);
    sorted.forEach(song => {
        console.log(`${song.title} (${song.genres}) - matches:${song.genmat}`);
    });
    return sorted;
}

function algdecide(bpmsort,artsort,gensort,songs){

    const combined = songs.map(song => {
        const bpmData = bpmsort.find(s => s.title === song.title);
        const artData = artsort.find(s => s.title === song.title);
        const genData = gensort.find(s => s.title === song.title);

        const score = (10 - bpmData.bpmdif) + (artData.artdif * 3) + (genData.genmat.length * 4);

        return {
            ...song,
            bpmdif: bpmData.bpmdif,
            artdif: artData.artdif,
            genmatchcount: genData.genmat,
            score
        };
    });
    const songhold = document.getElementById('songhold');
    const sorted = combined.sort((a, b) => b.score - a.score);
    sorted.forEach(song => {
    const titlepara = document.createElement('p');
      titlepara.textContent = `Title: ${song.title}, Score: ${song.score}`;
      songhold.appendChild(titlepara);
    })
}

