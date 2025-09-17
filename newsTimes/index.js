// API KEY 변수 저장
const API_KEY = "96079dbac224485cb7775442e96e2c56";

// 뉴스 전역변수로 선언
let newsList = [];

// 이미지가 없거나, 링크가 잘못 되었을 경우 대체 이미지
const defaultImage =
  "https://img.freepik.com/premium-vector/green-start-button_875240-2897.jpg?w=1480";

// 뉴스 정보 가져오기
const getLatestNews = async () => {
  // URL 인스턴스를 활용해서 api 주소를 만들기
  // news api는 배포사이트에선 안보임, 로컬에서만 가능
  //   const url = new URL(`https://newsapi.org/v2/top-headlines?country=us&q&apiKey=${API_KEY}`);

  // 누나 api 주소 만들기
  const url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=us&apiKey=${API_KEY}`
  );
  // url 호출하기
  const response = await fetch(url);
  // json형식으로 data로 가져오기
  const data = await response.json();

  // 뉴스 따로 저장
  newsList = data.articles;

  render();

  console.log("뉴스생성", newsList);
};

// <img src="${news.urlToImage || defaultImage}" alt="${news.title}"/>
const render = () => {
  const newsHTML = newsList
    .map((news) => {
      return `<div class="box">
        <a href="" target="_blank">
            <div class="img_cont">
                <img src="${news.urlToImage}"
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
                      ? news.description.substr(0, 200) + "..."
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

getLatestNews();
