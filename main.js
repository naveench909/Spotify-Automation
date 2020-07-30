let sp = require("./spotify");
songs = ["Tera Ghata" , "Teri Mitti"];
playlistName = "Rap";

(async() =>{
    await sp.intialization();
    await sp.login();
    await sp.createPlaylist(playlistName);
    await sp.addSongToPlaylist(songs , playlistName);
})();