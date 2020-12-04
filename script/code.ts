songList.sort((a, b) => (a.name > b.name ? 1 : -1))

const loader: any = document.getElementById("loading"),
    headericon: any = document.querySelector('.header-icon'),
    searchinput: any = document.getElementById("search_input"),
    progress: any = document.querySelector('.progress_bar'),
    currentTime: any = document.querySelector('.current_time'),
    duration: any = document.querySelector('.total_duration'),
    progress_div: any = document.querySelector('.progress_div'),
    music: any = document.querySelector('audio'),
    musiccontainer: any = document.querySelector('.music_container'),
    prev: any = document.getElementById('prev'),
    play: any = document.getElementById('play'),
    next: any = document.getElementById('next'),
    volume: any = document.getElementById('volume'),
    title: any = document.getElementById('title'),
    artist: any = document.getElementById('artist'),
    img: any = document.querySelector('.music_img_change'),
    musiclist: any = document.querySelector('.music_list'),
    noresult: any = document.querySelector('.no_result'),
    shuffle: any = document.getElementById('shuffle'),
    repeat: any = document.getElementById('repeat'),
    compatibility: any = document.querySelector('.compatibility'),
    canvas: any = document.getElementById("cnv1");

let context: any, audioctx: any, analyser: any, oscillator, freqArr: any, barHeight: any, source, WIDTH: number, HEIGHT: number,
    bigBars = 0,
    INTERVAL = 128,
    SAMPLES = 2048,
    r = 0,
    g = 0,
    b = 255,
    x = 0,
    isPlay = false,
    ismute = false,
    songIndex = 0,
    volumeSlider: any = document.querySelector('.volume_slider'),
    tempslidervalue = volumeSlider.value,
    minValue = 1,
    lastRandom = 0,
    repeatCheck = false,
    shuffleCheck = false;

function displayLoader() {
    loader.style.display = 'none';
    loadSong(songList[songIndex]);
}

if (screen.width < 480 && screen.height < 480) {
    musiclist.classList.add('d-none');
    compatibility.classList.replace('d-none', 'd-flex');
    canvas.classList.add('d-none');
    musiccontainer.classList.replace('d-flex', 'd-none');
    compatibility.innerHTML = `<p>Sorry Your Device is not Epic to use Epic Player.</p>`
}

if (screen.width < 480 && screen.height >= 480) {
    musiclist.classList.add('d-none');
    compatibility.classList.replace('d-none', 'd-flex');
    canvas.classList.add('d-none');
    musiccontainer.classList.replace('d-flex', 'd-none');
    compatibility.innerHTML = `
    <p>
        <img src="src/screen_rotation-white-18dp.svg" alt="rotate" class="rotate_device"> Rotate you device and reload the page to use Epic Player.
    </p>
`
}

if (screen.width >= 480 || screen.height >= 480) {
    window.addEventListener('keydown', (e) => {
        (e.keyCode == 32 && e.target == document.body) ? e.preventDefault() : null;
    });

    document.body.onkeyup = (e) => {
        if (e.keyCode == 32) {
            event.stopPropagation();
            isPlay ? pausemusic() : playmusic(songIndex);
        }
        e.keyCode == 39 ? music.currentTime += 5 : e.keyCode == 37 ? music.currentTime -= 5 : e.keyCode == 77 ? MforMute() : '';
    };
}

musiclist.innerHTML = (songList.map((song, songIndex) => {
    return `
    <li class="music_list_item" songIndex="${songIndex}">
        <h3 id="song_index" class="col-1 offset-md-1">${songIndex + 1}.</h3>
        <div class="img_container_list col-1">
            <img src="./src/image/${song.album}.jpg">
        </div>
        <h1 class="col-3 offset-1 offset-md-0" id="title_list">${song.name}</h1>
        <h2 class="col-4 col-md-3" id="artist_list">${song.artist}</h2>
        <h3 class="col-2 text-truncate" title="${song.album}">${song.album}</h3>
    </li>
`;
}).join(""));

const musiclistitem = document.querySelectorAll(".music_list_item");

function search() {
    let txtValue,
        count = 0,
        search_result: HTMLInputElement,
        filter = searchinput.value.toUpperCase();

    musiclistitem.forEach((element: any) => {
        search_result = element.getElementsByTagName("h1")[0] as HTMLInputElement;
        txtValue = (element.getElementsByTagName("h1")[0]).innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            element.style.display = "";
            musiclist.style.display = "block";
            noresult.style.display = "none";
        } else {
            search_result = element.getElementsByTagName("h2")[0] as HTMLInputElement;
            txtValue = search_result.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                element.style.display = "";
                musiclist.style.display = "block";
                noresult.style.display = "none";
            } else {
                element.style.display = "none";
                count++;
                if (count == musiclistitem.length) {
                    musiclist.style.display = "none";
                    const noResultContent: any = document.querySelector('.no_result_txt');
                    noResultContent.innerText = '"' + searchinput.value + "\"";
                    noresult.style.display = "grid";
                }
            }
        }
    })
    event.stopPropagation();
}

