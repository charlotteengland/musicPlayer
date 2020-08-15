import {songsList} from '../data/songs.js';
import PlayInfo from './play-info.js';
import TrackBar from './track-bar.js'

const Playlist = (_ => {
  //state
  let songs = songsList;
  let currentlyPlayingIndex = 0;
  let currentSong = new Audio(songs[currentlyPlayingIndex].url);
  //let isPlaying = false;

    currentSong.currentTime = 240;

  // cache the DOM
  const playlistEl = document.querySelector(".playlist");
  const thumbnailEl = document.querySelector("img").src;

  const init = _ => {
    render();
    listeners();
    PlayInfo.setState({
      songsLength: songs.length,
      isPlaying: !currentSong.paused
    })
  }
  const flip = _ => {
    togglePlayPause();
    render();
  }

  const changeAudioSrc = _ => {
    currentSong.src = songs[currentlyPlayingIndex].url;
  }

  const togglePlayPause = _ => {
    return currentSong.paused ? currentSong.play() : currentSong.pause();
  }
  const changePic = _ => {
    thumbnailEl.innerHTML = songs[currentlyPlayingIndex].img;
  }

  const mainPlay = clickedIndex => {
    if (currentlyPlayingIndex === clickedIndex) {
      // toggle to pause or play
      console.log("same");
      togglePlayPause();
    } else {
      console.log("new")
      currentlyPlayingIndex = clickedIndex;
      changeAudioSrc();
      togglePlayPause();
      changePic();
    }
    PlayInfo.setState({
      songsLength: songs.length,
      isPlaying: !currentSong.paused
    })
  }

  //EVENT LISTENERS 

  const listeners = _ => {
    playlistEl.addEventListener("click", event => {
      if(event.target && event.target.matches(".fa")) {
        const listElem = event.target.parentNode.parentNode;
        const listElemIndex = [...listElem.parentElement.children].indexOf(listElem);
        mainPlay(listElemIndex)
        render();
      }
    })
  }

  currentSong.addEventListener("timeupdate", _ => {
    TrackBar.setState(currentSong);
  })
 
  currentSong.addEventListener("ended", _ => {
    playNext();
  })

  const playNext = _ => {
    if (songs[currentlyPlayingIndex + 1]) {
      currentlyPlayingIndex++;
      currentSong.src = songs[currentlyPlayingIndex].url;
      togglePlayPause();
      // changeAudioSrc();
      render();
    }

  }



  const render = _ => {
    let markup = '';

    const toggleIcon = itemIndex => {
      if (currentlyPlayingIndex === itemIndex) {
        return currentSong.paused ? 'fa-play' : 'fa-pause';
      } else {
        return 'fa-play'
      }
    }

    songs.forEach((songObj, index) => {
      markup += `
      <li class="playlist__song ${index === currentlyPlayingIndex ? 'playlist__song--active' : ''}">
      <div class="play-pause">
        <i class="fa ${toggleIcon(index)} pp-icon"></i>
      </div>
      <div class="playlist__song-details">
        <span class="playlist__song-name">${songObj.title}</span>
        <br>
        <span class="playlist__song-artist">${songObj.artist}</span>
      </div>
      <div class="playlist__song-duration">${songObj.time}
      </div>
    </li>
    `;
    })

    playlistEl.innerHTML = markup;

  }

  return {

    init,
    flip
  }
})();

export default Playlist;