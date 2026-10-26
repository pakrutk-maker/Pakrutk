/* =========================================================
   1. 수행평가 필수 제출 지정 변수 및 선택자 (이미지 기준 100% 일치)
   ========================================================= */
const id = "pakrutk";
const pw = "helloworld";

// 로그인 로직 (#loginForm, #user_Id, #user_Pw)
const loginForm = document.querySelector("#loginForm");
loginForm.onsubmit = function (e) {
    e.preventDefault(); // 페이지 새로고침 방지

    const inputId = document.querySelector("#user_Id").value;
    const inputPw = document.querySelector("#user_Pw").value;

    if (inputId === id && inputPw === pw) {
        alert("로그인 성공!");
        // 사이드바 영역을 회원 프로필 화면으로 업데이트
        const loginContainer = document.querySelector(".login-box-content");
        loginContainer.innerHTML = `
            <h3>👤 내 프로필</h3>
            <div class="user-profile">
                <p class="welcome-text">환영합니다!<br><strong>${inputId}</strong>님</p>
                <span class="user-badge">VIP PREMIUM MEMBER</span>
            </div>
        `;
    } else {
        alert("로그인 실패: 아이디 또는 비밀번호가 틀렸습니다.");
    }
};

// 카운터 로직 (#counter, #count_number)
let counter = document.querySelector("#counter");
let number = 0;
let count_number = document.querySelector("#count_number");
counter.onclick = function () {
    number = number + 1;
    count_number.textContent = number + "번 클릭";
};

// 색 바꾸기 로직 (#text_message)
let text_message = document.querySelector('#text_message');
text_message.onclick = function () {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    text_message.style.color = 'rgb(' + r + ',' + g + ',' + b + ')';
    text_message.style.borderColor = 'rgb(' + r + ',' + g + ',' + b + ')';
};


/* =========================================================
   2. 추가 동적 웹사이트 기능 (영화 데이터, 검색, 필터, 모달, 찜하기)
   ========================================================= */

// 영화 샘플 데이터베이스
const moviesData = [
    {
        id: 1,
        title: "인터스텔라",
        director: "크리스토퍼 놀란",
        genre: "SF",
        rating: 9.5,
        badge: "추천",
        poster: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=400&q=80",
        description: "세계 각국의 식량 위기와 인류 멸망의 위기 속에서 시공간을 넘어 우주로 떠나는 탐사대원들의 장대한 여정을 그린 SF 명작."
    },
    {
        id: 2,
        title: "다크 나이트",
        director: "크리스토퍼 놀란",
        genre: "액션",
        rating: 9.3,
        badge: "BEST",
        poster: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=400&q=80",
        description: "고담시의 평화를 지키려는 배트맨과 절대적인 혼돈을 불러일으키는 조커의 치열한 대결을 다룬 범죄 액션 블록버스터."
    },
    {
        id: 3,
        title: "기생충",
        director: "봉준호",
        genre: "드라마",
        rating: 9.1,
        badge: "HOT",
        poster: "https://images.unsplash.com/photo-1518676599602-2170e3d75995?auto=format&fit=crop&w=400&q=80",
        description: "전원백수인 기택네 장남 기우가 고액 과외 면접을 위해 박사장네 집에 발을 들이면서 시작되는 두 가족의 겉잡을 수 없는 사건."
    },
    {
        id: 4,
        title: "인셉션",
        director: "크리스토퍼 놀란",
        genre: "SF",
        rating: 9.2,
        badge: "추천",
        poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=400&q=80",
        description: "타인의 꿈에 침투하여 비밀을 추출하거나 생각을 식재하는 정보 추출 전문가들의 초현실적인 미션을 그린 영화."
    },
    {
        id: 5,
        title: "쇼생크 탈출",
        director: "프랭크 다라본트",
        genre: "드라마",
        rating: 9.4,
        badge: "명작",
        poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=400&q=80",
        description: "누명을 쓰고 악명 높은 쇼생크 교도소에 갇힌 은행가 앤디가 희망을 잃지 않고 자유를 향해 나아가는 감동적인 드라마."
    },
    {
        id: 6,
        title: "범죄도시",
        director: "강윤성",
        genre: "스릴러",
        rating: 8.8,
        badge: "인기",
        poster: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=400&q=80",
        description: "하얼빈에서 넘어와 단숨에 기선을 제압한 신흥범죄조직의 악랄한 조직원들을 한방에 소탕하는 형사들의 통쾌한 조폭 소탕 작전."
    }
];

// 찜한 목록 저장 세트
const bookmarkedMovies = new Set();

