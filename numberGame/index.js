// 랜덤번호 지정
// 유저가 번호 입력 -> Go 버튼 클릭
// 버튼 클릭 후
// 유저가 랜덤 번호를 맞춤 -> 맞았습니다!
// 그게 아니라면
// 랜덤번호 < 유저번호 -> Down 이라고 알려주기
// 랜덤번호 > 유저번호 -> Up 이라고 알려주기
// 만약 유저가 reset버튼을 누르면? 랜덤번호 값, 기회 초기화, 게임초기화
// 기회는 총 5번
// 기회 소진시 -> 게임오버, go버튼 비활성화
// 유저가 1~100 범위 밖의 숫자 입력시 -> 알려주고, 기회 소진 안함
// 유저가 이미 입력한 숫자 입력시 -> 알려주고, 기회 소진 안함

let randomNum = 0;
let userInput = document.getElementById('userInput');
let playBtn = document.getElementById('playBtn');
let resetBtn = document.getElementById('resetBtn');

let resultArea = document.getElementById('resultArea');
let chanceArea = document.getElementById('chanceArea');
let correctArea = document.getElementById('correctArea');

let historyArr = [];
let chances = 5;
let gameOver = false;

// 1. 랜덤 숫자 가져오기
function pickRandom() {
    randomNum = Math.floor(Math.random() * 100) + 1;
    console.log("랜덤 번호 : ", randomNum);
}

// 2. 인풋창 포커스시 입력 값 초기화
function clearInput() {
    userInput.value = "";
}

// 3. 남은 기회 UI 업데이트
function updateChanceUI(chances) {
    // 기존 클래스 초기화
    chanceArea.classList.remove("third", "fifth");

    if (chances <= 3 && chances > 1) {
        chanceArea.classList.add("third");
    } else if (chances <= 1 ) {
        chanceArea.classList.add("fifth");
    }
}

// 4. 플레이 버튼 동작
function play() {
    let userValue = userInput.value;

    // 유효성 검사 (1) 범위 체크
    if (userValue < 1 || userValue > 100) {
        resultArea.textContent = "1~100 사이의 숫자를 입력해주세요";
        return;
    }

    // 유효성 검사 (2) 중복 체크
    if (historyArr.includes(userValue)) {
        resultArea.textContent = "이미 입력한 숫자입니다 😅";
        return;
    }

    // 기회 차감
    chances--;
    chanceArea.textContent = `남은 기회 : ${chances}`;
    // UI 업데이트
    updateChanceUI(chances);

    // 정답 여부 판별
    if (userValue < randomNum) {
        resultArea.textContent = "UP⬆️";
        resultArea.classList.remove("down", "win");
        resultArea.classList.add("up");
    } else if (userValue > randomNum) {
        resultArea.textContent = "DOWN⬇️";
        resultArea.classList.remove("up", "win");
        resultArea.classList.add("down");
    } else {
        resultArea.textContent = "✨GOOD✨";
        resultArea.classList.remove("up", "down");
        resultArea.classList.add("win");
        playBtn.disabled = true;
        return; // 정답이면 함수 종료 (게임오버 로직 실행 안됨)
    }

    // 입력값 기록
    historyArr.push(userValue);
    
    // 기회 소진 시
    if (chances < 1) {
        gameOver = true;
        resultArea.textContent = "😭다시 시도해보세요😭";
        correctArea.textContent = `정답은 ${randomNum} 입니다`;
    }

    // 게임오버라면 Go 버튼 비활성화
    if (gameOver === true) {
        playBtn.disabled = true;
    }
}

// 5. 리셋 버튼
function reset() {
    pickRandom();
    chances = 5;
    historyArr = [];
    gameOver = false; // 게임 상태 초기화

    userInput.value = "";
    resultArea.textContent = "숫자를 입력하세요";
    correctArea.textContent = ""; // 정답 숫자 안내 초기화
    chanceArea.textContent = `남은 기회 : 5`;

    resultArea.classList.remove("win", "up", "down");
    chanceArea.classList.remove("third", "fifth");

    playBtn.disabled = false;
}

// 게임 시작 시 랜덤 숫자 뽑기
pickRandom();
