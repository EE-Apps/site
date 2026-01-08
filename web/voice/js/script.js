/* =======================
   SAFE getUserMedia
======================= */
async function getUserMediaSafe() {
    if (navigator.mediaDevices?.getUserMedia)
        return navigator.mediaDevices.getUserMedia({ audio:true });
    if (navigator.getUserMedia)
        return new Promise((r,j)=>navigator.getUserMedia({audio:true},r,j));
    throw new Error("getUserMedia unsupported");
}

/* =======================
   GLOBALS
======================= */
let mediaRecorder, stream, analyser, audioCtx;
let chunks=[], markers=[], samples=[];
let startTime=0;
let recording=false;

let playbackAudio = null;
let playbackMarkers = [];
let playbackAnimationId = null;

let isPaused = false;

let recognition = null;     // распознавание речи
let transcript = "";        // текущая транскрипция

let currentRecordingName = ""; // название текущей записи
let userLocation = null;       // геолокация пользователя

/* =======================
   UI
======================= */
const startBtn = document.getElementById('start');
const stopBtn = document.getElementById('stop');
const markBtn = document.getElementById('mark');
const recCanvas = document.getElementById('recordViz');
const recCtx = recCanvas.getContext('2d');
const recordsDiv = document.getElementById('records');
const pauseBtn = document.getElementById('pause');
const recordNameInput = document.getElementById('recordName');


/* =======================
   CANVAS SCALE
======================= */
function resizeCanvas(c){
    c.width = c.clientWidth;
    c.height = c.clientHeight;
}
resizeCanvas(recCanvas);
window.onresize=()=>resizeCanvas(recCanvas);

/* =======================
   GEOLOCATION
======================= */
function getUserLocation() {
    return new Promise((resolve) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy
                    });
                },
                (error) => {
                    console.warn('Не удалось получить геолокацию:', error);
                    resolve(null);
                }
            );
        } else {
            resolve(null);
        }
    });
}

/* =======================
   RECORD
======================= */
startBtn.onclick = async () => {
    // Получаем геолокацию
    userLocation = await getUserLocation();
    
    stream = await getUserMediaSafe();
    audioCtx = new AudioContext();

    const src = audioCtx.createMediaStreamSource(stream);
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 1024;
    src.connect(analyser);

    mediaRecorder = new MediaRecorder(stream);
    chunks=[]; markers=[]; samples=[];
    transcript = "";
    currentRecordingName = recordNameInput.value.trim() || `Запись ${new Date().toLocaleString('ru-RU')}`;
    startTime = performance.now();
    recording=true;
    isPaused = false;

    mediaRecorder.ondataavailable=e=>chunks.push(e.data);
    mediaRecorder.onstop=saveRecording;
    mediaRecorder.start();

    // Запускаем распознавание речи в реальном времени
    startSpeechRecognition();

    drawRecording();
    startBtn.disabled=true;
    stopBtn.disabled=false;
    markBtn.disabled=false;
    pauseBtn.disabled=false;
    recordNameInput.disabled=true;
    pauseBtn.textContent = "⏸";
};

pauseBtn.onclick = () => {
    if(!mediaRecorder) return;

    if(!isPaused){
        mediaRecorder.pause();
        isPaused = true;
        pauseBtn.textContent = "▶";
    } else {
        mediaRecorder.resume();
        isPaused = false;
        pauseBtn.textContent = "⏸";
    }
};

stopBtn.onclick = () => {
    recording=false;
    if(mediaRecorder && mediaRecorder.state !== 'inactive'){
        mediaRecorder.stop();
    }
    if(stream) stream.getTracks().forEach(t=>t.stop());
    
    // Останавливаем распознавание речи
    if(recognition) {
        recognition.stop();
        recognition = null;
    }

    startBtn.disabled=false;
    stopBtn.disabled=true;
    markBtn.disabled=true;
    pauseBtn.disabled=true;
    recordNameInput.disabled=false;
    recordNameInput.value = "";
    pauseBtn.textContent = "⏸";
};

/* =======================
   MARKERS
======================= */
markBtn.onclick=()=>{
    markers.push({ time: (performance.now()-startTime)/1000 });
};

/* =======================
   SPEECH RECOGNITION в реальном времени
======================= */
function startSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
        console.warn('Speech Recognition не поддерживается браузером');
        return;
    }

    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'ru-RU';

    recognition.onresult = (event) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcriptPart = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                transcript += transcriptPart + ' ';
            }
        }
    };

    recognition.onerror = (event) => {
        console.error('Speech Recognition error:', event.error);
    };

    recognition.onend = () => {
        // Перезапускаем, если еще идет запись и не на паузе
        if (recording && !isPaused) {
            try {
                recognition.start();
            } catch(e) {
                console.error('Не удалось перезапустить распознавание:', e);
            }
        }
    };

    try {
        recognition.start();
    } catch (error) {
        console.error('Не удалось запустить распознавание речи:', error);
    }
}

