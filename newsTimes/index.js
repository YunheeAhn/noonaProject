// API KEY 변수 저장
const API_KEY = "96079dbac224485cb7775442e96e2c56";

// 뉴스 전역변수로 선언
let newsList = [];


// 뉴스 정보 가져오기
const getLatestNews = async () => {
    // URL 인스턴스를 활용해서 api 주소를 만들기
    // news api는 배포사이트에선 안보임, 로컬에서만 가능
    // const url = new URL(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`);
    
    // 누나 api 주소 만들기
    const url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=us&apiKey=${API_KEY}`);
    // url 호출하기
    const response = await fetch(url);
    // json형식으로 data로 가져오기
    const data = await response.json();

    // 뉴스 따로 저장
    newsList = data.articles;

    render();  
    
    
    console.log("뉴스생성",newsList)
}



const render = () => {
    const newsHTML = newsList.map(
        (news) => {
            return `<div class="box">
        <h2>${news.title}</h2>
        <p>${news.description ? news.description : "내용이 존재하지 않습니다"}</p>
      </div>`
        }
    ).join('');

    document.getElementById("news-board").innerHTML = newsHTML;
}

getLatestNews();


