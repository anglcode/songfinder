function bestsong(tarsong, compsong){
    var songval;
    songval = songval + Math.abs(tarsong.bpm - compsong.bpm)*10;
    return songval;
};