// 영화 카드 동적 렌더링 함수
function renderMovies(movieList) {
    const gridContainer = document.querySelector("#movie-grid");
    gridContainer.innerHTML = "";

    if (movieList.length === 0) {
        gridContainer.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #888; padding: 40px;">검색 결과가 없습니다.</p>`;
        return;
    }

    movieList.forEach(movie => {
        const isFav = bookmarkedMovies.has(movie.id);
        const cardEl = document.createElement("div");
        cardEl.className = "movie-card";
        cardEl.innerHTML = `
            <div class="thumbnail-wrapper">
                <img src="${movie.poster}" alt="${movie.title} 포스터">
                <span class="badge">${movie.badge}</span>
                <div class="fav-heart ${isFav ? 'active' : ''}" onclick="toggleBookmark(event, ${movie.id})">
                    ${isFav ? '❤️' : '🤍'}
                </div>
            </div>
            <div class="movie-info">
                <h3 class="movie-title">${movie.title}</h3>
                <p class="movie-director">${movie.director} 감독</p>
                <div class="movie-meta">
                    <span class="genre-tag">${movie.genre}</span>
                    <span class="rating">⭐ ${movie.rating}</span>
                </div>
            </div>
        `;

        // 카드 클릭 시 상세 모달 열기
        cardEl.addEventListener("click", () => openMovieModal(movie));
        gridContainer.appendChild(cardEl);
    });
}

// 실시간 검색 기능
const searchInput = document.querySelector("#search-input");
const searchBtn = document.querySelector("#search-btn");

function handleSearch() {
    const query = searchInput.value.toLowerCase().trim();
    const filtered = moviesData.filter(movie => 
        movie.title.toLowerCase().includes(query) || 
        movie.director.toLowerCase().includes(query)
    );
    renderMovies(filtered);
}

searchInput.addEventListener("keyup", handleSearch);
searchBtn.addEventListener("click", handleSearch);

// 장르 필터링 기능
const filterButtons = document.querySelectorAll(".filter-btn");
filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const selectedGenre = btn.getAttribute("data-genre");
        if (selectedGenre === "전체") {
            renderMovies(moviesData);
        } else {
            const filtered = moviesData.filter(m => m.genre === selectedGenre);
            renderMovies(filtered);
        }
    });
});

// 찜하기(북마크) 토글 기능
function toggleBookmark(event, movieId) {
    event.stopPropagation(); // 카드 클릭 모달 이벤트 방지
    
    if (bookmarkedMovies.has(movieId)) {
        bookmarkedMovies.delete(movieId);
    } else {
        bookmarkedMovies.add(movieId);
    }

    // 찜 개수 업데이트
    document.querySelector("#bookmark-count").textContent = bookmarkedMovies.size;
    
    // 현재 필터 상태 유지하며 다시 그리기
    const activeFilter = document.querySelector(".filter-btn.active").getAttribute("data-genre");
    if (activeFilter === "전체") {
        renderMovies(moviesData);
    } else {
        renderMovies(moviesData.filter(m => m.genre === activeFilter));
    }
}

// 영화 상세 정보 모달
const modal = document.querySelector("#movie-modal");
const modalClose = document.querySelector("#modal-close");
let currentSelectedMovieId = null;

function openMovieModal(movie) {
    currentSelectedMovieId = movie.id;
    document.querySelector("#modal-img").src = movie.poster;
    document.querySelector("#modal-title").textContent = movie.title;
    document.querySelector("#modal-director").textContent = `${movie.director} 감독`;
    document.querySelector("#modal-genre").textContent = movie.genre;
    document.querySelector("#modal-rating").textContent = `⭐ 평점 ${movie.rating}`;
    document.querySelector("#modal-desc").textContent = movie.description;

    const modalFavBtn = document.querySelector("#modal-fav-btn");
    if (bookmarkedMovies.has(movie.id)) {
        modalFavBtn.textContent = "💔 찜 해제하기";
    } else {
        modalFavBtn.textContent = "❤️ 찜하기 목록에 추가";
    }

    modal.style.display = "flex";
}

modalClose.addEventListener("click", () => {
    modal.style.display = "none";
});

modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
    }
});

// 모달 내부 찜하기 버튼
document.querySelector("#modal-fav-btn").addEventListener("click", () => {
    if (currentSelectedMovieId !== null) {
        toggleBookmark(new Event('click'), currentSelectedMovieId);
        modal.style.display = "none";
    }
});

// 페이지 로드 시 초기 렌더링
window.onload = function() {
    renderMovies(moviesData);
};
