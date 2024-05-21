type Song = {
    name: string;
    artist: string;
    album: string;
    src: string;
};

const elements = {
    loader: document.getElementById("loading") as HTMLElement,
    headerIcon: document.querySelector(".header-icon") as HTMLElement,
    searchInput: document.getElementById("search_input") as any,
    progress: document.querySelector(".progress_bar") as HTMLElement,
    currentTime: document.querySelector(".current_time") as HTMLElement,
    duration: document.querySelector(".total_duration") as HTMLElement,
    progressDiv: document.querySelector(".progress_div") as HTMLElement,
    music: document.querySelector("audio") as HTMLAudioElement,
    musicContainer: document.querySelector(".music_container") as HTMLElement,
    prev: document.getElementById("prev") as HTMLElement,
    play: document.getElementById("play") as HTMLElement,
    next: document.getElementById("next") as HTMLElement,
    volume: document.getElementById("volume") as HTMLElement,
    title: document.getElementById("title") as HTMLElement,
    artist: document.getElementById("artist") as HTMLElement,
    img: document.querySelector(".music_img_change") as HTMLImageElement,
    musicList: document.querySelector(".music_list") as HTMLElement,
    noResult: document.querySelector(".no_result") as HTMLElement,
    shuffle: document.getElementById("shuffle") as HTMLElement,
    repeat: document.getElementById("repeat") as HTMLElement,
    compatibility: document.querySelector(".compatibility") as HTMLElement,
    canvas: document.getElementById("cnv1") as HTMLCanvasElement,
    volumeSlider: document.querySelector(".volume_slider") as HTMLInputElement,
};

const endpoint =
    "https://res.cloudinary.com/dbvthtwhc/raw/upload/v1613398922/songList.json";

let context: any,
    audioCtx: AudioContext,
    analyser: AnalyserNode,
    oscillator,
    freqArr: Uint8Array,
    barHeight: number,
    source: MediaElementAudioSourceNode,
    WIDTH: number,
    HEIGHT: number,
    bigBars = 0,
    INTERVAL = 128,
    SAMPLES = 2048,
    r = 0,
    g = 0,
    b = 255,
    x = 0,
    isPlay = false,
    isMute = false,
    songIndex = 0,
    volumeSlider: any = document.querySelector('.volume_slider'),
    tempSliderValue = volumeSlider.value,
    minValue = 1,
    lastRandom = 0,
    repeatCheck = false,
    shuffleCheck = false;

let songList: Song[] = [];

async function documentReady() {
    await fetchSongList();
    setupAudioContext();
    loadInitialSong();
    setupEventListeners();
    handleDeviceCompatibility();
    setupAudioVisualizer();
}

async function fetchSongList() {
    try {
        const response = await fetch(endpoint);
        songList = await response.json();
        songList.sort((a, b) => a.name.localeCompare(b.name));
        elements.loader.style.display = "none";
        renderSongList();
    } catch (error) {
        console.error("Failed to fetch song list:", error);
    }
}

function renderSongList() {
    elements.musicList.innerHTML = songList
        .map(
            (song, index) => `
                <li class="music_list_item" data-song-index="${index}">
                    <h3 class="col-1 offset-md-1">${index + 1}.</h3>
                    <div class="img_container_list col-1">
                    <img src="./src/image/${song.album}.jpg">
                    </div>
                    <h1 class="col-3 offset-1 offset-md-0">${song.name}</h1>
                    <h2 class="col-4 col-md-3">${song.artist}</h2>
                    <h3 class="col-2 text-truncate" title="${song.album}">${song.album}</h3>
                </li>
            `
        )
        .join("");
}

function setupAudioContext() {
    context = elements.canvas.getContext('2d');
    audioCtx = new AudioContext();
    WIDTH = window.innerWidth - 50;
    elements.canvas.width = WIDTH;
    HEIGHT = 500;
    elements.canvas.height = 500;
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = SAMPLES;
    oscillator = audioCtx.createOscillator();
    oscillator.connect(audioCtx.destination);
    source = audioCtx.createMediaElementSource(elements.music);
    source.connect(analyser);
    source.connect(audioCtx.destination);
    freqArr = new Uint8Array(analyser.frequencyBinCount);
    barHeight = HEIGHT;
    window.requestAnimationFrame(setupAudioVisualizer);
}

function loadInitialSong() {
    loadSong(songList[songIndex]);
}

