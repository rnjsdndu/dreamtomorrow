const $ = e => document.querySelector(e);
const $$ = e => [...document.querySelectorAll(e)];

// ================== 모토/마우스 오버 ==================
function motto() {
  const mottos = $$('.motto ul li');
  const dess = $$('.dess div');

  mottos.forEach((motto, index) => {
    motto.addEventListener('mouseover', () => {
      dess[index].style.display = 'block';
      motto.querySelector('p').style.display = 'block';

      const currentBgImage = `url(./assets/images/${motto.classList[0]}.png)`;
      mottos.forEach(item => item.style.backgroundImage = currentBgImage);
    });

    motto.addEventListener('mouseleave', () => {
      dess[index].style.display = 'none';
      motto.querySelector('p').style.display = 'none';

      mottos.forEach(item => {
        item.style.backgroundImage = `url(./assets/images/${item.classList[0]}.png)`;
      });
    });
  });
}

// ================== 비디오 컨트롤 ==================
function video() {
  const video = $('video');
  const controlor = $('.other');

  const videoAction = {
    play: () => video.play(),
    pause: () => video.pause(),
    stop: () => { video.pause(); video.currentTime = 0 },
    back: () => video.currentTime -= 10,
    fast: () => video.currentTime += 10,
    speedDown: () => video.playbackRate -= 0.1,
    speedUp: () => video.playbackRate += 0.1,
    reset: () => video.playbackRate = 1,
    re: () => video.loop = !video.loop,
    hidden: () => {
      const hide = $('#hide');
      controlor.style.display = hide && hide.checked ? 'flex' : 'none';
    }
  };

  for (const i in videoAction) {
    const btn = $(`#${i}`);
    if(btn) btn.addEventListener('click', videoAction[i]);
  }
}

// ================== 장바구니 드래그&드롭 ==================
let draggEle = null;
let total = 0;
const order = $('.order');
const display = $('.display');

function getPrice(priceText) {
  return parseInt(priceText.replace(/[,원]/g, '')) || 0;
}

function totalPrice() {
  total = 0;
  order.querySelectorAll('.C_card').forEach(card => {
    const price = getPrice(card.querySelector('.price').textContent);
    const count = card.querySelector('input')?.value || 1;
    total += price * count;
  });
  const totalNum = $('.modalPrice');
  if(totalNum) totalNum.textContent = total.toLocaleString();
}

function dnd() {
  const cards = display.querySelectorAll('.C_card');

  cards.forEach(card => {
    card.draggable = true;
    card.addEventListener('dragstart', e => {
      draggEle = e.target;
      e.dataTransfer.setData('text/plain', card.id);
    });
  });

  order.addEventListener('dragover', e => e.preventDefault());
  document.body.addEventListener('dragover', e => e.preventDefault());

  order.addEventListener('drop', e => {
    e.preventDefault();
    if(!draggEle) return;
    const draggedId = draggEle.id;
    if(order.querySelector(`#${draggedId}`)) return;

    const clone = draggEle.cloneNode(true);
    clone.id = draggedId;

    const plusMinus = document.createElement('input');
    plusMinus.type = 'number';
    plusMinus.value = 1;
    plusMinus.min = 1;
    clone.appendChild(plusMinus);

    const orderCardPriceTextReal = document.createElement('p');
    clone.appendChild(orderCardPriceTextReal);

    order.appendChild(clone);

    draggEle.style.opacity = 0.5;
    draggEle.draggable = false;

    function cardPrice() {
      const price = getPrice(clone.querySelector('.price').textContent);
      const count = plusMinus.value;
      orderCardPriceTextReal.textContent = (price * count).toLocaleString() + '원';
      orderCardPriceTextReal.style.fontWeight = 'bold';
    }

    plusMinus.addEventListener('input', () => { cardPrice(); totalPrice(); });
    clone.addEventListener('dragstart', e => { draggEle = clone; });

    cardPrice();
    totalPrice();
  });

  document.body.addEventListener('drop', e => {
    const isDropInsideOrder = e.target.closest('.order');
    if(!isDropInsideOrder && draggEle) {
      const removedId = draggEle.id;
      const removedCard = order.querySelector(`#${removedId}`);
      const original = display.querySelector(`#${removedId}`);
      if(removedCard) {
        removedCard.remove();
        if(original) { original.style.opacity = 1; original.draggable = true; }
        totalPrice();
      }
      draggEle = null;
    }
  });
}

// ================== 비회원 랜덤 ID & 주문 ==================
const orderYes = $('.orderYes');
const modal = $('.modal');
const docuMsg = $('.line');
const randomIdEl = $('.randomId');
let guestId = '';

function generateGuestId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  guestId = '';
  for (let i = 0; i < 6; i++) guestId += chars[Math.floor(Math.random() * chars.length)];
  randomIdEl.textContent = guestId;
}

// 주문 완료 이벤트
orderYes.addEventListener('click', () => {
  const totalNum = $('.modalPrice')?.textContent || '0';

  const msg = document.createElement('span');
  msg.textContent = `방금 비회원 ${guestId}님이 ${totalNum}원을 결제하셨습니다!`;
  msg.style.display = 'block';

  docuMsg.innerHTML = '';
  docuMsg.appendChild(msg);
  docuMsg.style.display = 'block';

  setTimeout(() => { docuMsg.style.display = 'none'; }, 3000);

  modal.style.display = 'none';
  order.innerHTML = '';

  display.querySelectorAll('.C_card').forEach(card => {
    card.style.opacity = 1;
    card.setAttribute('draggable', 'true');
  });

  totalPrice();
  generateGuestId();
});

// 초기 랜덤 ID 생성
generateGuestId();

// ================== 모달 열기/닫기 ==================
function modalSetup() {
  const modal = $('.modal');
  const modalOpen = $('.nolog');
  const modalClose = $('.modalClose');
  if(modalOpen) modalOpen.addEventListener('click', () => modal.style.display = 'block');
  if(modalClose) modalClose.addEventListener('click', () => modal.style.display = 'none');
}

// ================== 카테고리 ==================
function categorySetup() {
  const cats = ['helth','digital','fancy','perfum','hair'];
  cats.forEach(cat => {
    const con = $(`.${cat}`);
    const txt = $(`.${cat}Txt`);
    if(!con || !txt) return;
    txt.addEventListener('click', () => {
      cats.forEach(c => {
        const cCon = $(`.${c}`);
        const cTxt = $(`.${c}Txt`);
        if(cCon) cCon.style.display = 'none';
        if(cTxt) { cTxt.style.color = 'rgb(139,139,139)'; cTxt.style.fontWeight = 'normal'; }
      });
      con.style.display = 'block';
      txt.style.color = 'black';
      txt.style.fontWeight = 'bold';
    });
  });
}

// ================== 초기화 ==================
window.addEventListener('DOMContentLoaded', () => {
  dnd();
  motto();
  video();
  modalSetup();
  categorySetup();
});
