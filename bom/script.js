// ==================== GAME STATE ====================
let gameState = {
    serialNumber: '',
    timer: 300, // 5 phút
    strikes: 0,
    maxStrikes: 3,
    modules: {
        wires: { solved: false },
        whosonfirst: { solved: false },
        keypads: { solved: false },
        simon: { solved: false },
        morse: { solved: false },
        knob: { solved: false }
    },
    timerInterval: null
};

// ==================== WIRES MODULE DATA ====================
let wiresData = {
    wires: [],
    correctWire: -1
};

// ==================== WHO'S ON FIRST MODULE DATA ====================
const whosOnFirstDisplayWords = ['YES', 'FIRST', 'DISPLAY', 'OKAY', 'SAYS', 'NOTHING', '', 'BLANK', 'NO', 'LED', 'LEAD', 'READ', 'RED', 'REED', 'LEED', 'HOLD ON', 'YOU', 'YOU ARE', 'YOUR', 'YOU\'RE', 'UR', 'THERE', 'THEY\'RE', 'THEIR', 'THEY ARE', 'SEE', 'C', 'CEE'];

const whosOnFirstButtonWords = ['READY', 'FIRST', 'NO', 'BLANK', 'NOTHING', 'YES', 'WHAT', 'UHHH', 'LEFT', 'RIGHT', 'MIDDLE', 'OKAY', 'WAIT', 'PRESS', 'YOU', 'YOU ARE', 'YOUR', 'YOU\'RE', 'UR', 'U', 'UH HUH', 'UH UH', 'WHAT?', 'DONE', 'NEXT', 'HOLD', 'SURE', 'LIKE'];

// Vị trí button trong grid 2x3 (index 0-5):
// Layout: 0(Trên trái)  1(Trên phải)
//         2(Giữa trái) 3(Giữa phải)
//         4(Dưới trái) 5(Dưới phải)
// MAPPING THEO GAME GỐC KEEP TALKING AND NOBODY EXPLODES (Manual v1)
const whosOnFirstPositionMap = {
    'YES': 2,        // middle left
    'FIRST': 1,      // top right
    'DISPLAY': 5,    // bottom right
    'OKAY': 1,       // top right
    'SAYS': 5,       // bottom right
    'NOTHING': 2,    // middle left
    '': 3,           // middle right (màn hình trống)
    'BLANK': 3,      // middle right (chữ "BLANK" hiển thị)
    'NO': 5,         // bottom right
    'LED': 2,        // middle left
    'LEAD': 5,       // bottom right
    'READ': 3,       // middle right
    'RED': 3,        // middle right
    'REED': 4,       // bottom left
    'LEED': 4,       // bottom left
    'HOLD ON': 5,    // bottom right
    'YOU': 3,        // middle right
    'YOU ARE': 5,    // bottom right
    'YOUR': 3,       // middle right
    'YOU\'RE': 3,    // middle right
    'UR': 0,         // top left
    'THERE': 5,      // bottom right
    'THEY\'RE': 4,   // bottom left
    'THEIR': 3,      // middle right
    'THEY ARE': 2,   // middle left
    'SEE': 5,        // bottom right
    'C': 1,          // top right
    'CEE': 5         // bottom right
};

