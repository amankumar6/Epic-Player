const loader = document.getElementById("loading"),
    headericon = document.querySelector('.header-icon'),
    searchinput = document.getElementById("search_input"),
    progress = document.querySelector('.progress_bar'),
    currentTime = document.querySelector('.current_time'),
    duration = document.querySelector('.total_duration'),
    progress_div = document.querySelector('.progress_div'),
    music = document.querySelector('audio'),
    musiccontainer = document.querySelector('.music_container'),
    prev = document.getElementById('prev'),
    play = document.getElementById('play'),
    next = document.getElementById('next'),
    volume = document.getElementById('volume'),
    title = document.getElementById('title'),
    artist = document.getElementById('artist'),
    img = document.querySelector('.music_img_change'),
    musiclist = document.querySelector('.music_list'),
    noresult = document.querySelector('.no_result'),
    shuffle = document.getElementById('shuffle'),
    repeat = document.getElementById('repeat'),
    compatibility = document.querySelector('.compatibility'),
    canvas = document.getElementById("cnv1");

const songList = [{
        name: "Alone",
        artist: "Alan Walker",
        album: "Different World",
        src: "https://res.cloudinary.com/dbvthtwhc/video/upload/v1602525882/songs/Alone_th1k4z.mp3",
    },
    {
        name: "Capital Letters",
        artist: "Hailee Steinfeld",
        album: "Fifty Shades Freed",
        src: "https://res.cloudinary.com/dbvthtwhc/video/upload/v1602525920/songs/Capital_Letters_qundte.mp3",
    },
    {
        name: "Closer",
        artist: "The Chainsmokers",
        album: "Closer",
        src: "https://res.cloudinary.com/dbvthtwhc/video/upload/v1602525886/songs/Closer_hhlj2l.mp3",
    },
    {
        name: "Counting Stars",
        artist: "One Republic",
        album: "Native",
        src: "https://res.cloudinary.com/dbvthtwhc/video/upload/v1602525935/songs/Counting_Stars_igwwjn.mp3",
    },
    {
        name: "Demons",
        artist: "Imagine Dragons",
        album: "Night Visions",
        src: "https://res.cloudinary.com/dbvthtwhc/video/upload/v1602525901/songs/Demons_dhkcpy.mp3",
    },
    {
        name: "Different World",
        artist: "Alan Walker ft. Sofia Carson",
        album: "Different World",
        src: "https://res.cloudinary.com/dbvthtwhc/video/upload/v1602525893/songs/Different_World_wggzgn.mp3",
    },
    {
        name: "Dusk Till Dawn",
        artist: "Zayn ft. Sia",
        album: "Dusk Till Dawn",
        src: "https://res.cloudinary.com/dbvthtwhc/video/upload/v1602525911/songs/Dusk_Till_Dawn_a1von7.mp3",
    },
    {
        name: "Liar",
        artist: "Camila Cabello",
        album: "Liar",
        src: "https://res.cloudinary.com/dbvthtwhc/video/upload/v1602525938/songs/Liar_p11jmg.mp3",
    },
    {
        name: "No Control",
        artist: "One direction",
        album: "Four",
        src: "https://res.cloudinary.com/dbvthtwhc/video/upload/v1602525922/songs/No_Control_x8spag.mp3",
    },
    {
        name: "One Last Time",
        artist: "Ariana Grande",
        album: "My Everything",
        src: "https://res.cloudinary.com/dbvthtwhc/video/upload/v1602525943/songs/One_Last_Time_lmefxa.mp3",
    },
    {
        name: "This Feeling",
        artist: "The Chainsmokers ft. Kelsea Ballerini",
        album: "Sick Boy",
        src: "https://res.cloudinary.com/dbvthtwhc/video/upload/v1602525946/songs/This_Feeling_czqgi2.mp3",
    },
    {
        name: "Connection",
        artist: "One Republic",
        album: "Connection",
        src: "https://res.cloudinary.com/dbvthtwhc/video/upload/v1602525885/songs/Connection_zd2jyn.mp3",
    },
    {
        name: "Heathens",
        artist: "21 Pilots",
        album: "Heathens",
        src: "https://res.cloudinary.com/dbvthtwhc/video/upload/v1602525937/songs/Heathens_phva6n.mp3",
    },
    {
        name: "Starboy",
        artist: "Starboy ft. Daft Punk",
        album: "Starboy",
        src: "https://res.cloudinary.com/dbvthtwhc/video/upload/v1602525945/songs/Starboy_akxoay.mp3",
    },
    {
        name: "The Monster",
        artist: "Eminem ft. Rihanna",
        album: "The Marshall Mathers LP2",
        src: "https://res.cloudinary.com/dbvthtwhc/video/upload/v1602526066/songs/The_Monster_gefhc6.mp3",
    },
    {
        name: "Clarity",
        artist: "Zedd ft. Foxes",
        album: "Clarity",
        src: "https://res.cloudinary.com/dbvthtwhc/video/upload/v1602525894/songs/Clarity_hpmhgp.mp3",
    },
];