function remove_all_active_list() {
    musiclistitem.forEach((element) => element.classList.remove("active_music"))
}

function repeatEvent() {
    if (repeatCheck) {
        repeat.classList.replace('fa-repeat-1-alt', 'fa-repeat');
        repeat.classList.remove('active_icon');
    } else {
        repeat.classList.replace('fa-repeat', 'fa-repeat-1-alt');
        repeat.classList.add('active_icon');
    }
    repeatCheck = !repeatCheck;
}

function shuffleEvent() {
    if (shuffleCheck) {
        shuffle.classList.remove('active_icon');
        shuffle.title = "Shuffle: On"
    } else {
        shuffle.classList.add('active_icon');
        shuffle.title = "Shuffle: Off"
    }
    shuffleCheck = !shuffleCheck;
}

function shuffleSong() {
    songIndex = Math.floor(Math.random() * ((songList.length - 1) - minValue + 1)) + minValue;
    while (lastRandom === songIndex) {
        songIndex = Math.floor(Math.random() * ((songList.length - 1) - minValue + 1)) + minValue;
    }
    loadSong(songList[songIndex]);
    playmusic(songIndex);
    musiclistitem[songIndex].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "nearest"
    });
    minValue = 0;
    lastRandom = songIndex;
}

function playmusic(e: any) {
    remove_all_active_list();
    audioctx.resume();
    musiclistitem[e].classList.add("active_music");
    isPlay = true;
    music.play();
    play.classList.replace('fa-play', 'fa-pause');
    play.title = "Pause";
}

function pausemusic() {
    isPlay = false;
    music.pause();
    play.classList.replace('fa-pause', 'fa-play');
    play.title = "Play";
}

function loadSong(songList: any) {
    title.textContent = songList.name;
    artist.textContent = songList.artist;
    artist.title = songList.artist;
    music.src = "src/music/" + songList.name + ".mp3";
    // music.src = songList.src;
    img.src = "src/image/" + songList.album + ".jpg";
    music.volume = (volumeSlider.value) / 100;
    musiclistitem[songIndex].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "nearest"
    });
}

function prevSong() {
    if (shuffleCheck) {
        shuffleSong();
    } else {
        songIndex = (songIndex - 1 + songList.length) % songList.length;
        remove_all_active_list();
        musiclistitem[songIndex].classList.add("active_music");
        loadSong(songList[songIndex]);
        playmusic(songIndex);
    }
}

function nextSong() {
    if (shuffleCheck) {
        shuffleSong();
    } else {
        songIndex = (songIndex + 1) % songList.length;
        remove_all_active_list();
        musiclistitem[songIndex].classList.add("active_music");
        loadSong(songList[songIndex]);
        playmusic(songIndex);
    }
}

function timeUpdate() {
    let position = music.currentTime / music.duration;
    progress.style.width = position * 100 + "%";
    convertTime(Math.round(music.currentTime));
    (music.ended && !repeatCheck && !shuffleCheck) ? nextSong() : (music.ended && !repeatCheck && shuffleCheck) ? shuffleSong() : (music.ended && repeatCheck && !shuffleCheck) ? playmusic(songIndex) : (music.ended && repeatCheck && shuffleCheck) ? playmusic(songIndex) : '';
}

function convertTime(seconds: number) {
    let min = Math.floor(seconds / 60);
    let sec: any = seconds % 60;
    sec = sec < 10 ? "0" + sec : sec;
    currentTime.textContent = min + ":" + sec;
    totalTime(Math.round(music.duration));
}

function totalTime(seconds: any) {
    let min = Math.floor(seconds / 60);
    let sec: any = seconds % 60;
    sec = sec < 10 ? "0" + sec : sec;
    music.duration ? duration.textContent = min + ":" + sec : '';
}

function progressBar(e: any) {
    let move_progress = (e.offsetX / e.srcElement.clientWidth) * music.duration;
    music.currentTime = move_progress;
}

function volumeCheck() {
    volumeSlider.style.background = 'linear-gradient(90deg, #1DB954 ' + volumeSlider.value + '%, #ddd 0)';
    (music.volume > 0.45) ? volumeup() : (music.volume <= 0.45 && music.volume > 0) ? volumelow() : volumedown();
}

