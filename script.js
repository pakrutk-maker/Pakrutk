/* =========================================================
   1. [수행평가 제출 원본] 로그인, 카운터, 색상 변경 기능
   ========================================================= */

// ① 로그인 (아이디: pakrutk / 비밀번호: helloworld)
const id = "pakrutk";
const pw = "helloworld";

const loginForm = document.querySelector("#loginForm");
loginForm.onsubmit = function (e) {
    e.preventDefault(); // 페이지 새로고침 방지

    const inputId = document.querySelector("#user_Id").value;
    const inputPw = document.querySelector("#user_Pw").value;

    if (inputId === id && inputPw === pw) {
        alert("로그인 성공!");
        // 사이드바 로그인 박스를 사용자 프로필 화면으로 업데이트
        const loginContainer = document.querySelector(".login-box-content");
        if (loginContainer) {
            loginContainer.innerHTML = `
                <h3>👤 내 프로필</h3>
                <div class="user-profile">
                    <p class="welcome-text">환영합니다!<br><strong>${inputId}</strong>님</p>
                    <span class="user-badge">VIP PREMIUM MEMBER</span>
                </div>
            `;
        }
    } else {
        alert("로그인 실패: 아이디 또는 비밀번호가 틀렸습니다.");
    }
};

// ② 카운터
let counter = document.querySelector("#counter");
let number = 0;
let count_number = document.querySelector("#count_number");

counter.onclick = function () {
    number = number + 1;
    count_number.textContent = number + "번 클릭";
};

// ③ 색 바꾸기
let text_message = document.querySelector('#text_message');
text_message.onclick = function () {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    text_message.style.color = 'rgb(' + r + ',' + g + ',' + b + ')';
    text_message.style.borderColor = 'rgb(' + r + ',' + g + ',' + b + ')';
};


/* =========================================================
   2. [고급 기능] 영화 검색, 장르 필터, 상세 모달, localStorage 찜 연동
   ========================================================= */

// 영화 데이터베이스
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

// 브라우저 localStorage 저장소 연동 (새로고침해도 찜 보존)
const savedBookmarks = JSON.parse(localStorage.getItem("bookmarkedMovies")) || [];
const bookmarkedMovies = new Set(savedBookmarks);

// 영화 목록 동적 생성
function renderMovies(movieList) {
    const gridContainer = document.querySelector("#movie-grid");
    if (!gridContainer) return;

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

        cardEl.addEventListener("click", () => openMovieModal(movie));
        gridContainer.appendChild(cardEl);
    });
}

// 찜하기(북마크) 토글 및 localStorage 반영
function toggleBookmark(event, movieId) {
    event.stopPropagation(); // 모달 팝업 실행 중단
    
    if (bookmarkedMovies.has(movieId)) {
        bookmarkedMovies.delete(movieId);
    } else {
        bookmarkedMovies.add(movieId);
    }

    // localStorage 저장
    localStorage.setItem("bookmarkedMovies", JSON.stringify(Array.from(bookmarkedMovies)));

    // 사이드바 카운트 업데이트
    updateBookmarkCount();

    // 현재 선택된 장르 필터 유지하며 재렌더링
    const activeFilterBtn = document.querySelector(".filter-btn.active");
    const activeFilter = activeFilterBtn ? activeFilterBtn.getAttribute("data-genre") : "전체";
    
    if (activeFilter === "전체") {
        renderMovies(moviesData);
    } else {
        renderMovies(moviesData.filter(m => m.genre === activeFilter));
    }
}

// 찜 개수 텍스트 업데이트
function updateBookmarkCount() {
    const countElement = document.querySelector("#bookmark-count");
    if (countElement) {
        countElement.textContent = bookmarkedMovies.size;
    }
}

// 실시간 검색 기능
const searchInput = document.querySelector("#search-input");
const searchBtn = document.querySelector("#search-btn");

function handleSearch() {
    if (!searchInput) return;
    const query = searchInput.value.toLowerCase().trim();
    const filtered = moviesData.filter(movie => 
        movie.title.toLowerCase().includes(query) || 
        movie.director.toLowerCase().includes(query)
    );
    renderMovies(filtered);
}

if (searchInput) searchInput.addEventListener("keyup", handleSearch);
if (searchBtn) searchBtn.addEventListener("click", handleSearch);

// 장르 필터링
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

// 상세 정보 모달 팝업
const modal = document.querySelector("#movie-modal");
const modalClose = document.querySelector("#modal-close");
let currentSelectedMovieId = null;

function openMovieModal(movie) {
    if (!modal) return;
    currentSelectedMovieId = movie.id;
    document.querySelector("#modal-img").src = movie.poster;
    document.querySelector("#modal-title").textContent = movie.title;
    document.querySelector("#modal-director").textContent = `${movie.director} 감독`;
    document.querySelector("#modal-genre").textContent = movie.genre;
    document.querySelector("#modal-rating").textContent = `⭐ 평점 ${movie.rating}`;
    document.querySelector("#modal-desc").textContent = movie.description;

    const modalFavBtn = document.querySelector("#modal-fav-btn");
    if (modalFavBtn) {
        if (bookmarkedMovies.has(movie.id)) {
            modalFavBtn.textContent = "💔 찜 해제하기";
        } else {
            modalFavBtn.textContent = "❤️ 찜하기 목록에 추가";
        }
    }

    modal.style.display = "flex";
}

if (modalClose) {
    modalClose.addEventListener("click", () => {
        modal.style.display = "none";
    });
}

if (modal) {
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });
}

const modalFavBtn = document.querySelector("#modal-fav-btn");
if (modalFavBtn) {
    modalFavBtn.addEventListener("click", () => {
        if (currentSelectedMovieId !== null) {
            toggleBookmark(new Event('click'), currentSelectedMovieId);
            modal.style.display = "none";
        }
    });
}

// 페이지 로드 시 초기화
window.onload = function() {
    renderMovies(moviesData);
    updateBookmarkCount();
};