let context, audioctx, analyser, oscillator, freqArr, barHeight, source, WIDTH, HEIGHT,
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
    volumeSlider = document.querySelector('.volume_slider'),
    tempslidervalue = volumeSlider.value,
    before_loadtime = new Date().getTime(),
    minValue = 1,
    lastRandom = 0,
    repeatCheck = false,
    shuffleCheck = false;

console.log('code starts here');

console.log("screen width:", screen.width);
console.log("screen height:", screen.height);

if (screen.width <= 480 && screen.height <= 480) {
    musiclist.classList.add('d-none');
    compatibility.classList.replace('d-none', 'd-flex');
    canvas.classList.add('d-none');
    musiccontainer.classList.replace('d-flex', 'd-none');
    compatibility.innerHTML = ` 
        <p>
            Sorry Your Device is not Epic to use Epic Player.
        </p>
    `
}

if (screen.width <= 480 && screen.height >= 480) {
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

window.addEventListener('load', () => {
    console.log('WINDOW LOADS')
    console.log('loader start')
    let after_loadtime = new Date().getTime();
    let page_loadtime = (after_loadtime - before_loadtime) / 1000;
    if (page_loadtime >= 3) {
        loader.style.display = 'none';
    } else {
        setTimeout(() => {
            loader.style.display = 'none';
        }, 000);
    }
    loadSong(songList[songIndex]);
    console.log('loader completed')
});

if (screen.width > 480 || screen.height > 480) {
    window.addEventListener('keydown', function (e) { 
        console.log('preventDefault space start');
        if (e.keyCode == 32 && e.target == document.body) {
            e.preventDefault();
            console.log('preventDefault Space done');
        }
        console.log('preventDefault space completed');
    });

    document.body.onkeyup = function (e) {
        console.log('window onkeyup start');
        if (e.keyCode == 32) {
            if (isPlay) {
                event.stopPropagation();
                pausemusic();
                console.log('window onkeyup = space used for pause');
            } else {
                event.stopPropagation();
                playmusic(songIndex);
                console.log('window onkeyup = space used for play');
            }
        } else if (e.keyCode == 39) {
            if (isPlay) {
                music.currentTime += 5;
                console.log('window onkeyup = +5sec');
            } else {
                music.currentTime += 5;
                console.log('window onkeyup = +5sec');
            }
        } else if (e.keyCode == 37) {
            if (isPlay) {
                music.currentTime -= 5;
                console.log('window onkeyup = -5sec');
            } else {
                music.currentTime -= 5;
                console.log('window onkeyup = -5sec');
            }
        }
        console.log('window onkeyup start');
    };
}

musiclist.innerHTML = (songList.map(function (song, songIndex) {
    return `
        <li class="music_list_item" songIndex="${songIndex}">
            <h3 id="song_index" class="col-1 offset-md-1">
                ${songIndex+1}.
            </h3>
            <div class="img_container_list col-1">
				<img src="./src/image/${song.name}.jpg">
			</div>
			<h1 class="col-3 offset-1 offset-md-0" id="title_list">${song.name}</h1>
            <h2 class="col-4 col-md-3" id="artist_list">${song.artist}</h2>
            <h3 class="col-2 text-truncate" title="${song.album}">${song.album}</h3>
		</li>
	`;
}).join(""));

const musiclistitem = document.querySelectorAll(".music_list_item");

searchinput.addEventListener('keyup', () => {
    search();
});

function search() {
    let txtValue;
    let count = 0;
    let filter = searchinput.value.toUpperCase();
    for (let i = 0; i < musiclistitem.length; i++) {
        search_result = musiclistitem[i].getElementsByTagName("h1")[0];
        txtValue = search_result.textContent || search_result.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            musiclistitem[i].style.display = "";
            musiclist.style.display = "block";
            noresult.style.display = "none";
        } else {
            musiclistitem[i].style.display = "none";
            count++;
            if (count == musiclistitem.length) {
                musiclist.style.display = "none";
                document.querySelector('.no_result_txt').innerText = "\"" + searchinput.value + "\"";
                noresult.style.display = "grid";
            }
        }
    };
    event.stopPropagation();
}