function setupEventListeners() {
    // Setup volume slider background
    volumeSlider.style.background = 'linear-gradient(90deg, #1DB954 ' + volumeSlider.value + '%, #ddd 0)';
    
    // Keyboard shortcuts
    window.addEventListener("keydown", handleShortcutKeys);
    
    // Search events
    elements.searchInput.addEventListener('keyup', handleSearch);
    elements.searchInput.addEventListener('input', handleSearchInput);

    // Music list item click events
    document.querySelectorAll('.music_list_item').forEach((element, index) => {
        element.addEventListener('click', () => {
            handleMusicListItemClick(index);
        });
    });

    // Repeat and shuffle button events
    elements.repeat.addEventListener('click', toggleRepeat);
    elements.shuffle.addEventListener('click', toggleShuffle);

    // Play, prev, and next button events
    elements.play.addEventListener('click', togglePlay);
    elements.prev.addEventListener('click', prevSong);
    elements.next.addEventListener('click', nextSong);
    elements.headerIcon.addEventListener('click', playPauseHeaderIcon);

    // Music progress and volume events
    elements.music.addEventListener('timeupdate', updateProgress);
    elements.progressDiv.addEventListener('click', setProgress);
    elements.progressDiv.addEventListener('wheel', handleProgressWheel);
    volumeSlider.addEventListener('change', handleVolumeChange);
    volumeSlider.addEventListener('mousemove', handleVolumeChange);
    volumeSlider.addEventListener('keyup', handleVolumeKeyUp);
    volumeSlider.addEventListener('input', handleVolumeInput);
    elements.volume.addEventListener('click', handleVolumeIconClick);
}

// Function to handle search input events
function handleSearchInput(e) {
    if (!e.inputType && elements.searchInput.value === '') {
        elements.searchInput.value = null;
        handleSearch();
    }
}

// Function to handle music list item click events
function handleMusicListItemClick(index) {
    remove_all_active_list();
    loadSong(songList[index]);
    playMusic(index);
    document.querySelectorAll('.music_list_item')[index].classList.add('active_music');
    songIndex = index;
    elements.searchInput.value = null;
    handleSearch();
}

// Function to handle play/pause button click
function togglePlay() {
    isPlay ? pauseMusic() : playMusic(songIndex);
}

// Function to handle header icon click (play if paused)
function playPauseHeaderIcon() {
    !isPlay && playMusic(songIndex);
}

// Function to handle progress wheel event
function handleProgressWheel(e) {
    Math.sign(e.deltaY) < 0 ? (elements.music.currentTime += 5) : (elements.music.currentTime -= 5);
}

// Function to handle volume key up event
function handleVolumeKeyUp(e) {
    event.stopPropagation();
    e.keyCode == 77 ? toggleMute() : '';
}

// Function to update volume slider background on input
function handleVolumeInput() {
    volumeSlider.style.background = 'linear-gradient(90deg, #1DB954 ' + volumeSlider.value + '%, #ddd 0)';
}

// Function to handle volume icon click event
function handleVolumeIconClick() {
    isMute ? volumeUp() : volumeDown();
    updateVolumeSliderBackground();
}

function handleShortcutKeys(event: KeyboardEvent) {
    if (screen.width >= 480 || screen.height >= 480) {
        window.addEventListener("keydown", (e) => {
            if (e.keyCode == 32 && e.target == document.body) {
                e.preventDefault();
            }
        });

        document.body.onkeyup = (e) => {
            if (e.keyCode == 32) {
                event.stopPropagation();
                isPlay ? pauseMusic() : playMusic(songIndex);
            }
            if (e.keyCode == 39) {
                elements.music.currentTime += 5;
            } else if (e.keyCode == 37) {
                elements.music.currentTime -= 5;
            } else if (e.keyCode == 77) {
                toggleMute();
            }
        };
    }
}

function handleSearch() {
    const musicListItem = document.querySelectorAll('.music_list_item');
    let txtValue,
            count = 0,
            search_result: HTMLInputElement,
            filter = elements.searchInput.value.toUpperCase();

        musicListItem.forEach((element: any) => {
            search_result = element.getElementsByTagName(
                'h1'
            )[0] as HTMLInputElement;
            txtValue = element.getElementsByTagName('h1')[0].innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                element.style.display = '';
                elements.musicList.style.display = 'block';
                elements.noResult.style.display = 'none';
            } else {
                search_result = element.getElementsByTagName(
                    'h2'
                )[0] as HTMLInputElement;
                txtValue = search_result.innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    element.style.display = '';
                    elements.musicList.style.display = 'block';
                    elements.noResult.style.display = 'none';
                } else {
                    element.style.display = 'none';
                    count++;
                    if (count == musicListItem.length) {
                        elements.musicList.style.display = 'none';
                        const noResultContent: any = document.querySelector(
                            '.no_result_txt'
                        );
                        noResultContent.innerText =
                            '"' + elements.searchInput.value + '"';
                        elements.noResult.style.display = 'grid';
                    }
                }
            }
        });
        event.stopPropagation();
}

