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
   2. [고급 기능] 영화 검색, 장르 필터, 상세
