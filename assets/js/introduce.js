// 스크롤 이벤트 함수

let observer = new IntersectionObserver((e) => {
  e.forEach((box) => {
    if (box.isIntersecting) {
      box.target.style.opacity = '1'
    }
    else {
      box.target.style.opacity = '0'
    }
  })
})

let div = document.querySelectorAll('.scrollBox')
observer.observe(div[0])
observer.observe(div[1])
observer.observe(div[2])
observer.observe(div[3])


// 갤러리 함수

const $ = (e) => document.querySelector(e); 
const $$ = (e) => [...document.querySelectorAll(e)]; 

const mottos = $$(".gallery > div");

mottos.forEach((e) => { 
  e.addEventListener("mouseover", () => { 
    mottos.forEach((e2) => { 
      e2.style.backgroundImage = `url(./assets/images/${e.className}.jpg)`;
      $(`.des${e.className.replace(/[^0-9]/g, "")}`).style.opacity = "1";
      $(`.title${e.className.replace(/[^0-9]/g, "")}`).style.opacity = "1";
      if (e !== e2) {
        $(`.title${e2.className.replace(/[^0-9]/g, "")}`).style.opacity = "0";
      }
    });
  });

  e.addEventListener("mouseleave", () => { 
    mottos.forEach((e2) => { 
      e2.style.backgroundImage = `url(./assets/images/${e2.className}.jpg)`;
      $(`.title${e2.className.replace(/[^0-9]/g, "")}`).style.opacity = "1";
      $(`.des${e2.className.replace(/[^0-9]/g, "")}`).style.opacity = "0";
    });
  });
});
