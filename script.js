const lockBtn = document.getElementById("lock-btn");
const messageInput = document.getElementById("message");
const lockTimeSelect = document.getElementById("lock-time");
const capsuleList = document.getElementById("capsule-list");
const themeToggle = document.getElementById("theme-toggle");
const lockSound = document.getElementById("lock-sound");
const unlockSound = document.getElementById("unlock-sound");
const emojiSound = document.getElementById("emoji-sound");

const customMinutes = document.getElementById("custom-minutes");
const customHours = document.getElementById("custom-hours");
const customDays = document.getElementById("custom-days");

let capsules = JSON.parse(localStorage.getItem("capsules")) || [];

// Theme setup
if(localStorage.getItem("theme") === "dark") document.body.classList.add("dark");
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
});

function saveCapsules() {
  localStorage.setItem("capsules", JSON.stringify(capsules));
}

// Confetti with random shapes/colors
function playConfetti() {
  const duration = 2000;
  const end = Date.now() + duration;

  (function frame() {
    const shapes = ['⬤','■','◆','▲','★'];
    const colors = ['#ff0','#f0f','#0ff','#0f0','#f00','#ffa500'];
    const particle = document.createElement('div');
    particle.textContent = shapes[Math.floor(Math.random()*shapes.length)];
    particle.style.position = 'fixed';
    particle.style.top = Math.random() * window.innerHeight + 'px';
    particle.style.left = Math.random() * window.innerWidth + 'px';
    particle.style.fontSize = Math.random() * 20 + 10 + 'px';
    particle.style.color = colors[Math.floor(Math.random()*colors.length)];
    particle.style.zIndex = 9999;
    particle.style.pointerEvents = 'none';
    document.body.appendChild(particle);

    setTimeout(() => particle.remove(), 2000);

    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

// Emoji reaction handler
function addEmojiReactions(capsule, index) {
  const container = document.createElement('div');
  container.className = 'emoji-reactions';
  const emojis = ['❤️', '👍', '😂', '😮', '🎉'];
  emojis.forEach(e => {
    const span = document.createElement('span');
    span.textContent = e;
    span.onclick = () => {
      emojiSound.play();
      alert(`You reacted ${e} to: "${capsule.message}"`);
    };
    container.appendChild(span);
  });
  return container;
}

// Render capsules
function renderCapsules() {
  capsuleList.innerHTML = "";
  capsules.forEach((capsule, index) => {
    const div = document.createElement("div");
    div.className = "capsule";

    const now = Date.now();
    if (now < capsule.unlockTime) {
      const remaining = capsule.unlockTime - now;
      const seconds = Math.floor(remaining / 1000);
      div.innerHTML = `
        <p>⏳ Locked! Unlocks in <span id="countdown-${index}">${seconds}</span> seconds.</p>
        <button onclick="deleteCapsule(${index})">Delete</button>
      `;
      updateCountdown(index, capsule.unlockTime);
    } else {
      div.innerHTML = `
        <p>🔓 <b>Unlocked Message:</b></p>
        <p>${capsule.message}</p>
        <button onclick="deleteCapsule(${index})">Delete</button>
      `;
      div.classList.add("unlock");
      unlockSound.play();
      playConfetti();
      div.appendChild(addEmojiReactions(capsule, index));
    }

    capsuleList.appendChild(div);
    setTimeout(() => div.classList.add("show"), 50);
  });
}

function updateCountdown(index, unlockTime) {
  const interval = setInterval(() => {
    const now = Date.now();
    const countdownElement = document.getElementById(`countdown-${index}`);
    if (!countdownElement) {
      clearInterval(interval);
      return;
    }

    if (now >= unlockTime) {
      renderCapsules();
      clearInterval(interval);
    } else {
      let remaining = unlockTime - now;
      countdownElement.textContent = Math.floor(remaining / 1000);
    }
  }, 1000);
}

lockBtn.addEventListener("click", () => {
  const message = messageInput.value;

  // Check custom time
  let lockDuration = parseInt(lockTimeSelect.value);
  let customTime =
    (parseInt(customMinutes.value) || 0) * 60000 +
    (parseInt(customHours.value) || 0) * 3600000 +
    (parseInt(customDays.value) || 0) * 86400000;

  if (customTime > 0) {
    lockDuration = customTime;
  }

  if (!message) {
    alert("Please write a message first!");
    return;
  }

  const unlockTime = Date.now() + lockDuration;
  capsules.push({ message, unlockTime });
  saveCapsules();
  renderCapsules();

  messageInput.value = "";
  customMinutes.value = "";
  customHours.value = "";
  customDays.value = "";
  lockSound.play();
});

function deleteCapsule(index) {
  capsules.splice(index, 1);
  saveCapsules();
  renderCapsules();
}

// Initial render
renderCapsules();
