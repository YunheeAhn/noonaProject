//********** S : API 설정 **********//
// API KEY 변수 저장
const API_KEY = "96079dbac224485cb7775442e96e2c56";

// News api (로컬 확인용)
// const newsAPI = "https://newsapi.org/v2/top-headlines?country=us";

// Noona api (배포용)
const newsAPI = "https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr";

// URL 전역변수
let BASE_URL = new URL(`${newsAPI}&apiKey=${API_KEY}`);
//********** E : API 설정 **********//

//********** S : 뉴스 호출 관련 전역변수 **********//
// 뉴스 전역변수
let newsList = [];

// total result 전역변수
let totalResults = 0;

// 페이지 정보
let page = 1; // 페이지 기본 값
const pageSize = 10; // 한 페이지에 보여질 기사의 수
const groupSize = 5; // 한번에 보여질 페이지네이션의 수
//********** E : 뉴스 호출 관련 전역변수 **********//

//********** S : 뉴스 데이터 호출 **********//
const getNews = async () => {
  try {
    // url 호출하기
    // 파라미터를 먼저 호출하고
    BASE_URL.searchParams.set("page", page); // 페이지를 파라미터로 설정하기
    BASE_URL.searchParams.set("pagesize", pageSize); // 페이지 사이즈 파라미터로 설정하기
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
      totalResults = data.totalResults;
      // 페이지 번호 1로 초기화
      page = 1;
      render();
      paginationRender();
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
  // 페이지 번호 1로 초기화
  page = 1;
  BASE_URL = new URL(`${newsAPI}&apiKey=${API_KEY}`);
  getNews();
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

//********** S : 페이지네이션 **********//
const paginationRender = () => {
  const totalPages = Math.ceil(totalResults / pageSize);
  const pageGroup = Math.ceil(page / groupSize);

  // 현재 그룹의 마지막 페이지
  let lastPage = pageGroup * groupSize;

  // 마지막 페이지가 그룹 사이즈(5)보다 작으면 5까지 X
  if (lastPage > totalPages) {
    lastPage = totalPages;
  }

  // 현재 그룹의 첫 번째 페이지
  let firstPage = lastPage - (groupSize - 1) <= 0 ? 1 : lastPage - (groupSize - 1);

  // 전체 페이지가 5개 이하인 경우 3개만 보여주기
  // if (totalPages <= 5) {
  //   firstPage = Math.max(1, page - 1);
  //   lastPage = Math.min(totalPages, firstPage + 2);
  // }

  //********** S : 이전 버튼 **********//
  // 페이지 생성 변수 초기화
  let paginationHTML = ``;
  // 첫번째 페이지인 경우 prev 버튼 안보임
  if (page > 1) {
    paginationHTML = `<li class="page-item double-prev">
    <a href="#" class="page-link" onclick="moveToPage(1)">
    <span class="material-icons">keyboard_double_arrow_left</span>
    </a>
    </li>
    <li class="page-item prev">
    <a href="#" class="page-link" onclick="moveToPage(${page - 1})">
    <span class="material-icons">keyboard_arrow_left</span>
    </a>
    </li>`;
  }
  //********** E : 이전 버튼 **********//

  //********** S : 페이지 번호 **********//
  for (let i = firstPage; i <= lastPage; i++) {
    paginationHTML += `<li class="page-item ${i === page ? "active" : ""}">
    <a href="#" class="page-link" onclick="moveToPage(${i})">
    <span>${i}</span>
    </a>
    </li>`;
  }
  //********** E : 페이지 번호 **********//

  //********** S : 다음 버튼 **********//
  // 마지막 페이지인 경우 next 버튼 안보임
  if (page < totalPages) {
    paginationHTML += `<li class="page-item next">
        <a href="#" class="page-link" onclick="moveToPage(${page + 1})">
          <span class="material-icons">keyboard_arrow_right</span>
        </a>
      </li>
      <li class="page-item double-next">
        <a href="#" class="page-link" onclick="moveToPage(${totalPages})">
          <span class="material-icons">keyboard_double_arrow_right</span>
        </a>
      </li>`;
  }
  //********** E : 다음 버튼 **********//

  document.querySelector(".pagination").innerHTML = paginationHTML;
};

// a링크 페이지 이동하기
const moveToPage = (pageNum) => {
  page = pageNum;
  getNews();
};

//********** E : 페이지네이션 **********//

//********** S : 검색 핸들링 **********//
// 카테고리별 뉴스 가져오기
const getNewsCategory = async (event) => {
  const category = event.target.textContent.toLowerCase();
  BASE_URL = new URL(`${newsAPI}&category=${category}&apiKey=${API_KEY}`);
  // 페이지 번호 1로 초기화
  page = 1;
  getNews();

  // 카테고리 눌러서 뉴스 가져오면 모바일 메뉴 사라지기
  menuInner.classList.remove("show");
  grayMask.classList.remove("show");
};

// 검색창 요소
const searchInput = document.getElementById("searchInput");

// 포커스 시 입력 초기화
function clearInput() {
  searchInput.value = "";
}

// 인풋창 엔터 입력
searchInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    getNewsByKeyword();
  }
});

// 키워드 검색
const getNewsByKeyword = async () => {
  const keyword = searchInput.value;
  BASE_URL = new URL(`${newsAPI}&q=${keyword}&apiKey=${API_KEY}`);
  // 페이지 번호 1로 초기화
  page = 1;
  getNews();
};
//********** E : 검색 핸들링 **********//

//********** S : 모바일 UI **********//
// 모바일 메뉴
const menuBtn = document.querySelector(".mobile_menu > .btn"); // 열기 버튼
const menuInner = document.querySelector(".mobile_menu > .inner"); // 메뉴 영역
const grayMask = document.querySelector(".mobile_menu > .grayMask"); // graymask 영역
const closeBtn = document.querySelector(".mobile_menu .close_btn"); // 닫기 버튼

// 열기
menuBtn.addEventListener("click", () => {
  menuInner.classList.add("show");
  grayMask.classList.add("show");
});

// 닫기
closeBtn.addEventListener("click", () => {
  menuInner.classList.remove("show");
  grayMask.classList.remove("show");
});

grayMask.addEventListener("click", () => {
  menuInner.classList.remove("show");
  grayMask.classList.remove("show");
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