searchinput.addEventListener('input', (e) => {
    if (!e.inputType && searchinput.value === '') {
        searchinput.value = null;
        search();
    }
});

for (let i = 0; i < musiclistitem.length; i++) {
    musiclistitem[i].addEventListener("click", function () {
        console.log('musiclistitem Listener start');
        remove_all_active_list();
        loadSong(songList[i]);
        playmusic(i);
        musiclistitem[i].classList.add("active_music");
        songIndex = i;
        searchinput.value = null;
        search();
        console.log('musiclistitem Listener completed');
    });
};

function remove_all_active_list() {
    for (let i = 0; i < musiclistitem.length; i++) {
        musiclistitem[i].classList.remove("active_music");
        console.log('remove_all_active_list done');
    };
};

repeat.addEventListener('click', () => {
    if (repeatCheck) {
        repeat.classList.replace('fa-repeat-1-alt', 'fa-repeat');
        repeat.classList.remove('active_icon');
    } else {
        repeat.classList.replace('fa-repeat', 'fa-repeat-1-alt');
        repeat.classList.add('active_icon');
    }
    repeatCheck = !repeatCheck;
})

shuffle.addEventListener('click', () => {
    if (shuffleCheck) {
        shuffle.classList.remove('active_icon');
        shuffle.title = "Shuffle: On"
    } else {
        shuffle.classList.add('active_icon');
        shuffle.title = "Shuffle: Off"
    }
    shuffleCheck = !shuffleCheck;
});

function shuffleSong() {
    console.log('shuffle start');
    songIndex = Math.floor(Math.random() * ((songList.length - 1) - minValue + 1)) + minValue;
    while (lastRandom === songIndex) {
        songIndex = Math.floor(Math.random() * ((songList.length - 1) - minValue + 1)) + minValue;
    }
    console.log(songIndex, "shuffle song index");
    loadSong(songList[songIndex]);
    playmusic(songIndex);
    musiclistitem[songIndex].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "nearest"
    });
    minValue = 0;
    lastRandom = songIndex;
    console.log('shuffle completed');
}

const playmusic = (e) => {
    console.log('playmusic start');
    remove_all_active_list();
    audioctx.resume();
    musiclistitem[e].classList.add("active_music");
    isPlay = true;
    music.play();
    play.classList.replace('fa-play', 'fa-pause');
    play.title = "Pause";
    console.log('playmusic compelete');
};

const pausemusic = () => {
    console.log('pause start');
    isPlay = false;
    music.pause();
    play.classList.replace('fa-pause', 'fa-play');
    play.title = "Play";
    console.log('pause compelete');
};

play.addEventListener('click', () => {
    console.log('playpausemusic on click start');
    isPlay ? pausemusic() : playmusic(songIndex);
    console.log('playpausemusic on click compelete');
});

headericon.addEventListener('click', () => {
    console.log('playmusic head on click start');
    if (!isPlay) {
        playmusic(songIndex);
        console.log('playmusic head on click done');
    }
    console.log('playmusic head on click complete');
});

const loadSong = (songList) => {
    console.log('loadsong start');
    title.textContent = songList.name;
    artist.textContent = songList.artist;
    artist.title = songList.artist;
    music.src = "src/music/" + songList.name + ".mp3";
    //music.src = songList.src;
    img.src = "src/image/" + songList.name + ".jpg";
    music.volume = (volumeSlider.value) / 100;
    console.log('loadsong compelete');
};

const prevSong = () => {
    console.log('prevsong button start');
    if (shuffleCheck) {
        shuffleSong();
    } else {
        songIndex = (songIndex - 1 + songList.length) % songList.length;
        remove_all_active_list();
        musiclistitem[songIndex].classList.add("active_music");
        musiclistitem[songIndex].scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "nearest"
        });
        loadSong(songList[songIndex]);
        playmusic(songIndex);
    }
    console.log('prevsong button compelete');
};

const nextSong = () => {
    console.log('nextsong button start');
    if (shuffleCheck) {
        shuffleSong();
    } else {
        songIndex = (songIndex + 1) % songList.length;
        remove_all_active_list();
        musiclistitem[songIndex].classList.add("active_music");
        musiclistitem[songIndex].scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "nearest"
        });
        loadSong(songList[songIndex]);
        playmusic(songIndex);
    }
    console.log('nextsong button compelete');
};