const whosOnFirstPriorityMap = {
    'READY': ['YES', 'OKAY', 'WHAT', 'MIDDLE', 'LEFT', 'PRESS', 'RIGHT', 'BLANK', 'READY'],
    'FIRST': ['LEFT', 'OKAY', 'YES', 'MIDDLE', 'NO', 'RIGHT', 'NOTHING', 'UHHH', 'WAIT', 'READY', 'BLANK', 'WHAT', 'PRESS', 'FIRST'],
    'NO': ['BLANK', 'UHHH', 'WAIT', 'FIRST', 'WHAT', 'READY', 'RIGHT', 'YES', 'NOTHING', 'LEFT', 'PRESS', 'OKAY', 'NO'],
    'BLANK': ['WAIT', 'RIGHT', 'OKAY', 'MIDDLE', 'BLANK'],
    'NOTHING': ['UHHH', 'RIGHT', 'OKAY', 'MIDDLE', 'YES', 'BLANK', 'NO', 'PRESS', 'LEFT', 'WHAT', 'WAIT', 'FIRST', 'NOTHING'],
    'YES': ['OKAY', 'RIGHT', 'UHHH', 'MIDDLE', 'FIRST', 'WHAT', 'PRESS', 'READY', 'NOTHING', 'YES'],
    'WHAT': ['UHHH', 'WHAT'],
    'UHHH': ['READY', 'NOTHING', 'LEFT', 'WHAT', 'OKAY', 'YES', 'RIGHT', 'NO', 'PRESS', 'BLANK', 'UHHH'],
    'LEFT': ['RIGHT', 'LEFT'],
    'RIGHT': ['YES', 'NOTHING', 'READY', 'PRESS', 'NO', 'WAIT', 'WHAT', 'RIGHT'],
    'MIDDLE': ['BLANK', 'READY', 'OKAY', 'WHAT', 'NOTHING', 'PRESS', 'NO', 'WAIT', 'LEFT', 'MIDDLE'],
    'OKAY': ['MIDDLE', 'NO', 'FIRST', 'YES', 'UHHH', 'NOTHING', 'WAIT', 'OKAY'],
    'WAIT': ['UHHH', 'NO', 'BLANK', 'OKAY', 'YES', 'LEFT', 'FIRST', 'PRESS', 'WHAT', 'WAIT'],
    'PRESS': ['RIGHT', 'MIDDLE', 'YES', 'READY', 'PRESS'],
    'YOU': ['SURE', 'YOU ARE', 'YOUR', 'YOU\'RE', 'NEXT', 'UH HUH', 'UR', 'HOLD', 'WHAT?', 'YOU'],
    'YOU ARE': ['YOUR', 'NEXT', 'LIKE', 'UH HUH', 'WHAT?', 'DONE', 'UH UH', 'HOLD', 'YOU', 'U', 'YOU\'RE', 'SURE', 'UR', 'YOU ARE'],
    'YOUR': ['UH UH', 'YOU ARE', 'UH HUH', 'YOUR'],
    'YOU\'RE': ['YOU', 'YOU\'RE'],
    'UR': ['DONE', 'U', 'UR'],
    'U': ['UH HUH', 'SURE', 'NEXT', 'WHAT?', 'YOU\'RE', 'UR', 'UH UH', 'DONE', 'U'],
    'UH HUH': ['UH HUH'],
    'UH UH': ['UR', 'U', 'YOU ARE', 'YOU\'RE', 'NEXT', 'UH UH'],
    'WHAT?': ['YOU', 'HOLD', 'YOU\'RE', 'YOUR', 'U', 'DONE', 'UH UH', 'LIKE', 'YOU ARE', 'UH HUH', 'UR', 'NEXT', 'WHAT?'],
    'DONE': ['SURE', 'UH HUH', 'NEXT', 'WHAT?', 'YOUR', 'UR', 'YOU\'RE', 'HOLD', 'LIKE', 'YOU', 'U', 'YOU ARE', 'UH UH', 'DONE'],
    'NEXT': ['WHAT?', 'UH HUH', 'UH UH', 'YOUR', 'HOLD', 'SURE', 'NEXT'],
    'HOLD': ['YOU ARE', 'U', 'DONE', 'UH UH', 'YOU', 'UR', 'SURE', 'WHAT?', 'YOU\'RE', 'NEXT', 'HOLD'],
    'SURE': ['YOU ARE', 'DONE', 'LIKE', 'YOU\'RE', 'YOU', 'HOLD', 'UH HUH', 'UR', 'SURE'],
    'LIKE': ['YOU\'RE', 'NEXT', 'U', 'UR', 'HOLD', 'DONE', 'UH UH', 'WHAT?', 'UH HUH', 'YOU', 'LIKE']
};

