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

// 播放點擊音效
function playClick() {
  clickSound.currentTime = 0;
  clickSound.play().catch(() =>
    console.log("點擊音效被阻擋，需要互動解鎖")
  );
}
//自動撥放BGM
window.addEventListener("load", () => {
  const bgm = document.getElementById("bgm");
  bgm.play().catch(err => console.log("自動播放被瀏覽器阻擋", err));
});

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
    yearDiv.dataset.year = year;

    const btn = document.createElement("button");
    btn.textContent = year;
    btn.dataset.year = year;
    btn.style.color = "#493C2C";
    btn.onclick = () => {
      playClick();
      loadContent(pageKey, year, true);
      highlightYearCircle(year);
    };

    const circle = document.createElement("span");
    circle.className = "circle";
    circle.style.borderColor = page.color;
    circle.style.setProperty("--line-color", page.color);
    circle.addEventListener("click", () => {
      playClick();
      loadContent(pageKey, year, true);
      highlightYearCircle(year);
    });
    circle.style.cursor = "pointer";
    yearDiv.appendChild(btn);
    yearDiv.appendChild(circle);
    timelineContainer.appendChild(yearDiv);
  });

  updateTimelineLines();

  // 預設讓第一個年份高亮
  if (years.length > 0) {
    highlightYearCircle(years[0]);
  }
}

function highlightYearCircle(yearKey) {
  document.querySelectorAll(".year .circle").forEach(c => {
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

// 淡入動畫
function fadeReplace(el, html) {
  el.classList.remove("fade-in");
  el.innerHTML = html;
  void el.offsetWidth;
  el.classList.add("fade-in"); 
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


    const imagesHtml = item.images.map(img => `
      <figure onclick="playClick(); openLightbox('${img.src}')">
        <img src="${img.src}" alt="${year}照片">
        <figcaption>${img.caption}</figcaption>
      </figure>
    `).join("");
    fadeReplace(imageBox, imagesHtml);

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

leftButtons.forEach((btn) => {
  btn.onclick = (e) => {
    e.preventDefault();
    playClick();
    loadContent(btn.dataset.page);
  };
});

logoBtn.onclick = (e) => {
  e.preventDefault();
  playClick();
  loadContent("page00");
};

loadContent("page00");
