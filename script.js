const id="pakrutk";
const pw="ospakrutk";

//로그인
const loginForm = document.querySelector("#loginForm");
loginForm.onsubmit = function (e) {
  e.preventDefault(); // 페이지 새로고침 방지

  const inputId = document.querySelector("#user_Id").value;
  const inputPw = document.querySelector("#user_Pw").value;

  if (inputId === id && inputPw === pw) {
    alert("로그인 성공!");
  } else {
    alert("로그인 실패: 아이디 또는 비밀번호가 틀렸습니다.");
  }
};
