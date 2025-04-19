console.log("Just Rolling around")
let currentSong = new Audio();
let songs;
let currfolder;

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

async function getSongs() {
    let a = await fetch("/songs/")
    let response = await a.text();
    console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
     songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/songs/`)[1])

        }
    }
    return songs
}
const playMusic = (track, pause = false)=>{
    currentSong.src = "/songs/" + track;
    if(!pause){

        currentSong.play();
        play.src="pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:0000:00"
    console.log("Now playing:", currentSong.src);

}

async function main() {
    //Getting the list of all songs

    let songs = await getSongs()
    playMusic(songs[0], true)

    //Show all the songs in the playlists
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
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
Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
    e.addEventListener("click",element=>{
        playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
    })
})
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
        if((index+1)<songs.length-1){
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