/* =======================
   RECORD VISUALIZATION
======================= */
function drawRecording() {
    if (!recording) return;

    const buffer = new Float32Array(analyser.fftSize);
    analyser.getFloatTimeDomainData(buffer);

    if(!isPaused){
        let sum = 0;
        for (let i = 0; i < buffer.length; i++) sum += buffer[i]*buffer[i];
        const rms = Math.sqrt(sum/buffer.length);

        const gain = 6;
        samples.push(Math.min(1,rms*gain));
    }

    drawWave(recCtx, recCanvas, samples, markers, null);

    requestAnimationFrame(drawRecording);
}

/* =======================
   WAVE DRAW
======================= */
function drawWave(ctx, canvas, data, markers, playPos) {
    ctx.clearRect(0,0,canvas.width,canvas.height);

    const mid = canvas.height / 2;
    const scale = canvas.height * 0.45;

    ctx.strokeStyle = "#4caf50";
    ctx.beginPath();
    data.forEach((v,i)=>{
        const x = i / data.length * canvas.width;
        const y = mid - v*scale;
        if(i===0) ctx.moveTo(x,y);
        else ctx.lineTo(x,y);
    });
    ctx.stroke();

    ctx.strokeStyle = "#ff9800";
    markers.forEach(m=>{
        const x = (m.time / getDuration(data)) * canvas.width;
        ctx.beginPath();
        ctx.moveTo(x,0);
        ctx.lineTo(x,canvas.height);
        ctx.stroke();
    });

    if(playPos!==null){
        ctx.strokeStyle = "#f44336";
        const x = playPos*canvas.width;
        ctx.beginPath();
        ctx.moveTo(x,0);
        ctx.lineTo(x,canvas.height);
        ctx.stroke();
    }
}

function getDuration(data){ return data.length/60; }

/* =======================
   SAVE
======================= */
async function saveRecording(){
    const webm = new Blob(chunks,{type:'audio/webm'});
    const wav = await webmToWav(webm);
    const duration = samples.length / 60;
    
    const recordData = {
        wav,
        markers,
        samples,
        duration,
        transcript: transcript.trim() || null,
        name: currentRecordingName,
        dateTime: new Date().toISOString(),
        location: userLocation
    };
    
    saveToDB(recordData);
}

/* =======================
   RECORD LIST
======================= */
function addRecordUI(obj, recordId){
    const div = document.createElement('div');
    div.className="record";
    div.dataset.recordId = recordId;

    // Название записи (редактируемое)
    const nameDiv = document.createElement('div');
    
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.value = obj.name || `Запись №${recordId}`;
    nameInput.onchange = () => {
        updateRecordName(recordId, nameInput.value);
    };
    nameDiv.appendChild(nameInput);
    div.appendChild(nameDiv);

    // Метаданные
    const metaDiv = document.createElement('div');
    
    if (obj.dateTime) {
        const date = new Date(obj.dateTime);
        const dateStr = date.toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        const dateSpan = document.createElement('div');
        dateSpan.innerHTML = `📅 ${dateStr}`;
        metaDiv.appendChild(dateSpan);
    }
    
    if (obj.location) {
        const locSpan = document.createElement('div');
        locSpan.innerHTML = `📍 ${obj.location.latitude.toFixed(4)}, ${obj.location.longitude.toFixed(4)}`;
        locSpan.style.cursor = 'pointer';
        locSpan.title = 'Нажмите, чтобы открыть на карте';
        locSpan.onclick = () => {
            window.open(`https://www.google.com/maps?q=${obj.location.latitude},${obj.location.longitude}`, '_blank');
        };
        metaDiv.appendChild(locSpan);
    }
    
    if (obj.duration) {
        const durationSpan = document.createElement('div');
        const minutes = Math.floor(obj.duration / 60);
        const seconds = Math.floor(obj.duration % 60);
        durationSpan.innerHTML = `⏱️ ${minutes}:${seconds.toString().padStart(2, '0')}`;
        metaDiv.appendChild(durationSpan);
    }
    
    // Показываем метаданные только если они есть
    if (metaDiv.children.length > 0) {
        metaDiv.className = 'metaData';
        div.appendChild(metaDiv);
    }

    const audio = document.createElement('audio');
    audio.src = URL.createObjectURL(obj.wav);
    audio.controls=true;
    div.appendChild(audio);

    // Транскрипция
    const transcriptDiv = document.createElement('div');
    transcriptDiv.className = 'transcript';
    if (obj.transcript && obj.transcript.trim()) {
        transcriptDiv.innerHTML = `<strong>Текст:</strong> ${obj.transcript}`;
    } else {
        transcriptDiv.innerHTML = '<em style="color: #999;">Транскрипция отсутствует</em>';
    }
    div.appendChild(transcriptDiv);

    // Закладки (маркеры)
    if (obj.markers && obj.markers.length > 0) {
        const markersDiv = document.createElement('div');
        markersDiv.className = 'markers';
        
        obj.markers.forEach((m,i)=>{
            const markDiv = document.createElement('span');
            markDiv.className="marker";
            markDiv.textContent=`🔖 ${m.time.toFixed(2)}s`;
            markDiv.onclick=()=>{
                if(Number.isFinite(audio.duration))
                    audio.currentTime=Math.min(m.time,audio.duration);
            };
            markersDiv.appendChild(markDiv);
        });
        
        div.appendChild(markersDiv);
    }

    audio.addEventListener('play', ()=>{
        document.querySelectorAll('#records audio').forEach(a=>{
            if(a!==audio && !a.paused) a.pause();
        });
        playbackAudio = audio;
        playbackMarkers = obj.markers || [];
        startPlaybackVisualization(audio, obj.samples, obj.markers || []);
    });

    audio.addEventListener('pause', ()=>{
        if(playbackAnimationId) cancelAnimationFrame(playbackAnimationId);
    });
    audio.addEventListener('ended', ()=>{
        if(playbackAnimationId) cancelAnimationFrame(playbackAnimationId);
        drawWave(recCtx, recCanvas, obj.samples, obj.markers || [], null);
    });

    recordsDiv.prepend(div);
}

