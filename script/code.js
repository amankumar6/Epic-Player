const loader = document.getElementById("loading");
const headericon = document.querySelector('.header-icon');
const progress = document.querySelector('.progress_bar');
const currentTime = document.querySelector('.current_time');
const duration = document.querySelector('.total_duration');
const progress_div = document.querySelector('.progress_div');
const music = document.querySelector('audio');
const shadow = document.querySelector('.music_container');
const prev = document.getElementById('prev');
const play = document.getElementById('play');
const next = document.getElementById('next');
const volume = document.getElementById('volume');
const title = document.getElementById('title');
const artist = document.getElementById('artist');
const img = document.querySelector('.music_img_change');
const musiclist = document.querySelector('.music_list');
const songList = [{
        name: "Alone",
        title: "Alone",
        artist: "Alan Walker",
        src: "https://res.cloudinary.com/dbvthtwhc/video/upload/v1602525882/songs/Alone_th1k4z.mp3",
    },
    {
        name: "Capital Letters",
        title: "Capital Letters",
        artist: "Hailee Steinfeld",
        src: "https://res.cloudinary.com/dbvthtwhc/video/upload/v1602525920/songs/Capital_Letters_qundte.mp3",
    },
    {
        name: "Closer",
        title: "Closer",
        artist: "The Chainsmokers",
        src: "https://res.cloudinary.com/dbvthtwhc/video/upload/v1602525886/songs/Closer_hhlj2l.mp3",
    },
    {
        name: "Counting Stars",
        title: "Counting Stars",
        artist: "One Republic",
        src: "https://res.cloudinary.com/dbvthtwhc/video/upload/v1602525935/songs/Counting_Stars_igwwjn.mp3",
    },
    {
        name: "Demons",
        title: "Demons",
        artist: "Imagine Dragons",
        src: "https://res.cloudinary.com/dbvthtwhc/video/upload/v1602525901/songs/Demons_dhkcpy.mp3",
    },
    {
        name: "Different World",
        title: "Different World",
        artist: "Alan Walker ft. Sofia Carson",
        src: "https://res.cloudinary.com/dbvthtwhc/video/upload/v1602525893/songs/Different_World_wggzgn.mp3",
    },
    {
        name: "Dusk Till Dawn",
        title: "Dusk Till Dawn",
        artist: "Zayn ft. Sia",
        src: "https://res.cloudinary.com/dbvthtwhc/video/upload/v1602525911/songs/Dusk_Till_Dawn_a1von7.mp3",
    },
    {
        name: "Liar",
        title: "Liar",
        artist: "Camila Cabello",
        src: "https://res.cloudinary.com/dbvthtwhc/video/upload/v1602525938/songs/Liar_p11jmg.mp3",
    },
    {
        name: "No Control",
        title: "No Control",
        artist: "One direction",
        src: "https://res.cloudinary.com/dbvthtwhc/video/upload/v1602525922/songs/No_Control_x8spag.mp3",
    },
    {
        name: "One Last Time",
        title: "One Last Time",
        artist: "Ariana Grande",
        src: "https://res.cloudinary.com/dbvthtwhc/video/upload/v1602525943/songs/One_Last_Time_lmefxa.mp3",
    },

    {
        name: "This Feeling",
        title: "This Feeling",
        artist: "The Chainsmokers ft. Kelsea Ballerini",
        src: "https://res.cloudinary.com/dbvthtwhc/video/upload/v1602525946/songs/This_Feeling_czqgi2.mp3",
    },
    {
        name: "Connection",
        title: "Connection",
        artist: "One Republic",
        src: "",
    },
    {
        name: "Heathens",
        title: "Heathens",
        artist: "21 Pilots",
        src: "https://res.cloudinary.com/dbvthtwhc/video/upload/v1602525937/songs/Heathens_phva6n.mp3",
    },
    {
        name: "Starboy",
        title: "Starboy",
        artist: "Starboy ft. Daft Punk",
        src: "https://res.cloudinary.com/dbvthtwhc/video/upload/v1602525945/songs/Starboy_akxoay.mp3",
    },
    {
        name: "The Monster",
        title: "The Monster",
        artist: "Eminem ft. Rihanna",
        src: "https://res.cloudinary.com/dbvthtwhc/video/upload/v1602526066/songs/The_Monster_gefhc6.mp3",
    },
    {
        name: "Clarity",
        title: "Clarity",
        artist: "Zedd ft. Foxes",
        src: "https://res.cloudinary.com/dbvthtwhc/video/upload/v1602525894/songs/Clarity_hpmhgp.mp3",
    },

];

let isPlay = false;
let ismute = false;
let songIndex = 0;
let volumeSlider = document.querySelector('.volume_slider');
let tempslidervalue = volumeSlider.value;
let before_loadtime = new Date().getTime();
console.log('code starts here')
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

window.addEventListener('keydown', function (e) {
    console.log('preventDefault space start');
    if (e.keyCode == 32 && e.target == document.body) {
        e.preventDefault();
        console.log('preventDefault Space done');
    }
    console.log('preventDefault space completed');
});