function remove_all_active_list() {
    const musicListItem = document.querySelectorAll('.music_list_item');
    musicListItem.forEach((e) =>
        e.classList.remove('active_music')
    );
}

function togglePlayPause() {
    isPlay ? pauseMusic() : playMusic(songIndex);
}

function playMusic(index: number) {
    const musicListItem = document.querySelectorAll('.music_list_item');

    remove_all_active_list();
    audioCtx.resume();
    musicListItem[index].classList.add('active_music');
    isPlay = true;
    elements.music.play();
    elements.play.classList.replace('fa-play', 'fa-pause');
    elements.play.title = 'Pause';
}

function pauseMusic() {
    elements.music.pause();
    elements.play.classList.replace("fa-pause", "fa-play");
    elements.play.title = "Play";
    isPlay = false;
}

function prevSong() {
    const musicListItem = document.querySelectorAll('.music_list_item');
    if (shuffleCheck) {
        shuffleSong();
    } else {
        songIndex = (songIndex - 1 + songList.length) % songList.length;
        remove_all_active_list();
        musicListItem[songIndex].classList.add('active_music');
        loadSong(songList[songIndex]);
        playMusic(songIndex);
    }
}

function nextSong() {
    const musicListItem = document.querySelectorAll('.music_list_item');
    if (shuffleCheck) {
        shuffleSong();
    } else {
        songIndex = (songIndex + 1) % songList.length;
        remove_all_active_list();
        musicListItem[songIndex].classList.add('active_music');
        loadSong(songList[songIndex]);
        playMusic(songIndex);
    }
}

function handleSongClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const listItem = target.closest(".music_list_item");
    if (listItem) {
        const index = Number(listItem.getAttribute("data-song-index"));
        playMusic(index);
        songIndex = index;
    }
}

function loadSong(song: Song) {
    const musicListItem = document.querySelectorAll('.music_list_item');
    elements.title.textContent = song.name;
    elements.artist.textContent = song.artist;
    elements.artist.title = song.artist;
    elements.music.src = "src/music/" + song.name + ".mp3";
    // elements.music.src = song.src;
    elements.img.src = "src/image/" + song.album + ".jpg";
    elements.music.volume = parseFloat(elements.volumeSlider.value) / 100;

    musicListItem[songIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest',
    });
}

function updateProgress() {
    const { currentTime, duration } = elements.music;
    const progressPercent = (currentTime / duration) * 100;
    elements.progress.style.width = `${progressPercent}%`;
    elements.currentTime.textContent = formatTime(currentTime);
    duration ? elements.duration.textContent = formatTime(duration) : '';

    if (elements.music.ended) {
        if (!repeatCheck && !shuffleCheck) {
            nextSong();
        } else if (!repeatCheck && shuffleCheck) {
            shuffleSong();
        } else if (repeatCheck) {
            playMusic(songIndex);
        }
    }
}

function formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
}

function setProgress(event: MouseEvent) {
    const width = this.clientWidth;
    const clickX = event.offsetX;
    const duration = elements.music.duration;
    elements.music.currentTime = (clickX / width) * duration;
}

// Handles changes in the volume slider
function handleVolumeChange() {
    const volume = parseFloat(elements.volumeSlider.value) / 100;
    elements.music.volume = volume;
    tempSliderValue = volume;
    isMute = volume === 0;
    updateVolumeSliderBackground();
    updateVolumeIcon();
}

// Sets up the volume slider background based on the current value
function updateVolumeSliderBackground() {
    volumeSlider.style.background = 
        `linear-gradient(90deg, #1DB954 ${volumeSlider.value}%, #ddd 0)`;
}

