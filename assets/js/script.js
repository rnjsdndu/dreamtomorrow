function motto() {
  const mottos = [...document.querySelectorAll(".motto ul li")];
  const dess = [...document.querySelectorAll(".dess div")];

  mottos.forEach((motto, index) => {
    motto.addEventListener("mouseover", (e1) => {
      dess[index].style.display = "block";
      e1.currentTarget.querySelector('p').style.display = "block";

      const currentBgImage = `url(./assets/images/${motto.classList[0]}.png)`;
      mottos.forEach(item => {
        item.style.backgroundImage = currentBgImage;
      });
    });

    motto.addEventListener("mouseleave", (e1) => {
      dess[index].style.display = "none";
      e1.currentTarget.querySelector('p').style.display = "none";

      mottos.forEach(item => {
        item.style.backgroundImage = `url(./assets/images/${item.classList[0]}.png)`;
      });
    });
  });
}

function video() {
  const video = document.querySelector("video");
  const controlor = document.querySelector('.other');

  const videoAction = {
    play: () => video.play(),
    pause: () => video.pause(),
    stop: () => { video.pause(); video.currentTime = 0 },
    back: () => video.currentTime -= 10,
    fast: () => video.currentTime += 10,
    speedDown: () => video.playbackRate -= .1,
    speedUp: () => video.playbackRate += .1,
    reset: () => video.playbackRate = 1,
    re: () => video.loop = !video.loop,
    hidden: () => {
      const hide = document.querySelector('#hide');
      if (hide.checked === true) {
        controlor.style.display = 'flex';
      } else {
        controlor.style.display = 'none';
      }
    }
  };

  for (const i in videoAction) {
    document.getElementById(i).addEventListener("click", videoAction[i]);
  }
}





let draggEle = null;
let total = null
let guestId = '';
let randomId = null

const modalOpen = document.querySelector('.nolog')
const modal = document.querySelector('.modal')
const modalClose = document.querySelector('.modalClose')

function totalPrice() {
  total = 0;
  document.querySelectorAll('.order .card').forEach(card => {
    const priceText = card.querySelector('.price').textContent.replace(/,/g, '')
    const price = parseInt(priceText)
    const count = card.querySelector('input').value
    total += price * count;
  });
  const totalNum = document.querySelector('.modalPrice')
  totalNum.textContent = total.toLocaleString();
}

function dnd() {
  const cards = document.querySelectorAll('dialog .card');
  let price = null

  cards.forEach(card => {
    card.draggable = true;
    card.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', card.id); // id를 저장
      draggEle = e.target;
    });
  });

  const order = document.querySelector('.order');

  order.addEventListener('dragover', (e) => {
    e.preventDefault();
  });

  document.body.addEventListener('dragover', (e) => {
    e.preventDefault();
  });

  order.addEventListener('drop', (e) => {
    e.preventDefault();

    if (!draggEle) return;

    const draggedId = draggEle.id;
    const alreadyInOrder = order.querySelector(`#${draggedId}`);

    if (alreadyInOrder) return; // 중복 방지

    const clone = draggEle.cloneNode(true);
    clone.id = draggedId; // id 유지

    const plusMinus = document.createElement('input');
    plusMinus.type = 'number';
    plusMinus.value = 1;
    plusMinus.min = 1;

    const orderCardPriceTextReal = document.createElement('p');

    clone.appendChild(plusMinus);
    clone.appendChild(orderCardPriceTextReal);

    order.appendChild(clone);

    // 원래 display 카드 비활성화
    const original = document.querySelector(`.display #${draggedId}`);
    if (original) {
      original.style.opacity = 0.5;
      original.setAttribute("draggable", "false");
    }

    function cardPrice() {
      price = 0;
      let orderCardPriceText = clone.querySelector('.price').textContent;
      orderCardPriceText = orderCardPriceText.replace(/,/g, '')
      const orderCardPrice = parseInt(orderCardPriceText);
      const cardValue = clone.querySelector('input').value;

      orderCardPriceTextReal.innerHTML = price = (orderCardPrice * cardValue).toLocaleString() + '원';
      orderCardPriceTextReal.style.fontWeight = 'bold';
    }

    plusMinus.addEventListener('input', () => {
      cardPrice();
      totalPrice();
    });

    // 드래그해서 밖으로 나가면 제거
    clone.addEventListener('dragstart', (e) => {
      draggEle = clone;
      e.dataTransfer.setData('text/plain', clone.id);
    });

    cardPrice();
    totalPrice();
  });

  // 드래그가 body 전체로 나갔을 때 카드 제거
  document.body.addEventListener("drop", (e) => {
    const isDropInsideOrder = e.target.closest(".order");
    if (!isDropInsideOrder && draggEle) {
      const removedId = draggEle.id;
      const removedCard = document.querySelector(`.order #${removedId}`);
      const original = document.querySelector(`.display #${removedId}`);

      if (removedCard) {
        removedCard.remove();
        if (original) {
          original.style.opacity = 1;
          original.setAttribute("draggable", "true");
        }
        totalPrice();
      }
      draggEle = null;
    }
  });

  function random() {
    const orderYes = document.querySelector('.orderYes');
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 6; i++) {
      guestId += chars[Math.floor(Math.random() * chars.length)];
    }
    
    randomId = document.querySelector('.randomId').innerHTML = `${guestId}`
    
    orderYes.addEventListener('click', (e) => {
      const totalNum = document.querySelector('.modalPrice').textContent;
      const docuMsg = document.querySelector('.line');
      
      const msg = document.createElement('span');
      msg.textContent = `방금 비회원 ${guestId}님이 ${totalNum}원을 결제하셨습니다!`;
      msg.style.display = 'block';
      modal.style.display = 'none'

      
      docuMsg.innerHTML = '';
      docuMsg.appendChild(msg);
      docuMsg.style.display = 'block';
      
      setTimeout(() => {
        docuMsg.style.display = 'none';
      }, 3000);
    });
  }
  
  random();
}

modalOpen.addEventListener('click' , (e)=>{
  modal.style.display = 'block'
})

modalClose.addEventListener('click' , (e)=>{
  modal.style.display = 'none'
})





dnd();
motto();
video();