prev.addEventListener('click', prevSong);
next.addEventListener('click', nextSong);

music.addEventListener("timeupdate", () => {
    let position = music.currentTime / music.duration;
    progress.style.width = position * 100 + "%";
    convertTime(Math.round(music.currentTime));
    if (music.ended && !repeatCheck && !shuffleCheck) {
        nextSong();
        console.log('music ended nextsong done');
    }
    if (music.ended && repeatCheck && shuffleCheck) {
        playmusic(songIndex);
        console.log('music ended and shuffle was on but repeat was on so nextsong was not done');
    }
    if (music.ended && repeatCheck && !shuffleCheck) {
        playmusic(songIndex);
        console.log('music ended but repeat was on so nextsong was not done');
    }
    if (music.ended && !repeatCheck && shuffleCheck) {
        shuffleSong();
    }
});

function convertTime(seconds) {
    let min = Math.floor(seconds / 60);
    let sec = seconds % 60;
    sec = sec < 10 ? "0" + sec : sec;
    currentTime.textContent = min + ":" + sec;
    totalTime(Math.round(music.duration));
};

function totalTime(seconds) {
    let min = Math.floor(seconds / 60);
    let sec = seconds % 60;
    sec = sec < 10 ? "0" + sec : sec;
    if (music.duration) {
        duration.textContent = min + ":" + sec;
    }
};

progress_div.addEventListener('click', (event) => {
    console.log('proggress start');
    let move_progress = (event.offsetX / event.srcElement.clientWidth) * music.duration;
    console.log(move_progress, "slider value")
    music.currentTime = move_progress;
    console.log('proggress compelete');
});

progress_div.addEventListener("wheel", function (e) {
    let dir = Math.sign(e.deltaY);
    if (dir < 0) {
        music.currentTime += 5;
    }
    if (dir > 0) {
        music.currentTime -= 5;
    }
    console.log(dir);
});

function volumecheck() {
    volumeSlider.style.background = 'linear-gradient(90deg, #1DB954 ' + volumeSlider.value + '%, #ddd 0)';
    if (music.volume > 0.45) {
        volumeup();
    }
    if (music.volume == 0) {
        volumedown();
    }
    if (music.volume <= 0.45 && music.volume > 0) {
        volumelow();
    }
};

volumeSlider.addEventListener('change', () => {
    console.log('volumeSlider start');
    music.volume = (volumeSlider.value) / 100;
    tempslidervalue = (volumeSlider.value) / 100;
    volumecheck();
    console.log('volumeSlider compelete', volumeSlider.value / 100);
});

volumeSlider.addEventListener('keyup', function (e) {
    event.stopPropagation();
});

const volumedown = () => {
    console.log('volumeDown start');
    ismute = true;
    volume.classList.replace('fa-volume-down', 'fa-volume-mute');
    volume.classList.replace('fa-volume-up', 'fa-volume-mute');
    music.volume = 0;
    volumeSlider.value = 0;
    volume.title = "Unmute";
    console.log('volumeDown compelete');
};

const volumelow = () => {
    console.log('volumeLOW start');
    volume.classList.replace('fa-volume-mute', 'fa-volume-down');
    volume.classList.replace('fa-volume-up', 'fa-volume-down');
    volume.title = "Mute";
    console.log('volumeLOw compelete');
};

const volumeup = () => {
    console.log('volumeUP start');
    ismute = false;
    volume.classList.replace('fa-volume-down', 'fa-volume-up');
    volume.classList.replace('fa-volume-mute', 'fa-volume-up');
    volumeSlider.value = tempslidervalue * 100;
    music.volume = (volumeSlider.value) / 100;
    volume.title = "Mute";
    console.log('volumeUP compelete');
};

volume.addEventListener('click', () => {
    ismute ? volumeup() : volumedown();
    volumecheck();
});

volumeSlider.style.background = 'linear-gradient(90deg, #1DB954 ' + volumeSlider.value + '%, #ddd 0)';

volumeSlider.oninput = function () {
    volumeSlider.style.background = 'linear-gradient(90deg, #1DB954 ' + volumeSlider.value + '%, #ddd 0)';
}

window.addEventListener('load', () => {
    console.log('vusializer start')
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
    console.log('vusializer compelete')
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