// Updates the volume icon based on the current volume level and mute state
function updateVolumeIcon() {
    if (isMute) {
        elements.volume.classList.replace("fa-volume-up", "fa-volume-mute");
    } else if (elements.music.volume > 0.45) {
        elements.volume.classList.replace("fa-volume-mute", "fa-volume-up");
        elements.volume.classList.replace("fa-volume-down", "fa-volume-up");
    } else if (elements.music.volume > 0) {
        elements.volume.classList.replace("fa-volume-mute", "fa-volume-down");
        elements.volume.classList.replace("fa-volume-up", "fa-volume-down");
    } else {
        elements.volume.classList.replace("fa-volume-up", "fa-volume-mute");
        elements.volume.classList.replace("fa-volume-down", "fa-volume-mute");
    }
}

// Increases the volume and updates the UI
function volumeUp() {
    isMute = false;
    elements.music.volume = tempSliderValue;
    volumeSlider.value = tempSliderValue * 100;
    updateVolumeSliderBackground();
    updateVolumeIcon();
    elements.volume.title = 'Mute';
}

// Sets the volume to a low level and updates the UI
function volumeLow() {
    elements.volume.title = 'Mute';
    updateVolumeIcon();
}

// Mutes the volume and updates the UI
function volumeDown() {
    isMute = true;
    elements.music.volume = 0;
    volumeSlider.value = 0;
    updateVolumeSliderBackground();
    updateVolumeIcon();
    elements.volume.title = 'Unmute';
}

// Toggles the mute state and updates the UI accordingly
function toggleMute() {
    if (elements.music.volume !== 0) {
        volumeDown();
    } else {
        volumeUp();
    }
}

function toggleShuffle(){
    if (shuffleCheck) {
        elements.shuffle.classList.remove('active_icon');
        elements.shuffle.title = 'Shuffle: On';
    } else {
        elements.shuffle.classList.add('active_icon');
        elements.shuffle.title = 'Shuffle: Off';
    }
    shuffleCheck = !shuffleCheck;
}

function shuffleSong() {
    const musicListItem = document.querySelectorAll('.music_list_item');
    songIndex =
        Math.floor(Math.random() * (songList.length - 1 - minValue + 1)) +
        minValue;
    while (lastRandom === songIndex) {
        songIndex =
            Math.floor(
                Math.random() * (songList.length - 1 - minValue + 1)
            ) + minValue;
    }
    loadSong(songList[songIndex]);
    playMusic(songIndex);
    musicListItem[songIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest',
    });
    minValue = 0;
    lastRandom = songIndex;
}

function toggleRepeat() {
    if (repeatCheck) {
        elements.repeat.classList.replace('fa-repeat-1-alt', 'fa-repeat');
        elements.repeat.classList.remove('active_icon');
    } else {
        elements.repeat.classList.replace('fa-repeat', 'fa-repeat-1-alt');
        elements.repeat.classList.add('active_icon');
    }
    repeatCheck = !repeatCheck;
}

function handleDeviceCompatibility() {
    if (window.screen.width < 480 && window.screen.height < 480) {
        elements.musicList.classList.add('d-none');
        elements.compatibility.classList.replace('d-none', 'd-flex');
        elements.canvas.classList.add('d-none');
        elements.musicContainer.classList.replace('d-flex', 'd-none');
        elements.compatibility.innerHTML = `<p>Sorry Your Device is not Epic to use Epic Player.</p>`;
    }

    if (screen.width < 480 && screen.height >= 480) {
        elements.musicList.classList.add('d-none');
        elements.compatibility.classList.replace('d-none', 'd-flex');
        elements.canvas.classList.add('d-none');
        elements.musicContainer.classList.replace('d-flex', 'd-none');
        elements.compatibility.innerHTML = `
            <p>
                <img src="src/screen_rotation-white-18dp.svg" alt="rotate" class="rotate_device"> Rotate you device and reload the page to use Epic Player.
            </p>
        `;
    }
}

function setupAudioVisualizer() {
    if (!elements.music.paused) {
            bigBars = 0;
            r = 0;
            g = 0;
            b = 255;
            x = 0;
            context.clearRect(0, 0, WIDTH, HEIGHT);
            analyser.getByteFrequencyData(freqArr);
            for (var i = 0; i < INTERVAL; i++) {
                if (barHeight >= 240) {
                    bigBars++;
                }
                let num = i;
                barHeight = (freqArr[num] - 128) * 3 + 2;
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
                context.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
                context.fillRect(
                    x,
                    HEIGHT - barHeight,
                    WIDTH / INTERVAL - 1,
                    barHeight
                );
                x = x + WIDTH / INTERVAL;
            }
        }
        window.requestAnimationFrame(setupAudioVisualizer);
}

document.addEventListener("DOMContentLoaded", documentReady);