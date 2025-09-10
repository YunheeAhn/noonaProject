// 유저가 값을 입력 한다
// +버튼을 클릭하면 할일이 추가 된다
// delete버튼을 누르면 할일이 삭제된다
// check 버튼을 누르면 할일 완료 형태로 변한다
// 1. check 버튼을 클릭하는 순간 false->true로 변경
// 2. true면 끝난 것으로 간주하고 div.task 태그에 finish 클래스명 붙이기(끝남표시)
// 3. false면 안 끝난 것으로 간주하고 div.task태그에 finish 클래스명 제거

// 진행중 끝남 탭을 누르면, 언더바가 이동한다
// 끝남탭은 끝난일들만, 진행 중 탭은 진행중인 일들만
// 전체탭을 누르면 다시 전체 일들이 보여짐

let taskInput = document.getElementById("taskInput");
let addBtn = document.getElementById("addBtn");
let checkBtn = document.getElementById("checkBtn");
let deleteBtn = document.getElementById("deleteBtn");

let tabs = document.querySelectorAll(".tabs");
let mode = 'all'; // 초기 세팅 값은 모두 보여주기
let filterList = [];

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


let taskList = [];
// 할일 추가하기
function addTask() {
    // 완료 버튼 이벤트를 위한 객체 생성
    // 왜 객체인가? 아이템이 끝났는지 안 끝났는지에 대한 정보를 모든 task가 갖고 있어야 함
    // 스트링 타입으로는 표현이 안됨, 각각의 정보에 스트링 + 추가 정보를 넣어주기 위함
    let task = {
      // 각각의 아이템에 유니크 id부여
      id : randomIDGenerate(), 
      // 유저가 입력한 할 일 내용
      taskContent : taskInput.value,
      // 할 일의 완료 여부
      isComplete : false,
    };
    
    // taskInput에 아무것도 안써있으면
    if(task.taskContent === ""){
      //할일 입력 해달라는 얼럿창 발생
      alert('할일을 입력해주세요')
      return;
    } ;

    // 그게아니면 렌더
    taskList.push(task) ;
    render(); // 추가하기 버튼 누르면 화면에 그리기 실행
    
    taskInput.value = "";

    console.log(taskList);
}

// 인풋창 포커스시 입력 초기화
function clearInput() {
    taskInput.value = "";
}

// 추가한 할일 화면에 그리기
function render(){
  // 선택한 탭에 따른 리스트 변경
  // 1. 내가 선택한 탭에 대한 정보 가져오기 (mode 값 가져오기)
  // 2. 리스트를 다르게 보여준다
  let list = [];
  if(mode === "all" ){
    // 전체 taskList 보여주기
    list = taskList;

  } else if(mode === "ongoing"){
    // filterList 보여주기
    list = filterList;
  } else if(mode === "done"){
    
    list = filterList;
  }

  let resultHtml = "";
  
  for(let i = 0; i < list.length; i++ ){
    if(list[i].isComplete == true) {
      // isComplete이 true 이면 .finish 붙이기
    resultHtml += `<div class="task finish">
        <p>${list[i].taskContent}</p> 
        <div class="tButton_wrap">
          <button class="checkBtn" onclick="toggleComplete('${list[i].id}')">
            <span class="material-icons"> replay </span>
          </button>
          <button class="deleteBtn" onclick="deleteTask('${list[i].id}')">
            <span class="material-icons"> close </span>
          </button>
        </div>
      </div>`;
    }else {
    // task 객체의 taskContent만 프린트 ->list i번째의 taskContent
    resultHtml += `<div class="task">
        <p>${list[i].taskContent}</p> 
        <div class="tButton_wrap">
          <button class="checkBtn" onclick="toggleComplete('${list[i].id}')">
            <span class="material-icons"> check </span>
          </button>
          <button class="deleteBtn" onclick="deleteTask('${list[i].id}')">
            <span class="material-icons"> close </span>
          </button>
        </div>
      </div>`;
    };



    
  };
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
  console.log(taskList);
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

// filter(event) 함수
function filter(event) {
  console.log("filter",event.target.id);
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

// 유니크 랜덤 id 만들기 함수
function randomIDGenerate(){
  return '_' + Math.random().toString(36).substr(2, 9);
}



render();