let whosOnFirstData = {
    displayWord: '',
    buttonWords: [],
    currentPosition: -1,
    expectedWord: ''
};

// ==================== KEYPADS MODULE DATA ====================
// Tất cả các ký hiệu có thể xuất hiện (tổng hợp từ 4 cột)
const keypadSymbols = ['Ϙ', 'ƛ', 'Ϟ', 'Ѭ', '★', 'ϗ', '©', 'Ӭ', 'Ͽ', 'Ҩ', '☆', '¿', 'Ѽ', 'ѯ', 'Ψ'];

const keypadColumns = [
    ['Ϙ', 'ƛ', 'Ϟ', 'Ѭ', '★', 'ϗ', '©'],
    ['Ӭ', 'Ϙ', 'Ͽ', 'Ҩ', '☆', 'ϗ', '¿'],
    ['©', 'Ѽ', 'Ҩ', 'ѯ', 'ƛ', '☆', 'Ӭ'],
    ['Ϟ', 'Ψ', 'Ѭ', 'ϗ', 'Ͽ', 'ѯ', '★']
];

let keypadsData = {
    symbols: [],
    correctColumn: -1,
    correctOrder: [],
    pressedOrder: []
};

// ==================== SIMON MODULE DATA ====================
let simonData = {
    hasVowel: false,
    sequence: [],
    playerSequence: [],
    stage: 1,
    isPlaying: false,
    maxStage: 5
};

// ==================== MORSE MODULE DATA ====================
const morseCode = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
    'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
    'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
    'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
    'Y': '-.--', 'Z': '--..'
};

const morseWords = {
    'SHELL': 3.505,
    'HALLS': 3.515,
    'SLICK': 3.522,
    'TRICK': 3.532,
    'BOXES': 3.542,
    'LEAKS': 3.552,
    'STROBE': 3.565,
    'BISTRO': 3.572,
    'FLICK': 3.582,
    'BOMBS': 3.592
};

let morseData = {
    word: '',
    frequency: 0,
    morseSequence: [],
    isPlaying: false
};

// ==================== KNOB MODULE DATA ====================
let knobData = {
    ledStates: [],
    correctDirection: ''
};

// ==================== INITIALIZATION ====================
function init() {
    generateSerialNumber();
    startTimer();
    initializeModules();
    attachEventListeners();
}

function generateSerialNumber() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const digits = '0123456789';
    let serial = '';
    
    for (let i = 0; i < 3; i++) {
        serial += letters[Math.floor(Math.random() * letters.length)];
    }
    for (let i = 0; i < 3; i++) {
        serial += digits[Math.floor(Math.random() * digits.length)];
    }
    
    gameState.serialNumber = serial;
    document.getElementById('serialNumber').textContent = serial;
}

