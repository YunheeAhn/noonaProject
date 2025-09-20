//********** S : API 설정 **********//
// API KEY 변수 저장
const API_KEY = "96079dbac224485cb7775442e96e2c56";

// News api (로컬 확인용)
// const newsAPI = "https://newsapi.org/v2/top-headlines?country=us";

// Noona api (배포용)
const newsAPI = "https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr";

// 뉴스 전역변수
let newsList = [];

// URL 전역변수
let BASE_URL = new URL(`${newsAPI}&apiKey=${API_KEY}`);
//********** E : API 설정 **********//

//********** S : 뉴스 데이터 호출 **********//
const getNews = async () => {
  try {
    // url 호출하기
    const response = await fetch(BASE_URL);
    const data = await response.json();

    // 상태 코드 확인
    if (response.status === 200) {
      if (data.articles.length === 0) {
        throw new Error("No result for this search"); // 검색 결과 없음
      }

      // 뉴스 따로 저장
      newsList = data.articles;
      render();
    } else {
      throw new Error(data.message); // 에러 상황
    }
  } catch (error) {
    errorRender(error.message); // 에러 메시지 출력
  }
};
//********** E : 뉴스 데이터 호출 **********//

//********** S : 기본 설정 **********//
// 이미지 없거나 링크 잘못된 경우 대체 이미지
const defaultImage =
  "https://img.freepik.com/premium-vector/green-start-button_875240-2897.jpg?w=1480";

// 메뉴 가져오기 + 클릭 이벤트 등록
const menus = document.querySelectorAll(".menus li a");
menus.forEach((menu) => menu.addEventListener("click", (event) => getNewsCategory(event)));

// 최신 뉴스 가져오기
const getLatestNews = async () => {
  BASE_URL = new URL(`${newsAPI}&apiKey=${API_KEY}`);
  getNews();
  console.log("뉴스생성", newsList);
};
//********** E : 기본 설정 **********//

//********** S : 뉴스 내용 render **********//
const render = () => {
  const newsHTML = newsList
    .map((news) => {
      return `
        <div class="box">
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
//********** E : 뉴스 내용 render **********//

//********** S : 에러 메세지 render **********//
const errorRender = (errorMessage) => {
  const errorHTML = `<div class="alert"><p>${errorMessage}</p></div>`;
  document.getElementById("news-board").innerHTML = errorHTML;
};
//********** E : 에러 메세지 render **********//

//********** S : 검색 핸들링 **********//
// 카테고리별 뉴스 가져오기
const getNewsCategory = async (event) => {
  const category = event.target.textContent.toLowerCase();
  BASE_URL = new URL(`${newsAPI}&category=${category}&apiKey=${API_KEY}`);
  getNews();
};

// 검색창 요소
const searchInput = document.getElementById("searchInput");

// 포커스 시 입력 초기화
function clearInput() {
  searchInput.value = "";
}

// 인풋창 엔터 입력
searchInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    getNewsByKeyword();
  }
});

// 키워드 검색
const getNewsByKeyword = async () => {
  const keyword = searchInput.value;
  BASE_URL = new URL(`${newsAPI}&q=${keyword}&apiKey=${API_KEY}`);
  getNews();
};
//********** E : 검색 핸들링 **********//

//********** S : 모바일 UI **********//
// 모바일 메뉴
const menuBtn = document.querySelector(".mobile_menu > .btn"); // 열기 버튼
const menuInner = document.querySelector(".mobile_menu > .inner"); // 메뉴 영역
const closeBtn = document.querySelector(".mobile_menu .close_btn"); // 닫기 버튼

// 열기
menuBtn.addEventListener("click", () => {
  menuInner.classList.add("show");
});

// 닫기
closeBtn.addEventListener("click", () => {
  menuInner.classList.remove("show");
});

// 검색 버튼 활성화
const searchIcon = document.querySelector(".search_wrap > .search_icon");
const inputWrap = document.querySelector(".search_wrap > .input_wrap");

// 검색 아이콘 클릭 시 input_wrap 토글
searchIcon.addEventListener("click", () => {
  inputWrap.classList.toggle("show");
});

// gotoTop 버튼
const gotoTop = document.querySelector(".gotoTop");
const topBtn = document.querySelector(".gotoTop .top");

// 스크롤 시 버튼 보이기/숨기기
window.addEventListener("scroll", () => {
  if (window.scrollY > 200) {
    gotoTop.classList.add("show");
  } else {
    gotoTop.classList.remove("show");
  }
});

// 버튼 클릭 시 위로 스무스 이동
topBtn.addEventListener("click", (event) => {
  event.preventDefault();
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});
//********** E : 모바일 UI **********//

//********** 실행 **********//
getLatestNews();
