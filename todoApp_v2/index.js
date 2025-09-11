// 할일과 마감일 선택 후 +버튼 누르면 할일 등록
// 할일은 필수입력, 마감일은 선택입력 (할일 미입력시 alert창 생성)
// 할일 엔터키로 입력 가능

// 마감일에 따른 task::before UI 변경
// 당일 혹은 지난 경우 : red컬러
// 7일 이내 : orange컬러
// 그 외 : green 컬러 
// 빠른 날짜 순으로 task정렬

// 수정 버튼 누르면 할일과 마감일 재설정 가능
// 수정버튼이 확인 버튼으로 바뀜, 내용 수정 후 확인 버튼 누르면 수정된 내용으로 변경

// 삭제 버튼 누르면 할일 내용 전체 삭제

// 맨 앞의 체크 버튼 클릭시 완료 내용으로 표시

// 전체, 진행중, 완료 탭에 맞는 결과물만 출력
// 진행중 탭에서 맨 앞 체크 버튼 클릭시 완료 UI 변경 및 완료 탭으로 이동
// 각 탭에서 해당하는 클릭 이벤트 진행 시 UI변경 및 맞는 탭으로 바로 이동



let taskInput = document.getElementById("taskInput");
let dateInput = document.getElementById("dateInput");
let addBtn = document.getElementById("addBtn");
let checkBtn = document.getElementById("checkBtn");
let deleteBtn = document.getElementById("deleteBtn");
let editBtn = document.getElementById("editBtn");

let tabs = document.querySelectorAll(".tabs");

let mode = "all"; // 기본 탭은 전체보기
let filterList = [];


// 유니크 랜덤 id 만들기 함수
function randomIDGenerate(){
  return '_' + Math.random().toString(36).substr(2, 9);
}


// 탭 이벤트
for(let i = 0; i < tabs.length; i++) {
  tabs[i].addEventListener("click", function(event){

    // 모든 탭에서 on 제거
    tabs.forEach(tab => tab.classList.remove("on"));
    // 클릭한 탭에 on 추가
    event.currentTarget.classList.add("on");

    // 여기서 탭별 필터링 함수 호출
    filter(event);
  });
}

// 오늘날짜로 세팅하기
const nowDate = new Date();

let currentYear = nowDate.getFullYear();
let currentMonth = String((nowDate.getMonth()+1)).padStart(2,"0")
let currentDate = String(nowDate.getDate()).padStart(2,"0")

// 새로고침했을 때 오늘 날짜를 자동으로 세팅
dateInput.value = `${currentYear}-${currentMonth}-${currentDate}`;


// 할일 추가하기
let taskList = [] ;
let dateContent = "";

function addTask() {
    // 완료 버튼 이벤트를 위한 객체 생성
    // 왜 객체인가? 아이템이 끝났는지 안 끝났는지에 대한 정보를 모든 task가 갖고 있어야 함
    // 스트링 타입으로는 표현이 안됨, 각각의 정보에 스트링 + 추가 정보를 넣어주기 위함
    let task = {
        // 랜덤한 유니크ID
        id : randomIDGenerate(),
        // 유저가 입력한 할 일
        taskContent : taskInput.value,
        // 할 일의 완료 여부
        isComplete : false,
        // 날짜 값 가져오기
        dateContent : dateInput.value,
    };

    // taskInput에 아무것도 안써있으면
    if(task.taskContent === ""){
      //할일 입력 해달라는 얼럿창 발생
      alert('할일을 입력해주세요')
      return;
    } ;

    taskList.push(task);
    // 날짜 내림차순 정렬 sort()함수
    taskList.sort((a, b) => new Date(a.dateContent) - new Date(b.dateContent));
    render(); // 추가하기 버튼 누르면 화면에 그리기 실행
    // 입력창 자동으로 비우기
    taskInput.value = "";

    console.log(task);
}

// 할일 추가 할 때 엔터키로 입력하기
taskInput.addEventListener("keypress", function(event){
  if(event.key === "Enter"){
    addTask();
  }
});

// 마감일에 따른 색상 변화
function getDateClass(dueDate) {
  let today = new Date();
  let dDay = new Date(dueDate);
  
  // 하루 단위 차이 계산
  let diff = Math.ceil((dDay - today) / (1000 * 60 * 60 * 24));
  
  if (diff <= 0) return "sooner"; // 오늘
  if (diff <= 7) return "spare";  // 7일 이내
  return "";               // 7일 초과
}