function startTimer() {
    gameState.timerInterval = setInterval(() => {
        gameState.timer--;
        updateTimerDisplay();
        
        if (gameState.timer <= 0) {
            gameOver(false);
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(gameState.timer / 60);
    const seconds = gameState.timer % 60;
    document.getElementById('timer').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function addStrike() {
    gameState.strikes++;
    document.getElementById('strikes').textContent = `${gameState.strikes}/${gameState.maxStrikes}`;
    
    if (gameState.strikes >= gameState.maxStrikes) {
        gameOver(false);
    }
}

function checkAllModulesSolved() {
    const allSolved = Object.values(gameState.modules).every(module => module.solved);
    if (allSolved) {
        gameOver(true);
    }
}

function gameOver(won) {
    clearInterval(gameState.timerInterval);
    
    if (won) {
        alert('🎉 CHÚC MỪNG! BẠN ĐÃ GỠ BOM THÀNH CÔNG! 🎉');
    } else {
        alert('💥 BOM ĐÃ NỔ! GAME OVER! 💥');
    }
}

function solveModule(moduleName) {
    gameState.modules[moduleName].solved = true;
    document.querySelector(`.status[data-module="${moduleName}"]`).classList.add('solved');
    document.querySelector(`.status[data-module="${moduleName}"]`).textContent = '✅';
    checkAllModulesSolved();
}

function errorModule(moduleName) {
    const statusElement = document.querySelector(`.status[data-module="${moduleName}"]`);
    statusElement.classList.add('error');
    statusElement.textContent = '❌';
    
    setTimeout(() => {
        statusElement.classList.remove('error');
        if (!gameState.modules[moduleName].solved) {
            statusElement.textContent = '⭕';
        }
    }, 1000);
}

// ==================== MODULE 1: WIRES ====================
function initWiresModule() {
    const colors = ['red', 'blue', 'yellow', 'black', 'white'];
    const numWires = Math.floor(Math.random() * 4) + 3; // 3-6 dây
    
    wiresData.wires = [];
    for (let i = 0; i < numWires; i++) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        wiresData.wires.push(color);
    }
    
    wiresData.correctWire = determineCorrectWire(wiresData.wires);
    renderWires();
}

function determineCorrectWire(wires) {
    const isSerialEven = parseInt(gameState.serialNumber.slice(-1)) % 2 === 0;
    const redCount = wires.filter(w => w === 'red').length;
    const blueCount = wires.filter(w => w === 'blue').length;
    const yellowCount = wires.filter(w => w === 'yellow').length;
    
    // Logic phức tạp dựa vào số dây
    if (wires.length === 3) {
        if (redCount === 0) return wires.length - 1; // Cắt dây cuối
        if (wires[wires.length - 1] === 'white') return wires.length - 1;
        if (blueCount > 1) return wires.lastIndexOf('blue');
        return wires.length - 1;
    } else if (wires.length === 4) {
        if (redCount > 1 && !isSerialEven) return wires.lastIndexOf('red');
        if (wires[wires.length - 1] === 'yellow' && redCount === 0) return 0;
        if (blueCount === 1) return 0;
        if (yellowCount > 1) return wires.length - 1;
        return 1;
    } else if (wires.length === 5) {
        if (wires[wires.length - 1] === 'black' && !isSerialEven) return 3;
        if (redCount === 1 && yellowCount > 1) return 0;
        if (wires.filter(w => w === 'black').length === 0) return 1;
        return 0;
    } else { // 6 dây
        if (yellowCount === 0 && !isSerialEven) return 2;
        if (yellowCount === 1 && blueCount > 1) return 3;
        if (redCount === 0) return wires.length - 1;
        return 3;
    }
}

function renderWires() {
    const container = document.getElementById('wires-container');
    container.innerHTML = '';
    
    wiresData.wires.forEach((color, index) => {
        const wire = document.createElement('div');
        wire.className = `wire ${color}`;
        wire.dataset.index = index;
        wire.addEventListener('click', () => cutWire(index));
        container.appendChild(wire);
    });
}

function cutWire(index) {
    const wireElement = document.querySelector(`.wire[data-index="${index}"]`);
    if (wireElement.classList.contains('cut')) return;
    
    wireElement.classList.add('cut');
    
    if (index === wiresData.correctWire) {
        solveModule('wires');
    } else {
        addStrike();
        errorModule('wires');
    }
}

// ==================== MODULE 2: WHO'S ON FIRST ====================
function initWhosOnFirstModule() {
    whosOnFirstData.displayWord = whosOnFirstDisplayWords[Math.floor(Math.random() * whosOnFirstDisplayWords.length)];
    whosOnFirstData.currentPosition = whosOnFirstPositionMap[whosOnFirstData.displayWord];
    
    // Random 6 từ cho nút bấm
    const shuffled = [...whosOnFirstButtonWords].sort(() => Math.random() - 0.5);
    whosOnFirstData.buttonWords = shuffled.slice(0, 6);
    
    // Lưu từ cần tra cứu (từ ở vị trí được chỉ định)
    whosOnFirstData.targetWord = whosOnFirstData.buttonWords[whosOnFirstData.currentPosition];
    
    renderWhosOnFirst();
}

function renderWhosOnFirst() {
    // Hiển thị từ cần tra cứu thay vì display word
    document.getElementById('display-screen').textContent = whosOnFirstData.targetWord || 'READY';
    
    const buttons = document.querySelectorAll('.word-button');
    buttons.forEach((button, index) => {
        button.textContent = whosOnFirstData.buttonWords[index];
        button.onclick = () => pressWhosOnFirstButton(index);
    });
}

function pressWhosOnFirstButton(index) {
    const pressedWord = whosOnFirstData.buttonWords[index];
    const targetWord = whosOnFirstData.targetWord;
    
    if (!whosOnFirstPriorityMap[targetWord]) {
        addStrike();
        errorModule('whosonfirst');
        return;
    }
    
    const priorityList = whosOnFirstPriorityMap[targetWord];
    
    // Tìm từ đầu tiên trong priority list có xuất hiện trên button
    const correctWord = priorityList.find(word => whosOnFirstData.buttonWords.includes(word));
    
    if (pressedWord === correctWord) {
        solveModule('whosonfirst');
    } else {
        addStrike();
        errorModule('whosonfirst');
    }
}

// ==================== MODULE 3: KEYPADS ====================
function initKeypadsModule() {
    // Chọn 1 cột ngẫu nhiên
    keypadsData.correctColumn = Math.floor(Math.random() * keypadColumns.length);
    const column = keypadColumns[keypadsData.correctColumn];
    
    // Chọn 4 ký hiệu ngẫu nhiên từ cột đó
    const shuffled = [...column].sort(() => Math.random() - 0.5);
    keypadsData.symbols = shuffled.slice(0, 4);
    keypadsData.correctOrder = keypadsData.symbols.slice().sort((a, b) => {
        return column.indexOf(a) - column.indexOf(b);
    });
    keypadsData.pressedOrder = [];
    
    renderKeypads();
}

function renderKeypads() {
    const buttons = document.querySelectorAll('.keypad-button');
    buttons.forEach((button, index) => {
        button.textContent = keypadsData.symbols[index];
        button.classList.remove('pressed');
        button.onclick = () => pressKeypad(index);
    });
}

function pressKeypad(index) {
    const button = document.querySelectorAll('.keypad-button')[index];
    if (button.classList.contains('pressed')) return;
    
    const symbol = keypadsData.symbols[index];
    keypadsData.pressedOrder.push(symbol);
    button.classList.add('pressed');
    
    // Kiểm tra thứ tự
    const currentIndex = keypadsData.pressedOrder.length - 1;
    if (keypadsData.pressedOrder[currentIndex] !== keypadsData.correctOrder[currentIndex]) {
        addStrike();
        errorModule('keypads');
        keypadsData.pressedOrder = [];
        document.querySelectorAll('.keypad-button').forEach(b => b.classList.remove('pressed'));
        return;
    }
    
    if (keypadsData.pressedOrder.length === 4) {
        solveModule('keypads');
    }
}

// ==================== MODULE 4: SIMON SAYS ====================
function initSimonModule() {
    const serial = gameState.serialNumber;
    const vowels = ['A', 'E', 'I', 'O', 'U'];
    simonData.hasVowel = vowels.some(v => serial.includes(v));
    simonData.sequence = [];
    simonData.playerSequence = [];
    simonData.stage = 1;
    simonData.isPlaying = false;
    
    document.getElementById('simon-stage').textContent = simonData.stage;
    
    const buttons = document.querySelectorAll('.simon-button');
    buttons.forEach(button => {
        button.onclick = () => pressSimonButton(button.dataset.color);
    });
    
    // Thêm event cho nút replay
    document.getElementById('simon-replay').onclick = () => {
        if (!simonData.isPlaying && simonData.sequence.length > 0) {
            replaySimonSequence();
        }
    };
    
    setTimeout(() => playSimonSequence(), 1000);
}

function playSimonSequence() {
    simonData.isPlaying = true;
    simonData.playerSequence = [];
    
    // Thêm màu mới vào sequence
    const colors = ['red', 'blue', 'green', 'yellow'];
    simonData.sequence.push(colors[Math.floor(Math.random() * colors.length)]);
    
    let index = 0;
    const interval = setInterval(() => {
        if (index >= simonData.sequence.length) {
            clearInterval(interval);
            simonData.isPlaying = false;
            return;
        }
        
        flashSimonButton(simonData.sequence[index]);
        index++;
    }, 800);
}

function replaySimonSequence() {
    simonData.isPlaying = true;
    simonData.playerSequence = [];
    
    let index = 0;
    const interval = setInterval(() => {
        if (index >= simonData.sequence.length) {
            clearInterval(interval);
            simonData.isPlaying = false;
            return;
        }
        
        flashSimonButton(simonData.sequence[index]);
        index++;
    }, 800);
}

function flashSimonButton(color) {
    const button = document.querySelector(`.simon-button.${color}`);
    button.classList.add('active');
    setTimeout(() => button.classList.remove('active'), 400);
}

function pressSimonButton(color) {
    if (simonData.isPlaying) return;
    
    flashSimonButton(color);
    
    // Người chơi bấm màu (đã được dịch sẵn), không cần dịch nữa
    simonData.playerSequence.push(color);
    
    const currentIndex = simonData.playerSequence.length - 1;
    // So sánh màu người bấm với màu đã dịch từ sequence gốc
    const expectedColor = translateSimonColor(simonData.sequence[currentIndex]);
    
    if (simonData.playerSequence[currentIndex] !== expectedColor) {
        addStrike();
        errorModule('simon');
        // Reset về stage 1 khi sai
        simonData.sequence = [];
        simonData.playerSequence = [];
        simonData.stage = 1;
        document.getElementById('simon-stage').textContent = simonData.stage;
        setTimeout(() => playSimonSequence(), 1000);
        return;
    }
    
    if (simonData.playerSequence.length === simonData.sequence.length) {
        simonData.stage++;
        document.getElementById('simon-stage').textContent = simonData.stage;
        
        if (simonData.stage > simonData.maxStage) {
            solveModule('simon');
        } else {
            setTimeout(() => playSimonSequence(), 1500);
        }
    }
}

function translateSimonColor(color) {
    if (simonData.hasVowel) {
        const map = { 'red': 'blue', 'blue': 'red', 'green': 'yellow', 'yellow': 'green' };
        return map[color];
    } else {
        const map = { 'red': 'blue', 'blue': 'yellow', 'green': 'green', 'yellow': 'red' };
        return map[color];
    }
}

// ==================== MODULE 5: MORSE CODE ====================
function initMorseModule() {
    const words = Object.keys(morseWords);
    morseData.word = words[Math.floor(Math.random() * words.length)];
    morseData.frequency = morseWords[morseData.word];
    morseData.morseSequence = [];
    
    // Chuyển từ thành morse
    for (let char of morseData.word) {
        morseData.morseSequence.push(morseCode[char]);
    }
    
    document.getElementById('frequency-slider').addEventListener('input', (e) => {
        const value = (parseFloat(e.target.value) / 1000).toFixed(3);
        document.getElementById('frequency-value').textContent = value;
    });
    
    document.getElementById('morse-submit').onclick = submitMorse;
    
    playMorseCode();
}

function playMorseCode() {
    if (morseData.isPlaying) return;
    morseData.isPlaying = true;
    
    const led = document.getElementById('morse-led');
    const display = document.getElementById('morse-display');
    let displayText = '';
    let totalTime = 0;
    
    morseData.morseSequence.forEach((code, wordIndex) => {
        for (let i = 0; i < code.length; i++) {
            const char = code[i];
            const duration = char === '.' ? 200 : 600; // Tít ngắn, Te dài
            
            setTimeout(() => {
                led.classList.add('on');
                displayText += char;
                display.textContent = displayText;
            }, totalTime);
            
            setTimeout(() => {
                led.classList.remove('on');
            }, totalTime + duration);
            
            totalTime += duration + 200; // Khoảng cách giữa tín hiệu
        }
        
        totalTime += 600; // Khoảng cách giữa chữ
        setTimeout(() => {
            displayText += ' ';
            display.textContent = displayText;
        }, totalTime);
    });
    
    setTimeout(() => {
        morseData.isPlaying = false;
        display.textContent = '';
        playMorseCode(); // Lặp lại
    }, totalTime + 2000);
}

function submitMorse() {
    const selectedFreq = (parseFloat(document.getElementById('frequency-slider').value) / 1000).toFixed(3);
    
    if (Math.abs(parseFloat(selectedFreq) - morseData.frequency) < 0.001) {
        solveModule('morse');
    } else {
        addStrike();
        errorModule('morse');
    }
}

// ==================== MODULE 6: KNOB ====================
function initKnobModule() {
    // Random trạng thái LED
    knobData.ledStates = Array(12).fill(false);
    
    // Tạo pattern theo 1 trong 4 quy tắc
    const rule = Math.floor(Math.random() * 4);
    
    if (rule === 0) { // Đèn 1, 3, 5 sáng -> Lên
        knobData.ledStates[0] = true;
        knobData.ledStates[2] = true;
        knobData.ledStates[4] = true;
        knobData.correctDirection = 'up';
    } else if (rule === 1) { // Đèn 7, 10, 12 sáng -> Xuống
        knobData.ledStates[6] = true;
        knobData.ledStates[9] = true;
        knobData.ledStates[11] = true;
        knobData.correctDirection = 'down';
    } else if (rule === 2) { // Đèn 5 sáng, 7 tắt -> Trái
        knobData.ledStates[4] = true;
        knobData.ledStates[6] = false;
        // Thêm vài đèn ngẫu nhiên
        knobData.ledStates[1] = Math.random() > 0.5;
        knobData.ledStates[8] = Math.random() > 0.5;
        knobData.correctDirection = 'left';
    } else { // Còn lại -> Phải
        // Random pattern
        for (let i = 0; i < 12; i++) {
            knobData.ledStates[i] = Math.random() > 0.5;
        }
        knobData.correctDirection = 'right';
    }
    
    renderKnob();
}

function renderKnob() {
    const leds = document.querySelectorAll('.led');
    leds.forEach((led, index) => {
        if (knobData.ledStates[index]) {
            led.classList.add('on');
        } else {
            led.classList.remove('on');
        }
    });
    
    const buttons = document.querySelectorAll('.knob-direction');
    buttons.forEach(button => {
        button.onclick = () => turnKnob(button.dataset.direction);
    });
}

function turnKnob(direction) {
    if (direction === knobData.correctDirection) {
        solveModule('knob');
    } else {
        addStrike();
        errorModule('knob');
    }
}

// ==================== INITIALIZE ALL MODULES ====================
function initializeModules() {
    initWiresModule();
    initWhosOnFirstModule();
    initKeypadsModule();
    initSimonModule();
    initMorseModule();
    initKnobModule();
}

// ==================== EVENT LISTENERS ====================
function attachEventListeners() {
    document.getElementById('reset-button').onclick = () => {
        if (confirm('Bạn có chắc muốn reset game?')) {
            location.reload();
        }
    };
    
    document.getElementById('manual-button').onclick = () => {
        window.open('../doc/index.html', '_blank');
    };
}

// ==================== START GAME ====================
window.addEventListener('DOMContentLoaded', init);
