const students = [
  // name: 학생 이름, url: 경로, color: 구슬 색상
  { name: "신정은", url: "../../신정은/html/index.html", color: "#ff9a9e" },
  { name: "홍길동", url: "../../홍길동/html/index.html", color: "#a18cd1" },
  { name: "완성본", url: "../../완성본/html/index.html", color: "#fad0c4" },
  // 데이터 더미 (학생들 추가)
  { name: "김시우", url: "../../김시우/html/index.html", color: "#ff00ae" },
  { name: "김요한", url: "#", color: "#fbc2eb" },
  { name: "김은률", url: "../../김은률/html/spring.html", color: "#7c14e4" },
  { name: "김정건", url: "#", color: "#ffecd2" },
  { name: "김준서", url: "../../김준서/html/index.html", color: "#2de3ff" },
  { name: "박지원", url: "#", color: "#b6a6e9" },
  { name: "오우빈", url: "../../오우빈/html/index.html", color: "#6aa6e6" },
  { name: "우주원", url: "../../윤동유/html/index.html", color: "#ffffff" },
  { name: "윤동유", url: "../../윤동유/html/index.html", color: "#ffffff" },
  { name: "이민재", url: "../../이민재/html/index.html", color: "#a3f708" },
  { name: "이유주", url: "../../이유주/html/index.html", color: "#862622" },
  { name: "임지완", url: "../../임지완/html/index.html", color: "#00ff2a" },
  { name: "장준희", url: "../../장준희/html/index.html", color: "#bd2a2a" },
  { name: "차수한", url: "../../차수한/html/index.html", color: "#7e7d7dc4" },
  { name: "차요한", url: "../../차요한/html/index.html", color: "#ffbbbb" },
  { name: "최규현", url: "../../최규현/html/index.html", color: "#b6a6e9" }
];

const marbleArea = document.getElementById("marbleArea");
const tooltip = document.getElementById("tooltip");
const studentList = document.getElementById("studentList");

function clamp(n, min, max){ return Math.max(min, Math.min(max, n)); }

function renderList() {
  if(!studentList) return; // 에러 방지
  studentList.innerHTML = "";
  students.forEach(s => {
    const li = document.createElement("li");
    li.innerHTML = `
      <a href="${s.url}">
        <span class="swatch" style="background:${s.color}"></span>
        <span>${s.name}</span>
      </a>
    `;
    studentList.appendChild(li);
  });
}

function placeMarbles() {
  if(!marbleArea) return; // 에러 방지
  marbleArea.innerHTML = "";

  const areaRect = marbleArea.getBoundingClientRect();
  const W = areaRect.width;
  const H = areaRect.height;

  // 구슬 위치 배치 (겹침 방지 + 하단 쏠림)
  const placed = [];
  const marbleSize = 62; // CSS width와 맞춰주세요

  students.forEach((s, idx) => {
    const marble = document.createElement("button");
    marble.type = "button";
    marble.className = "marble";
    marble.setAttribute("aria-label", `${s.name} 페이지로 이동`);
    
    // 그라데이션 로직 적용
    marble.style.background = `radial-gradient(circle at 30% 30%, rgba(255,255,255,.55), rgba(255,255,255,0) 35%),
                               radial-gradient(circle at 55% 65%, rgba(0,0,0,.25), rgba(0,0,0,0) 55%),
                               ${s.color}`;

    // 랜덤 위치 + 하단에 더 모이도록 y bias 적용
    let tries = 0;
    let x = 0, y = 0;
    // 겹치지 않는 위치를 찾기 위해 최대 120번 시도
    while (tries < 120) {
      x = Math.random() * (W - marbleSize);
      
      // y bias: 0~1 사이 값에 지수(0.45)를 적용하여 아래쪽(큰 값)이 더 잘 나오게 함
      const bias = Math.random() ** 0.45; 
      y = bias * (H - marbleSize);

      // 겹침 체크 (피타고라스 정리)
      const ok = placed.every(p => {
        const dx = (p.x - x);
        const dy = (p.y - y);
        return Math.sqrt(dx*dx + dy*dy) > 52; // 구슬 간 최소 간격
      });
      
      if (ok) break;
      tries++;
    }
    
    placed.push({ x, y });

    marble.style.left = `${clamp(x, 0, W - marbleSize)}px`;
    marble.style.top  = `${clamp(y, 0, H - marbleSize)}px`;

    // 떨어지는 애니메이션 시간 차
    marble.style.animation = `dropMarble 0.8s cubic-bezier(0.2, 0.9, 0.3, 1.5) forwards`;
    marble.style.animationDelay = `${idx * 100}ms`;
    marble.style.opacity = '0'; // 애니메이션 시작 전 숨김

    // 이벤트 리스너
    marble.addEventListener("mousemove", (e) => {
      tooltip.textContent = s.name;
      tooltip.style.left = `${e.clientX}px`;
      tooltip.style.top = `${e.clientY}px`;
      tooltip.classList.add("show");
    });

    marble.addEventListener("mouseleave", () => {
      tooltip.classList.remove("show");
    });

    marble.addEventListener("click", () => {
      window.location.href = s.url;
    });

    marbleArea.appendChild(marble);
  });
}

// 떨어지는 애니메이션 키프레임 추가
const styleSheet = document.createElement("style");
styleSheet.innerText = `
@keyframes dropMarble {
  0% { transform: translateY(-300px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}
`;
document.head.appendChild(styleSheet);

function init() {
  renderList();
  // 레이아웃 안정화 후 배치
  requestAnimationFrame(() => placeMarbles());
  // 창 크기 조절 시 재배치
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(placeMarbles, 200);
  });
}

init();