// 추가한 할일 화면에 그리기
function render() {
// 선택한 탭에 따른 리스트 변경
    // 1. 내가 선택한 탭에 대한 정보 가져오기 (mode 값 가져오기)
    // 2. 리스트를 다르게 보여준다
    let list = [];
    if (mode === "all") {
        list = taskList;
    } else if (mode === "ongoing") {
        list = taskList.filter((task) => !task.isComplete);
    } else if (mode === "done") {
        list = taskList.filter((task) => task.isComplete);
    }

    let resultHtml = "";

    for (let i = 0; i < list.length; i++) {
        // 삼항연산자로 변경
        let taskClass = list[i].isComplete ? "finish" : "";
        let dateClass = getDateClass(list[i].dateContent);
        let icon = list[i].isComplete ? "replay" : "check";

        resultHtml += `
        <div class="task ${taskClass} ${dateClass}">
            <button class="checkBtn" onclick="toggleComplete('${list[i].id}')">
            <span class="material-icons">${icon}</span>
            </button>
            <div class="text_Wrap">
            <h2 class="tTit">${list[i].taskContent}</h2>
            <span class="date">${list[i].dateContent}</span>
            </div>
            <div class="tButton_wrap">
            <button class="editBtn" onclick="toggleEdit('${list[i].id}', this)">
                <span class="material-icons">edit</span>
            </button>
            <button class="deleteBtn" onclick="deleteTask('${list[i].id}')">
                <span class="material-icons">delete</span>
            </button>
            </div>
        </div>`;
    }

  document.getElementById("taskBoard").innerHTML = resultHtml;
}

// 체크버튼 클릭 이벤트
function toggleComplete(id) {

  // 어떤 task의 체크버튼을 클릭했는지 찾기
  for(let i = 0; i < taskList.length; i++) {
    if(taskList[i].id == id){
      // !연산자 : Not -> 반대 값을 가져옴 fasle면 true, true면 false
      taskList[i].isComplete = !taskList[i].isComplete;
      break;
    } 
  };

  render(); //이벤트가 실행이 되면 함수 불러주기
}

// 삭제 버튼 클릭 이벤트
function  deleteTask(id) {
  // 어떤 task의 삭제버튼 클릭했는지 찾기
  // .splice()

  for(let i = 0; i < taskList.length; i++) {
    if(taskList[i].id == id){
      taskList.splice(i,1)
      break;
    };
  };
  
  render(); //이벤트가 실행이 되면 함수 불러주기
}

// 현재 수정 중인 task id 저장
let editingId = null; 

function toggleEdit(id, btn) {
  let task = taskList.find((t) => t.id === id);
  let taskDiv = btn.closest(".task");
  let titleEl = taskDiv.querySelector(".tTit");
  let dateEl = taskDiv.querySelector(".date");

  // 다른 task 수정 중이면 초기화
  if (editingId && editingId !== id) {
    render();
    editingId = null;
  }

  if (btn.querySelector("span").textContent === "edit") {
    editingId = id;

    // 제목 input
    let titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.value = task.taskContent;
    titleInput.classList.add("edit-title");

    // 날짜 input
    let dateInput = document.createElement("input");
    dateInput.type = "date";
    dateInput.value = task.dateContent;
    dateInput.classList.add("edit-date");

    taskDiv.querySelector(".text_Wrap").replaceChild(titleInput, titleEl);
    taskDiv.querySelector(".text_Wrap").replaceChild(dateInput, dateEl);

    btn.querySelector("span").textContent = "check";
  } else {
    let titleInput = taskDiv.querySelector(".edit-title");
    let dateInput = taskDiv.querySelector(".edit-date");

    if (!titleInput.value.trim()) {
      alert("할 일을 입력해주세요!");
      return;
    }

    // 값 저장
    task.taskContent = titleInput.value;
    task.dateContent = dateInput.value;

    taskList.sort((a, b) => new Date(a.dateContent) - new Date(b.dateContent));

    editingId = null;
    render();
  }
}



// filter(event) 함수
function filter(event) {
  // console.log("filter",event.target.id);
  // div.tabs의 id="" 값 가져오기
  // let mode = event.target.id -> 상단의 render() 함수에서 알 수 있도록 전역 변수로 변경
  mode = event.target.id;
  // 필터링된 리스트
  filterList = [];

  if(mode === "all"){
    // 모두
    // 전체 task 아이템을 보여준다
    render();
  } else if(mode === "ongoing") {
    // 진행중
    // task.isComplete = false 아이템
    for(let i = 0; i < taskList.length; i++ ){
      if(taskList[i].isComplete === false) {
        filterList.push(taskList[i]);
      }
    }
    render();
    console.log("진행중",filterList)

  } else if(mode === "done") {
    // 끝남
    // task.isComplete = true 아이템
    for(let i = 0; i < taskList.length; i++ ){
      if(taskList[i].isComplete === true) {
        filterList.push(taskList[i]);
      }
    }
    render();
    console.log("완료됨",filterList)
  }
}

// 인풋창 포커스시 입력 초기화
function clearInput() {
    taskInput.value = "";
}

