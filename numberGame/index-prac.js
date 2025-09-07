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



let randomNum = 0;// 랜덤번호 저장 변수
let playBtn = document.getElementById('playBtn') // 게임시작버튼
let userInput = document.getElementById('userInput') // 유저 값 입력
let historyArr = [] // 유저가 입력한 값 어레이 형식으로
let resultArea = document.getElementById('resultArea') // 결과 확인
let chanceArea = document.getElementById('chanceArea') // 결과 확인
let resetBtn = document.getElementById('resetBtn')// 리셋버튼
let chances = 5; // 5번의 기회
let gameOver =false; // 게임오버


// 랜덤숫자
function pickRandomNum() {
    randomNum = Math.floor(Math.random()*100)+1; // 랜덤숫자 뽑기, 소수점 버리기
    console.log("랜덤번호", randomNum);
}


// 입력창 focus시 입력 초기화
function clearInput() {
    userInput.value = "";
}


// 게임 플레이 (유저가 값 입력시 Go버튼 누르기)
function play() {
    // 유저가 입력한 값 불러오기
    let userValue = userInput.value;

    // 값 유효성 검사하기(1~100)
    if(userValue < 1 || userValue > 100) {
        resultArea.textContent = "1~100사이의 숫자를 입력해주세요";
        return;
    }

    // 값 유효성 검사하기(중복숫자)
    if(historyArr.includes(userValue)){
        resultArea.textContent = "이미 입력한 숫자 입니다"
        return;
    }

    // 클릭시 기회 1회씩 소진, 남은기회 표시
    chances --;
    chanceArea.textContent = `남은기회 : ${chances}`;

    if(userValue < randomNum) {
        resultArea.textContent = "UP!!!";
        resultArea.classList.add("up");
        resultArea.classList.remove("down");

    } else if(userValue > randomNum){
        resultArea.textContent = "Down!!!";
        resultArea.classList.add("down");
        resultArea.classList.remove("up");

    } else {
        resultArea.textContent = "정답이래요!!!" ;
        gameOver = true;
        playBtn.disabled = true; // 정답일 경우 GO버튼 비활성화
    };

    // 유저가 입력한 값 저장하기
    historyArr.push(userValue);
    console.log(historyArr);

    if(chances < 1 ){
        gameOver = true;
    };

    if(gameOver == true) {
        playBtn.disabled = true;
    }
}


// 리셋 버튼
function reset() {
    pickRandomNum()
    chances = 5;
    userInput.value = "";
    resultArea.textContent = "";
    chanceArea.textContent = `남은기회 : ${chances}`;
    playBtn.disabled = false;
    historyArr = [];

}

pickRandomNum();