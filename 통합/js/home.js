/**
 * 통합 페이지: 유리병 + 구슬
 * - 학생 데이터 배열만 바꾸면 됨.
 * - 각 학생 링크는 "학생폴더/index.html" 로 연결하는 형태 권장.
 */

const students = [
  {
    name: "신정은",
    url: "../../신정은/html/index.html",
    color: "#ff6b6b"
  },
  {
    name: "학생B",
    url: "../../studentB/html/index.html",
    color: "#ffd93d"
  }
];

const marbleArea = document.getElementById("marbleArea");
const tooltip = document.getElementById("tooltip");
const studentList = document.getElementById("studentList");

function clamp(n, min, max){ return Math.max(min, Math.min(max, n)); }

function renderList() {
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
  marbleArea.innerHTML = "";

  const areaRect = marbleArea.getBoundingClientRect();
  const W = areaRect.width;
  const H = areaRect.height;

  // 구슬 위치를 너무 겹치지 않게 간단하게 배치 (완전 물리 시뮬은 X)
  const placed = [];
  const marbleSize = 62;

  students.forEach((s, idx) => {
    const marble = document.createElement("button");
    marble.type = "button";
    marble.className = "marble";
    marble.setAttribute("aria-label", `${s.name} 페이지로 이동`);
    marble.style.background = `radial-gradient(circle at 30% 30%, rgba(255,255,255,.55), rgba(255,255,255,0) 35%),
                               radial-gradient(circle at 55% 65%, rgba(0,0,0,.25), rgba(0,0,0,0) 55%),
                               ${s.color}`;

    // 랜덤 위치 + 하단에 더 모이도록 y bias
    let tries = 0;
    let x = 0, y = 0;
    while (tries < 120) {
      x = Math.random() * (W - marbleSize);
      const bias = Math.random() ** 0.45; // 0~1, 아래쪽 비중 증가
      y = bias * (H - marbleSize);

      // 겹침 체크(대충)
      const ok = placed.every(p => {
        const dx = (p.x - x);
        const dy = (p.y - y);
        return Math.sqrt(dx*dx + dy*dy) > 52; // 최소 간격
      });
      if (ok) break;
      tries++;
    }
    placed.push({ x, y });

    marble.style.left = `${clamp(x, 0, W - marbleSize)}px`;
    marble.style.top  = `${clamp(y, 0, H - marbleSize)}px`;

    // 떨어지는 애니메이션 시간 차
    marble.style.animationDelay = `${idx * 90}ms`;

    // 이벤트
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

function init() {
  renderList();
  // 레이아웃 안정화 후 배치
  requestAnimationFrame(() => placeMarbles());
  window.addEventListener("resize", () => placeMarbles());
}

init();