function volumeChange() {
    music.volume = (volumeSlider.value) / 100;
    tempslidervalue = (volumeSlider.value) / 100;
    volumeCheck();
}

function MforMute() {
    if (music.volume != 0) {
        volumedown();
        volumeCheck();
    } else if (music.volume == 0) {
        volumeup();
        volumeCheck();
    }
}

function volumedown() {
    ismute = true;
    volume.classList.replace('fa-volume-down', 'fa-volume-mute');
    volume.classList.replace('fa-volume-up', 'fa-volume-mute');
    music.volume = 0;
    volumeSlider.value = 0;
    volume.title = "Unmute";
}

function volumelow() {
    volume.classList.replace('fa-volume-mute', 'fa-volume-down');
    volume.classList.replace('fa-volume-up', 'fa-volume-down');
    volume.title = "Mute";
}

function volumeup() {
    ismute = false;
    volume.classList.replace('fa-volume-down', 'fa-volume-up');
    volume.classList.replace('fa-volume-mute', 'fa-volume-up');
    volumeSlider.value = tempslidervalue * 100;
    music.volume = (volumeSlider.value) / 100;
    volume.title = "Mute";
}

volumeSlider.style.background = 'linear-gradient(90deg, #1DB954 ' + volumeSlider.value + '%, #ddd 0)';

window.addEventListener('load', () => {
    context = canvas.getContext("2d");
    audioctx = new AudioContext();
    WIDTH = window.innerWidth - 50;
    canvas.width = WIDTH;
    HEIGHT = 500;
    canvas.height = 500;
    analyser = audioctx.createAnalyser();
    analyser.fftSize = SAMPLES;
    oscillator = audioctx.createOscillator();
    oscillator.connect(audioctx.destination);
    source = audioctx.createMediaElementSource(music);
    source.connect(analyser);
    source.connect(audioctx.destination);
    freqArr = new Uint8Array(analyser.frequencyBinCount);
    barHeight = HEIGHT;
    window.requestAnimationFrame(draw);
});

function draw() {
    if (!music.paused) {
        bigBars = 0;
        r = 0;
        g = 0;
        b = 255;
        x = 0;
        context.clearRect(0, 0, WIDTH, HEIGHT);
        analyser.getByteFrequencyData(freqArr);
        for (var i = 0; i < INTERVAL; i++) {
            if (barHeight >= (240)) {
                bigBars++;
            }
            let num = i;
            barHeight = ((freqArr[num] - 128) * 3) + 2;
            if (barHeight <= 1) {
                barHeight = 2;
            }
            r = r + 10;
            if (r > 255) {
                r = 255;
            }
            g = g + 1;
            if (g > 255) {
                g = 255;
            }
            b = b - 2;
            if (b < 0) {
                b = 0;
            }
            context.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
            context.fillRect(x, HEIGHT - barHeight, (WIDTH / INTERVAL) - 1, barHeight);
            x = x + (WIDTH / INTERVAL);
        }
    }
    window.requestAnimationFrame(draw);
}

window.addEventListener('load', displayLoader);

searchinput.addEventListener('keyup', search);
searchinput.addEventListener('input', (e: any) => {
    if (!e.inputType && searchinput.value === '') {
        searchinput.value = null;
        search();
    }
});

musiclistitem.forEach((element, index) => {
    element.addEventListener("click", () => {
        remove_all_active_list();
        loadSong(songList[index]);
        playmusic(index);
        musiclistitem[index].classList.add("active_music");
        songIndex = index;
        searchinput.value = null;
        search();
    })
})

repeat.addEventListener('click', repeatEvent)
shuffle.addEventListener('click', shuffleEvent);

play.addEventListener('click', () => isPlay ? pausemusic() : playmusic(songIndex));
prev.addEventListener('click', prevSong);
next.addEventListener('click', nextSong);

headericon.addEventListener('click', () => (!isPlay) && playmusic(songIndex));

music.addEventListener("timeupdate", timeUpdate);

progress_div.addEventListener('click', progressBar);
progress_div.addEventListener("wheel", (e: any) => Math.sign(e.deltaY) < 0 ? music.currentTime += 5 : music.currentTime -= 5);

volumeSlider.addEventListener('change', volumeChange);
volumeSlider.addEventListener('mousemove', volumeChange);
volumeSlider.addEventListener('keyup', (e: any) => {
    event.stopPropagation();
    e.keyCode == 77 ? MforMute() : '';
});
volumeSlider.addEventListener('input',()=>volumeSlider.style.background = 'linear-gradient(90deg, #1DB954 ' + volumeSlider.value + '%, #ddd 0)');

volume.addEventListener('click', () => {
    ismute ? volumeup() : volumedown();
    volumeCheck();
});