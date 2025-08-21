const lockBtn = document.getElementById("lock-btn");
const messageInput = document.getElementById("message");
const lockTimeSelect = document.getElementById("lock-time");
const output = document.getElementById("capsule-output");
const statusText = document.getElementById("status");
const revealedMessage = document.getElementById("revealed-message");

function checkCapsule() {
  const saved = JSON.parse(localStorage.getItem("capsule"));
  if (!saved) return;

  const now = Date.now();
  if (now < saved.unlockTime) {
    // Still locked
    output.classList.remove("hidden");
    revealedMessage.classList.add("hidden");
    let remaining = saved.unlockTime - now;
    let seconds = Math.floor(remaining / 1000);
    statusText.textContent = `⏳ Your message is locked. Come back in ${seconds} seconds.`;
    setTimeout(checkCapsule, 1000);
  } else {
    // Unlock
    output.classList.remove("hidden");
    statusText.textContent = "🎉 Your message has been unlocked!";
    revealedMessage.textContent = saved.message;
    revealedMessage.classList.remove("hidden");
  }
}

lockBtn.addEventListener("click", () => {
  const message = messageInput.value;
  const lockDuration = parseInt(lockTimeSelect.value);

  if (!message) {
    alert("Please write a message first!");
    return;
  }

  const unlockTime = Date.now() + lockDuration;
  localStorage.setItem("capsule", JSON.stringify({ message, unlockTime }));

  checkCapsule();
});

// Check on page load
checkCapsule();
