/* 파일명: js/season.js */

/* --- 1. 사진 확대 기능 --- */
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('fullImage');
const closeBtn = document.getElementsByClassName("close")[0];
const images = document.querySelectorAll('.gallery-img');

if (images.length > 0) {
    images.forEach(img => {
        img.addEventListener('click', function() {
            modal.style.display = "flex";
            modalImg.src = this.src;
        });
    });
}

if (closeBtn) {
    closeBtn.onclick = function() { modal.style.display = "none"; }
}

if (modal) {
    modal.onclick = function(event) {
        if (event.target === modal) modal.style.display = "none";
    }
}

/* --- 2. 방명록 기능 --- */
const addBtn = document.getElementById('addBtn');
const nameInput = document.getElementById('nameInput');
const commentInput = document.getElementById('commentInput');
const commentList = document.getElementById('commentList');

// 저장소 이름도 페이지마다 다르게 하는 것이 좋습니다 (예: springGuestbook, summerGuestbook)
const STORAGE_KEY = 'springGuestbook'; 

let guestbookData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

function renderComments() {
    if (!commentList) return; // 리스트가 없으면 실행 중지
    commentList.innerHTML = "";
    
    guestbookData.forEach((data, index) => {
        const newLi = document.createElement('li');
        newLi.innerHTML = `
            <span><span class="name">${data.name}</span> ${data.comment}</span>
            <button class="delete-btn" onclick="deleteComment(${index})">삭제</button>
        `;
        commentList.prepend(newLi);
    });
}

if (addBtn) {
    addBtn.addEventListener('click', function() {
        const name = nameInput.value;
        const comment = commentInput.value;

        if (name === "" || comment === "") {
            alert("이름과 내용을 모두 입력해주세요!");
            return;
        }

        guestbookData.push({ name: name, comment: comment });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(guestbookData));
        renderComments();
        nameInput.value = "";
        commentInput.value = "";
    });
}

// 삭제 함수 (외부에서 호출 가능하도록 window 객체에 등록)
window.deleteComment = function(index) {
    if(confirm("정말 삭제할까요?")) {
        guestbookData.splice(index, 1);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(guestbookData));
        renderComments();
    }
};

// 초기 실행
renderComments();