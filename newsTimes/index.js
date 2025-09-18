// API KEY 변수 저장
const API_KEY = "96079dbac224485cb7775442e96e2c56";
// News api (로컬확인용)
// const newsAPI = "https://newsapi.org/v2/top-headlines?country=us";
// Noona api (배포용)
const newsAPI = "https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr";

// 뉴스 전역변수로 선언
let newsList = [];

// URL 전역변수로 선언
let BASE_URL = new URL(`${newsAPI}&apiKey=${API_KEY}`);

// url 호출
const getUrl = async () => {
  // url 호출하기
  const response = await fetch(BASE_URL);
  // json형식으로 data로 가져오기
  const data = await response.json();
  // 뉴스 따로 저장
  newsList = data.articles;

  render();
};

// 이미지가 없거나, 링크가 잘못 되었을 경우 대체 이미지
const defaultImage =
  "https://img.freepik.com/premium-vector/green-start-button_875240-2897.jpg?w=1480";

// 메뉴 가져오기
// 메뉴에 클릭이벤트
const menus = document.querySelectorAll(".menus li a");
menus.forEach((menu) => menu.addEventListener("click", (event) => getNewsCatagory(event)));

// 뉴스 정보 가져오기
const getLatestNews = async () => {
  // news api는 배포사이트에선 안보임, 로컬에서만 가능
  // 상단 변수 분리로 선택 용이하게 수정
  BASE_URL = new URL(`${newsAPI}&apiKey=${API_KEY}`);

  getUrl();

  console.log("뉴스생성", newsList);
};

const render = () => {
  const newsHTML = newsList
    .map((news) => {
      return `<div class="box">
        <a target="_blank" href="${news.url}">
            <div class="img_cont">
                <img src="${news.urlToImage || defaultImage}" alt="${news.title}"
     onerror="this.onerror=null; this.src='${defaultImage}';"/>
            </div>
            <div class="txt_cont">
                <span class="cate">${news.category ? news.category : ""}</span>
                <h2 class="title">${news.title}</h2>
                <p class="cont">
                  ${
                    news.description == null || news.description == ""
                      ? "내용없음"
                      : news.description.length > 200
                      ? news.description.slice(0, 200) + "..."
                      : news.description
                  }
                </p>
                <div class="source">
                    <p class="company">${news.source.name ? news.source.name : "No Sources"}</p>
                    <p class="date">${moment(news.publishedAt).fromNow()}</p>
                </div>
            </div>
        </a>
        </div>`;
    })
    .join("");

  document.getElementById("news-board").innerHTML = newsHTML;
};

// 카테고리별 뉴스 가져오기
const getNewsCatagory = async (event) => {
  //  카테고리 읽어오기
  const category = event.target.textContent.toLowerCase();

  // 상단 변수 분리로 선택 용이하게 수정
  BASE_URL = new URL(`${newsAPI}&category=${category}&apiKey=${API_KEY}`);

  getUrl();
};

const searchInput = document.getElementById("searchInput");
// 인풋창 포커스시 입력 초기화
function clearInput() {
  searchInput.value = "";
}
// 인풋창 엔터 입력
searchInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    getNewsByKeyword();
  }
});

const getNewsByKeyword = async () => {
  // search 인풋 값 가져오기
  const keyword = searchInput.value;

  // 상단 변수 분리로 선택 용이하게 수정
  BASE_URL = new URL(`${newsAPI}&q=${keyword}&apiKey=${API_KEY}`);

  getUrl();
};

// 모바일 메뉴
const menuBtn = document.querySelector(".mobile_menu > .btn"); // 열기 버튼
const menuInner = document.querySelector(".mobile_menu > .inner"); // 메뉴 영역
const closeBtn = document.querySelector(".mobile_menu .close_btn"); // 닫기 버튼

// 모바일메뉴 열기
menuBtn.addEventListener("click", () => {
  menuInner.classList.add("show");
});

// 모바일메뉴 닫기
closeBtn.addEventListener("click", () => {
  menuInner.classList.remove("show");
});

// 검색 버튼 활성화
const searchIcon = document.querySelector(".search_wrap > .search_icon");
const inputWrap = document.querySelector(".search_wrap > .input_wrap");

// 아이콘 클릭 시 input_wrap 토글
searchIcon.addEventListener("click", () => {
  inputWrap.classList.toggle("show");
});

// gotoTop 버튼 이벤트
const gotoTop = document.querySelector(".gotoTop");
const topBtn = document.querySelector(".gotoTop .top");
// 스크롤 이벤트로 버튼 보이기/숨기기
window.addEventListener("scroll", () => {
  if (window.scrollY > 200) {
    // 스크롤이 200px 넘으면 보이기
    gotoTop.classList.add("show");
  } else {
    gotoTop.classList.remove("show");
  }
});

// 버튼 클릭 시 위로 스무스하게 이동
topBtn.addEventListener("click", (event) => {
  event.preventDefault();
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

getLatestNews();