musiclist.innerHTML = (songList.map(function (song, songIndex) {
    return `
		<div class="music_list_item" songIndex="${songIndex}">
			<div class="img_container_list col-3">
				<img src="./src/image/${song.name}.jpg">
			</div>
			<h2 class="col-3" id="title_list">${song.name}</h2>
            <h2 class="col-3" id="artist_list">${song.artist}</h2>
		</div>
	`;
}).join(""));

const musiclistitem = document.querySelectorAll(".music_list_item");
for (let i = 0; i < musiclistitem.length; i++) {
    musiclistitem[i].addEventListener("click", function () {
        console.log('musiclistitem Listener start');
        remove_all_active_list();
        audioctx.resume()
        loadSong(songList[i]);
        playmusic(i);
        musiclistitem[i].classList.add("active_music");
        songIndex = i;
        console.log('musiclistitem Listener completed');
    });
};

function remove_all_active_list() {
    for (let i = 0; i < musiclistitem.length; i++) {
        console.log('remove_all_active_list start');
        musiclistitem[i].classList.remove("active_music");
        console.log('remove_all_active_list completed');
    };
};

const playmusic = (e) => {
    console.log('playmusic start');
    //remove_all_active_list();
    musiclistitem[e].classList.add("active_music");
    isPlay = true;
    music.play();
    play.classList.replace('fa-play', 'fa-pause');
    console.log('playmusic compelete');
};

const pausemusic = () => {
    console.log('pause start');
    isPlay = false;
    music.pause();
    play.classList.replace('fa-pause', 'fa-play');
    console.log('pause compelete');
};

document.body.onkeyup = function (e) {
    console.log('window onkeyup start');
    if (e.keyCode == 32) {
        if (isPlay) {
            event.stopPropagation();
            pausemusic();
            console.log('window onkeyup = space used for pause');
            audioctx.resume()
        } else {
            event.stopPropagation();
            playmusic(songIndex);
            console.log('window onkeyup = space used for play');
            audioctx.resume()
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

play.addEventListener('click', () => {
    console.log('playpausemusic on click start');
    isPlay ? pausemusic() : playmusic(songIndex);
    audioctx.resume()
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
    title.textContent = songList.title;
    artist.textContent = songList.artist;
    //music.src = "src/music/" + songList.name + ".mp3";
    music.src = songList.src;
    img.src = "src/image/" + songList.name + ".jpg";
    music.volume = volumeSlider.value;
    console.log('loadsong compelete');
};

const prevSong = () => {
    console.log('prevsong button start');
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
    console.log('prevsong button compelete');
};

const nextSong = () => {
    console.log('nextsong button start');
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
    console.log('nextsong button compelete');
};

prev.addEventListener('click', prevSong);
next.addEventListener('click', nextSong);

const progress_circle = document.querySelector('.progress_circle');

music.addEventListener("timeupdate", () => {
    let position = music.currentTime / music.duration;
    progress.style.width = position * 100 + "%";
    convertTime(Math.round(music.currentTime));
    if (music.ended) {
        nextSong();
        console.log('music ended nextsong done');
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
    music.currentTime = move_progress;
    console.log('proggress compelete');
});

function volumecheck() {
    if (music.volume > 0.45) {
        volumeup();
    }
    if (music.volume == 0) {
        volumedown();
    }
    if (music.volume <= 0.45 && music.volume > 0) {
        volumelow();
    }
}
volumeSlider.addEventListener('change', () => {
    console.log('volumeSlider start');
    music.volume = volumeSlider.value;
    tempslidervalue = volumeSlider.value;
    volumecheck();
    console.log('volumeSlider compelete');
})

const volumedown = () => {
    console.log('volumeDown start');
    ismute = true;
    volume.classList.replace('fa-volume-down', 'fa-volume-mute');
    volume.classList.replace('fa-volume-up', 'fa-volume-mute');
    music.volume = 0;
    volumeSlider.value = 0;
    console.log('volumeDown compelete');
};
const volumelow = () => {
    console.log('volumeLOw start');
    volume.classList.replace('fa-volume-mute', 'fa-volume-down');
    volume.classList.replace('fa-volume-up', 'fa-volume-down');
    console.log('volumeLOw compelete');
}
const volumeup = () => {
    console.log('volumeUP start');
    ismute = false;
    volume.classList.replace('fa-volume-down', 'fa-volume-up');
    volume.classList.replace('fa-volume-mute', 'fa-volume-up');
    volumeSlider.value = tempslidervalue;
    music.volume = volumeSlider.value;
    console.log('volumeUP compelete');
};

volume.addEventListener('click', () => {
    ismute ? volumeup() : volumedown();
    volumecheck();
});

let canvas, context, audioctx, analyser, oscillator, freqArr, barHeight, source, WIDTH, HEIGHT, bigBars = 0,
    INTERVAL = 128,
    SAMPLES = 2048,
    r = 0,
    g = 0,
    b = 255,
    x = 0;

window.addEventListener('load', () => {
    console.log('vusializer start')
    canvas = document.getElementById("cnv1");
    context = canvas.getContext("2d");
    audioctx = new AudioContext();
    WIDTH = window.innerWidth - 50;
    canvas.width = WIDTH - 50;
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