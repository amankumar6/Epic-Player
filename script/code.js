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
    },
    {
        name: "Capital Letters",
        title: "Capital Letters",
        artist: "Hailee Steinfeld",
    },
    {
        name: "Closer",
        title: "Closer",
        artist: "The Chainsmokers",
    },
    {
        name: "Counting Stars",
        title: "Counting Stars",
        artist: "One Republic",
    },
    {
        name: "Demons",
        title: "Demons",
        artist: "Imagine Dragons",
    },
    {
        name: "Different World",
        title: "Different World",
        artist: "Alan Walker ft. Sofia Carson",
    },
    {
        name: "Dusk Till Dawn",
        title: "Dusk Till Dawn",
        artist: "Zayn ft. Sia",
    },
    {
        name: "Liar",
        title: "Liar",
        artist: "Camila Cabello",
    },
    {
        name: "No Control",
        title: "No Control",
        artist: "One direction",
    },
    {
        name: "One Last Time",
        title: "One Last Time",
        artist: "Ariana Grande",
    },

    {
        name: "This Feeling",
        title: "This Feeling",
        artist: "The Chainsmokers ft. Kelsea Ballerini",
    },
    {
        name: "Connection",
        title: "Connection",
        artist: "One Republic",
    },
    {
        name: "Heathens",
        title: "Heathens",
        artist: "21 Pilots",
    },
    {
        name: "Starboy",
        title: "Starboy",
        artist: "Starboy ft. Daft Punk",
    },
    {
        name: "The Monster",
        title: "The Monster",
        artist: "Eminem ft. Rihanna",
    },
    {
        name: "Clarity",
        title: "Clarity",
        artist: "Zedd ft. Foxes",
    },

];

let isPlay = false;
let ismute = false;
let songIndex = 0;
let volumeSlider = document.querySelector('.volume_slider');
let tempslidervalue = volumeSlider.value;
let before_loadtime = new Date().getTime();

window.addEventListener('load', () => {
    let after_loadtime = new Date().getTime();
    let page_loadtime = (after_loadtime - before_loadtime) / 1000;
    if (page_loadtime >= 3) {
        loader.style.display = 'none';
    } else {
        setTimeout(() => {
            loader.style.display = 'none';
        }, 000);
    }
});

window.addEventListener('keydown', function (e) {
    if (e.keyCode == 32 && e.target == document.body) {
        e.preventDefault();
    }
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
        remove_all_active_list();
        loadSong(songList[i]);
        playmusic(i);
        musiclistitem[i].classList.add("active_music");
        songIndex = i;
    });
};

function remove_all_active_list() {
    for (let i = 0; i < musiclistitem.length; i++) {
        musiclistitem[i].classList.remove("active_music");
    };
};

const playmusic = (e) => {
    remove_all_active_list();
    musiclistitem[e].classList.add("active_music");
    isPlay = true;
    music.play();
    play.classList.replace('fa-play', 'fa-pause');
};

const pausemusic = () => {
    isPlay = false;
    music.pause();
    play.classList.replace('fa-pause', 'fa-play');
};

document.body.onkeyup = function (e) {
    if (e.keyCode == 32) {
        if (isPlay) {
            event.stopPropagation();
            pausemusic();
        } else {
            event.stopPropagation();
            playmusic(songIndex);
        }
    } else if (e.keyCode == 39) {
        if (isPlay) {
            music.currentTime += 5;
        } else {
            music.currentTime += 5;
        }

    } else if (e.keyCode == 37) {
        if (isPlay) {
            music.currentTime -= 5;
        } else {
            music.currentTime -= 5;
        }

    }
};

play.addEventListener('click', () => {
    isPlay ? pausemusic() : playmusic(songIndex);
});

headericon.addEventListener('click', () => {
    if (!isPlay) {
        playmusic(songIndex);
    }
});

const loadSong = (songList) => {
    title.textContent = songList.title;
    artist.textContent = songList.artist;
    music.src = "src/music/" + songList.name + ".mp3";
    img.src = "src/image/" + songList.name + ".jpg";
    music.crossOrigin = "anonymous";
    music.volume = volumeSlider.value;
    audioctx.resume()
    window.requestAnimationFrame(draw);
};

const prevSong = () => {
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
};

const nextSong = () => {
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
};

prev.addEventListener('click', prevSong);
next.addEventListener('click', nextSong);

const progress_circle = document.querySelector('.progress_circle');

music.addEventListener("timeupdate", () => {
    let position = music.currentTime / music.duration;
    progress.style.width = position * 100 + "%";
    //progress_circle.style.marginLeft = position * 100 + "%";
    convertTime(Math.round(music.currentTime));
    if (music.ended) {
        nextSong();
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
    let move_progress = (event.offsetX / event.srcElement.clientWidth) * music.duration;
    music.currentTime = move_progress;
});

function volumecheck() {
    if (music.volume > 0.35) {
        volumeup();
    }
    if (music.volume == 0) {
        volumedown();
    }
    if (music.volume <= 0.35 && music.volume > 0) {
        volumelow();
    }
}
volumeSlider.addEventListener('change', () => {
    music.volume = volumeSlider.value;
    tempslidervalue = volumeSlider.value;
    volumecheck();
})

const volumedown = () => {
    ismute = true;
    volume.classList.replace('fa-volume-down', 'fa-volume-mute');
    volume.classList.replace('fa-volume-up', 'fa-volume-mute');
    music.volume = 0;
    volumeSlider.value = 0;
};
const volumelow = () => {
    volume.classList.replace('fa-volume-mute', 'fa-volume-down');
    volume.classList.replace('fa-volume-up', 'fa-volume-down');
}
const volumeup = () => {
    ismute = false;
    volume.classList.replace('fa-volume-down', 'fa-volume-up');
    volume.classList.replace('fa-volume-mute', 'fa-volume-up');
    volumeSlider.value = tempslidervalue;
    music.volume = volumeSlider.value;
};

volume.addEventListener('click', () => {
    ismute ? volumeup() : volumedown();
    volumecheck();
});

let canvas, context, audioctx, analyser, oscillator, freqArr, barHeight, source, windowWidth, windowHeight, bigBars = 0,
    WIDTH = 1024,
    HEIGHT = 350,
    INTERVAL = 128,
    SAMPLES = 2048,
    r = 0,
    g = 0,
    b = 255,
    x = 0;

window.addEventListener('load', () => {
    canvas = document.getElementById("cnv1");
    context = canvas.getContext("2d");
    audioctx = new AudioContext();
    
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
            barHeight = ((freqArr[num] - 128) * 2) + 2;
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