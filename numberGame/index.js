// 랜덤번호 지정
// 유저가 번호 입력 -> Go 버튼 클릭
// 버튼 클릭 후
// 유저가 랜덤 번호를 맞춤 -> 맞았습니다!
// 그게 아니라면
// 랜덤번호 < 유저번호 -> Down 이라고 알려주기
// 랜덤번호 > 유저번호 -> Up 이라고 알려주기
// 만약 유저가 reset버튼을 누르면? 랜던번호 값, 기회 초기화, 게임초기화
// 기회는 총 5번
// 기회 소진시 -> 게임오버, go버튼 비활성화
// 유저가 1~100 범위 밖의 숫자 입력시 -> 알려주고, 기회 소진 안함
// 유저가 이미 입력한 수잦 입력시 -> 알려주고, 기회 소진 안함


let randomNum = 0;
let userInput = document.getElementById('userInput');
let playBtn = document.getElementById('playBtn');
let resetBtn = document.getElementById('resetBtn');

let resultArea =document.getElementById('resultArea');
let chanceArea =document.getElementById('chanceArea');

let historyArr = []
let chances = 5;
let gameOver = false;

// 1. 랜덤 숫자 가져오기 Math.random
function pickRandom(){
    randomNum = Math.floor(Math.random()*100)+1;
    console.log("랜덤 번호 : ", randomNum)
};


// ** 인풋창 포커스시 입력 값 초기화
function clearInput() {
    userInput.value = "";
}

// 2. 플레이버튼 활성화
function play() {
    // 2-1. 유저가 입력한 숫자 가져오기
    let userValue = userInput.value;
    // 유저가 입력한 값의 유효성 검사
    // (1) 1~100사이의 숫자인가?
    if (userValue < 1 || userValue > 100) {
        // console.log("1~100사이의 숫자를 입력해주세요");
        resultArea.textContent = "1~100사이의 숫자를 입력해주세요";
        return;
    }
    // (2) 중복숫자인가?
    if(historyArr.includes(userValue)){
        // console.log("이미 입력한 숫자 입니다");
        resultArea.textContent = "이미 입력한 숫자 입니다😅";
        return;
    }


    // 2-2. 기회 제한하기
    // 기회 변수는 global로 선언
    chances --;
    console.log("남은기회", chances);
    chanceArea.textContent = `남은 기회 : ${chances}`;


    // 2-3. 입력한 숫자와 랜덤숫자 매칭
    if(userValue < randomNum) {
        // console.log("UP");
        resultArea.textContent = "UP⬆️";
        resultArea.classList.remove("down");
        resultArea.classList.remove("win");
        resultArea.classList.add("up");

    } else if(userValue > randomNum) {
        // console.log("DOWN");
        resultArea.textContent = "DOWN⬇️";
        resultArea.classList.remove("up");
        resultArea.classList.remove("win");
        resultArea.classList.add("down");

    } else {
        // console.log("GOOD");
        resultArea.textContent = "✨GOOD✨";
        resultArea.classList.remove("up");
        resultArea.classList.remove("down");
        resultArea.classList.add("win");
        playBtn.disabled = true;

    }

    // 2-4. 가져온 유저가 입력한 값을 저장하기
    historyArr.push(userValue);
    console.log(historyArr);

    // 2-5. 기회 소진시 게임오버하기
    // if(chances < 1) {
    //     gameOver = true;
    //     resultArea.textContent = "😭다시 시도해보세요😭";
    // }

    // 남은 기회 수에 따라 색 변하기
    if (chances === 3) {
        chanceArea.classList.add("third");
    } else if (chances === 1) {
        chanceArea.classList.remove("third");
        chanceArea.classList.add("fifth");
    } else if (chances < 1) {
        gameOver = true;
        resultArea.textContent = "😭다시 시도해보세요😭";
    }


    // 2-6. 게임오버하면 Go버튼 비활성화 하기
    if(gameOver == true) {
        playBtn.disabled = true;
    }

};



// 3.리셋버튼
function reset() {
    pickRandom();
    chances = 5;
    userInput.value = "";
    resultArea.classList.remove("win");
    resultArea.textContent = "숫자를 입력하세요";
    chanceArea.textContent = `남은 기회 : 5`;
    playBtn.disabled = false;
    historyArr = [];

};


pickRandom();

