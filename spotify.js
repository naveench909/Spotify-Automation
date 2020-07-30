const puppeteer = require('puppeteer');
let fs = require("fs");
const BASE_URL = "https://accounts.spotify.com/en/login?continue=https:%2F%2Fopen.spotify.com%2F";
let cFile = process.argv[2];

const spotify = {
  intialization : async() =>{
    const browser = await puppeteer.launch({
      headless : false,
      defaultViewport : null,
      slowMo :10,
      args : ["--start-maximized"]
    })
    
    let pages = await browser.pages();
    page = pages[0];
  },
  login : async() => {
    try{
      await page.goto(BASE_URL , {waitUntil : 'networkidle2'});

      let credentialFile = await fs.promises.readFile(cFile);
      let {username , password} =  JSON.parse(credentialFile);
      
      await page.waitForSelector("#login-username");
      await page.type('input[name="username"]', username, { delay: 50 });
      await page.type('input[name="password"]', password, { delay: 50 });

      await Promise.all([
          page.click("#login-button", {delay : 50}),
          page.waitForNavigation({waitUntil : 'networkidle2'})
      ]);

  }catch(err){
      console.log(err);
  }
  },
  createPlaylist : async(name) =>{
    await page.waitForSelector(".Rootlist__content");
    await page.click(".Rootlist__content button[type=button]" , {delay : 100});
    sleep(1000);
    await page.waitForSelector(".inputBox-label");
    await page.type('input[type=text]', name , {delay : 100});
    await page.keyboard.press("Enter");
  },
  addSongToPlaylist : async(Songs, name) => {

    for(let i = 0 ; i < Songs.length ; i++){
    let song = Songs[i];
    await page.goto("https://open.spotify.com/search" , {waitUntil : 'networkidle2'});
    await page.waitForSelector(".b998bffaa6f474197b97196682643022-scss");
    await page.type('input[data-testid=search-input]' , song , {delay : 100});

    sleep(2000);

    let example = await page.$("._76bf0ea4fc6653c68b50ad9723c9a535-scss");
    await example.click({
      button: 'right',
    });

    var buttons = await page.$$('.react-contextmenu.react-contextmenu--visible .react-contextmenu-item');
    console.log(buttons.length);
    await buttons[3].click();
    
    sleep(2000);

    //here we get only Playlist text from the span tag of the playlist
    let allPlaylist = await page.$$(".c247a773eeb0d66dcd9c92d83e50c263-scss .GlueDropTarget .mo-info-name span");
    console.log(allPlaylist.length);

    let ourPlayListNumber;
    for(let i = 0 ; i < allPlaylist.length ; i++){
      const element = allPlaylist[i];
      const playlistText = await page.evaluate(element => element.textContent,element);
      if(playlistText.includes(name)){
        console.log(playlistText);
        ourPlayListNumber = i;
      }
    }
    
    // this is the actual playlist 
    let playlist = await page.$$(".c247a773eeb0d66dcd9c92d83e50c263-scss .cover-art.shadow.cover-art--with-auto-height");
    await playlist[ourPlayListNumber].click();

    }

    sleep(1000);
    await browser.close(); 
  }
}
function sleep(dur){
  var cur = Date.now();
  var limit = cur+dur;
  while(cur<limit){
      cur = Date.now();
  }
}
module.exports = spotify;