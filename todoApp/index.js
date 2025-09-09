// 유저가 값을 입력 한다
// +버튼을 클릭하면 할일이 추가 된다
// delete버튼을 누르면 할일이 삭제된다
// check 버튼을 누르면 할일 완료 형태로 변한다
// 진행중 끝남 탭을 누르면, 언더바가 이동한다
// 끝남탭은 끝난일들만, 진행 중 탭은 진행중인 일들만
// 전체탭을 누르면 다시 전체 일들이 보여짐

let taskInput = document.getElementById("taskInput");
let addBtn = document.getElementById("addBtn");
let taskList = [];

// 할일 추가하기
function addTask() {
    let taskContent = taskInput.value
    
    // taskInput에 아무것도 안써있으면
    if(taskContent === ""){
        //할일 입력 해달라는 얼럿창 발생
        alert('할일을 입력해주세요')
        return;
    } 
    // 그게아니면 렌더
    taskList.push(taskContent)
    render(); // 추가하기 버튼 누르면 화면에 그리기 실행

}

// 인풋창 포커스시 입력 초기화
function clearInput() {
    taskInput.value = "";
}

// 추가한 할일 화면에 그리기
function render(){
    let resultHtml = "";
    for(let i = 0; i < taskList.length; i++ ){
        resultHtml += `<div class="task">
                <p>${taskList[i]}</p>
                <div class="tButton_wrap">
                  <button class="checkBtn" id="checkBtn">
                    <span class="material-icons"> check </span>
                  </button>
                  <button class="deleteBtn" id="deleteBtn">
                    <span class="material-icons"> close </span>
                  </button>
                </div>
              </div>`;
    }

    document.getElementById("taskBoard").innerHTML = resultHtml;
}

render();


