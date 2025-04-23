console.log("Just Rolling around")
let currentSong = new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
    currFolder=folder;
    let a = await fetch(`http://127.0.0.1:3000/${folder}/`)
    let response = await a.text(); 
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
       songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])

        }
    }
     let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
     songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML += `<li><img class="invert" src="music.svg" alt="">
            <div class="info">
                <div>${song.replaceAll("%20", " ").replaceAll(".mp3", " ")}</div>

                <div>Kaka</div>
            </div>
            <div class="playnow">
                <img src="play.svg" alt="" class="invert">
            </div> </li>`
            

    }
}
const playMusic = (track, pause = false)=>{
    currentSong.src = `/${currFolder}/` + track;
    if(!pause){

        currentSong.play();
        play.src="pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00/00:00"
     
Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
    e.addEventListener("click",element=>{
        playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim()+".mp3")
    })
})

}
async function displayAlbums(){
    let a = await fetch(`http://127.0.0.1:3000/songs/`)
    let response = await a.text(); 
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
   let array =  Array.from(anchors)
   for (let index = 0; index < array.length; index++) {
    const e = array[index];
        if(e.href.includes("/songs/")){
           let folder = e.href.split("/").slice(-2)[0]
           console.log(folder)
           //Get metadata of the folder
              let a = await fetch(`/songs/${folder}/info.json/`)
           let response = await a.json();
           console.log(response)
           cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
        <div class="play">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40">
                <circle cx="12" cy="12" r="12" fill="green" />
                <path d="M9.5 11.1998V12.8002C9.5 14.3195 9.5 15.0791 9.95576 15.3862C10.4115 15.6932 11.0348 15.3535 12.2815 14.6741L13.7497 13.8738C15.2499 13.0562 16 12.6474 16 12C16 11.3526 15.2499 10.9438 13.7497 10.1262L12.2815 9.32594C11.0348 8.6465 10.4115 8.30678 9.95576 8.61382C9.5 8.92086 9.5 9.6805 9.5 11.1998Z" fill="black" />
            </svg>
        </div>
        <img src="/songs/${folder}/cover.jpg" alt="Happy Hits cover image">
        <h2>${response.title}</h2>
        <p>${response.description}</p>
    </div>`
        }
    }
    // display albums when the card is clicked
       Array.from(document.getElementsByClassName("card")).forEach(e => { 
        e.addEventListener("click", async item => {
            console.log("Fetching Songs")
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)  
            playMusic(songs[0])

        })
    })
}

async function main() {
    //Getting the list of all songs

    await getSongs("songs/English")
    playMusic(songs[0], true)
    await displayAlbums()

    //Show all the songs in the playlists
  
 //Attach an event listener to play , next and previous
 play.addEventListener("click",()=>{
     if(currentSong.paused){
        currentSong.play()
        play.src="pause.svg"
     }
     else{
        currentSong.pause()
        play.src = "play.svg"
     }
 })
 //listen for time update event
 currentSong.addEventListener("timeupdate", ()=>{
    console.log(currentSong.currentTime, currentSong.duration)
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`
    document.querySelector(".circle").style.left = currentSong.currentTime/currentSong.duration*100 +"%";
 })
 // Add eventlistener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration)*percent)/100
    })
    //Add eventlistener for hamburger
    document.querySelector(".hamburgerContainer").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "0";
    })
    document.querySelector(".close").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "-120%";
    })
    // Adding eventlistener for previous and next button
    previous.addEventListener("click",()=>{
        // currentSong.pause()
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if((index-1)>=0){
            playMusic(songs[index-1])
        }     
    })
    next.addEventListener("click", ()=> {
        // currentSong.pause()
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if((index+1)<songs.length){
            playMusic(songs[index+1])
        }
    })
  //Add eventlistener to the volume
  document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
    console.log(e.target.value,"/100")
    currentSong.volume = parseInt(e.target.value)/100
  })

}

main()

