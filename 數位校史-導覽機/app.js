// DOM
const pageTitle = document.getElementById("page-title");
const timelineContainer = document.getElementById("timeline");
const textBox = document.getElementById("content-text");
const imageBox = document.getElementById("content-images");
const imageBox2 = document.getElementById("content-images2");
const mainContent = document.querySelector(".main-content");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const bgm = document.getElementById("bgm");
const clickSound = document.getElementById("click-sound");
const leftButtons = document.querySelectorAll(".left-banner .button");
const logoBtn = document.getElementById("logo-btn");
const titleText = document.querySelector(".title-text");
const title2Text = document.querySelector(".title2-text");
const dateBox = document.getElementById("content-date");
const wordBox = document.getElementById("content-word");


// BGM 解鎖標誌
let bgmUnlocked = false;

// 播放點擊音效
function playClick() {
  clickSound.currentTime = 0;
  clickSound.play().catch(() =>
    console.log("點擊音效被阻擋，需要互動解鎖")
  );
}

// 解鎖 BGM
function unlockBGM() {
  if (!bgmUnlocked) {
    bgm.muted = false;
    bgm.loop = true;
    bgm.play().catch(() => console.log("BGM 被阻擋，需要互動解鎖"));
    bgmUnlocked = true;
  }
}
document.body.addEventListener("click", unlockBGM, { once: true });

// 更新背景透明度
function updateBackgroundOpacity(pageKey) {
  let opacity = pageKey === "page00" ? 0.2 : 0.6;
  document.body.style.backgroundImage = `linear-gradient(rgba(255,255,255,${opacity}), rgba(255,255,255,${opacity})), url('image/background.jpg')`;
  document.body.style.backgroundSize = "93% 124%";
  document.body.style.backgroundPosition = "right";
  document.body.style.backgroundRepeat = "no-repeat";
}

// 左側按鈕換色
function highlightLeftButton(activePage) {
  leftButtons.forEach((btn) => {
    if (btn.dataset.page === activePage) {
      btn.style.backgroundColor = data[activePage].color;
      btn.style.color = "#FFF";
      btn.style.width = "12vw"; 
    } else {
      btn.style.backgroundColor = "#68D36B";
      btn.style.color = "#493C2C";
      btn.style.width = "10vw"
    }
  });
}

// Timeline 生成年份按鈕
function generateTimeline(pageKey) {
  const page = data[pageKey];
  timelineContainer.innerHTML = "";
  const years = Object.keys(page.timeline);

  years.forEach((year) => {
    const yearDiv = document.createElement("div");
    yearDiv.className = "year";
    yearDiv.dataset.year = year; // 給每個 yearDiv 一個 data-year

    const btn = document.createElement("button");
    btn.textContent = year;
    btn.dataset.year = year;
    btn.style.color = "#493C2C";
    btn.onclick = () => {
      playClick();
      loadContent(pageKey, year, true); // 點擊切換內容
      highlightYearCircle(year);        // 點擊時切換 active 顏色
    };

    const circle = document.createElement("span");
    circle.className = "circle";
    circle.style.borderColor = page.color;
    circle.style.setProperty("--line-color", page.color);

    yearDiv.appendChild(btn);
    yearDiv.appendChild(circle);
    timelineContainer.appendChild(yearDiv);
  });

  updateTimelineLines();

  // 🔹 預設讓第一個年份圈圈高亮
  if (years.length > 0) {
    highlightYearCircle(years[0]);
  }
}

// 🔹 切換 active 圈圈
function highlightYearCircle(yearKey) {
  document.querySelectorAll(".year .circle").forEach(c => {
    // 重置顏色
    c.style.backgroundColor = "#fff";
    c.style.borderColor = c.style.getPropertyValue("--line-color");
  });

  const activeCircle = document.querySelector(`.year[data-year="${yearKey}"] .circle`);
  if (activeCircle) {
    const color = activeCircle.style.getPropertyValue("--line-color");
    activeCircle.style.backgroundColor = color;
    activeCircle.style.borderColor = color;
  }
}

// 計算 timeline 線高度連到下一個圓圈中心
function updateTimelineLines() {
  const years = document.querySelectorAll(".year");
  years.forEach((year, idx) => {
    const circle = year.querySelector(".circle");
    const nextYear = years[idx + 1];
    if (!nextYear) {
      circle.style.setProperty("--line-height", "0px");
      return;
    }
    const rect1 = circle.getBoundingClientRect();
    const rect2 = nextYear.querySelector(".circle").getBoundingClientRect();
    const nextCenter = rect2.top + rect2.height / 2;
    const distance = nextCenter - rect1.bottom;
    circle.style.setProperty("--line-height", `${distance}px`);
  });
}

// 用 class 觸發淡入動畫
function fadeReplace(el, html) {
  el.classList.remove("fade-in");   // 移除原本動畫
  el.innerHTML = html;
  void el.offsetWidth;               // 重新渲染
  el.classList.add("fade-in");       // 套動畫 class
}

// 載入內容
function loadContent(pageKey, yearKey) {
  const page = data[pageKey];
  if (!page) return;

  updateBackgroundOpacity(pageKey);
  highlightLeftButton(pageKey);

  if (pageKey === "page00") {
    mainContent.style.display = "none";
    titleText.style.display = "block";
    title2Text.style.display = "block";
    fadeReplace(titleText, titleText.innerHTML);
    fadeReplace(title2Text, title2Text.innerHTML);
  } else {
    mainContent.style.display = "grid";
    titleText.style.display = "none";
    title2Text.style.display = "none";

    const year = yearKey || Object.keys(page.timeline)[0];
    const item = page.timeline[year];

    pageTitle.textContent = page.title;

 // 🔹 左右分欄顯示日期與內容
 const rowsHtml = item.text.map(p => {
  if (p.date) {
    return `<div class="content-row">
              <p class="date">${p.date}</p>
              <p class="word">${p.word}</p>
            </div>`;
  } else {
    return `<div class="content-row no-date">
              <p class="word">${p.word}</p>
            </div>`;
  }
}).join("");
fadeReplace(textBox, rowsHtml);


    // 右上圖片區
    const imagesHtml = item.images.map(img => `
      <figure onclick="playClick(); openLightbox('${img.src}')">
        <img src="${img.src}" alt="${year}照片">
        <figcaption>${img.caption}</figcaption>
      </figure>
    `).join("");
    fadeReplace(imageBox, imagesHtml);

    // 右下圖片區
    const images2Html = item.images2 ? item.images2.map(img => `
      <figure onclick="playClick(); openLightbox('${img.src}')">
        <img src="${img.src}" alt="${year}照片2">
        <figcaption>${img.caption}</figcaption>
      </figure>
    `).join("") : "";
    fadeReplace(imageBox2, images2Html);

    generateTimeline(pageKey);
  }
}

// Lightbox
function openLightbox(url) {
  lightboxImg.src = url;
  lightbox.style.display = "flex";
}
function closeLightbox() {
  lightbox.style.display = "none";
  lightboxImg.src = "";
}
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLightbox();
});

// 左側按鈕 onclick
leftButtons.forEach((btn) => {
  btn.onclick = (e) => {
    e.preventDefault();
    playClick();
    loadContent(btn.dataset.page);
  };
});

// Logo onclick
logoBtn.onclick = (e) => {
  e.preventDefault();
  playClick();
  loadContent("page00");
};

// 初始載入首頁
loadContent("page00");