/* =======================
   PLAYBACK VISUALIZATION
======================= */
function startPlaybackVisualization(audio, samplesData, markers){
    const ctx = recCtx;
    const canvas = recCanvas;

    if(!audio.playbackCtx){
        audio.playbackCtx = new AudioContext();
        audio.playbackSource = audio.playbackCtx.createMediaElementSource(audio);
        audio.playbackAnalyser = audio.playbackCtx.createAnalyser();
        audio.playbackAnalyser.fftSize = 1024;

        audio.playbackSource.connect(audio.playbackAnalyser);
        audio.playbackAnalyser.connect(audio.playbackCtx.destination);
    }

    function draw(){
        const playPos = audio.currentTime / audio.duration;
        drawWave(ctx, canvas, samplesData, markers, playPos);

        if(!audio.paused && !audio.ended)
            playbackAnimationId = requestAnimationFrame(draw);
    }

    if(audio.playbackCtx.state === 'suspended') audio.playbackCtx.resume();

    draw();
}

/* =======================
   INDEXED DB
======================= */
let db;
const req=indexedDB.open("voice-recorder",3);
req.onupgradeneeded=e=>{
    db=e.target.result;
    if(!db.objectStoreNames.contains("records")){
        db.createObjectStore("records",{keyPath:"id",autoIncrement:true});
    }
};
req.onsuccess=e=>{
    db=e.target.result;
    loadDB();
};

function saveToDB(data){
    const tx=db.transaction("records","readwrite");
    tx.objectStore("records").add(data);
    tx.oncomplete=loadDB;
}

function loadDB(){
    recordsDiv.innerHTML="";
    const tx=db.transaction("records","readonly");
    tx.objectStore("records").openCursor().onsuccess=e=>{
        const cursor = e.target.result;
        if(cursor){
            addRecordUI(cursor.value, cursor.key);
            cursor.continue();
        }
    };
}

function updateTranscriptInDB(recordId, transcript){
    const tx=db.transaction("records","readwrite");
    const store = tx.objectStore("records");
    const getReq = store.get(recordId);
    
    getReq.onsuccess = () => {
        const record = getReq.result;
        record.transcript = transcript;
        store.put(record);
    };
    
    tx.oncomplete = loadDB;
}

function updateRecordName(recordId, newName){
    const tx=db.transaction("records","readwrite");
    const store = tx.objectStore("records");
    const getReq = store.get(recordId);
    
    getReq.onsuccess = () => {
        const record = getReq.result;
        record.name = newName;
        store.put(record);
    };
}

function deleteFromDB(id){
    db.transaction("records","readwrite").objectStore("records").delete(id);
}

/* =======================
   WEBM → WAV
======================= */
async function webmToWav(blob){
    const buf = await blob.arrayBuffer();
    const ctx = new AudioContext();
    const audio = await ctx.decodeAudioData(buf);

    const ch = audio.numberOfChannels;
    const len = audio.length * ch * 2;
    const buffer = new ArrayBuffer(44 + len);
    const view = new DataView(buffer);

    const w = (o,s) => [...s].forEach((c,i)=>view.setUint8(o+i,c.charCodeAt(0)));

    w(0,'RIFF'); view.setUint32(4,36+len,true);
    w(8,'WAVEfmt '); view.setUint32(16,16,true);
    view.setUint16(20,1,true);
    view.setUint16(22,ch,true);
    view.setUint32(24,audio.sampleRate,true);
    view.setUint32(28,audio.sampleRate*ch*2,true);
    view.setUint16(32,ch*2,true);
    view.setUint16(34,16,true);
    w(36,'data'); view.setUint32(40,len,true);

    let o = 44;
    for(let i=0;i<audio.length;i++){
        for(let c=0;c<ch;c++){
            let s = Math.max(-1, Math.min(1, audio.getChannelData(c)[i]));
            view.setInt16(o, s*0x7fff, true);
            o += 2;
        }
    }

    return new Blob([buffer], {type:'audio/wav'});
}

document.addEventListener('DOMContentLoaded', () => {
    if(document.querySelectorAll('.navBtn').length > 0){
        document.querySelectorAll('.navBtn').forEach(btn => {
            btn.addEventListener('click', () => {
                pages.switch(`p${btn.dataset.page}`)
            })
        })
    }
})