// ელემენტების წამოღება
const envelope = document.getElementById('envelope');
const overlay = document.getElementById('envelope-overlay');
const bgMusic = document.getElementById('bg-music');
const musicBtn = document.getElementById('musicBtn');
const themeBtn = document.getElementById('themeBtn');

let isMusicPlaying = false;

// 1. კონვერტის გახსნა და მუსიკის ჩართვა
envelope.addEventListener('click', () => {
    envelope.classList.add('open');

    // მუსიკის ჩართვა (თუ ფაილი ჩაგდებულია)
    bgMusic.play().then(() => {
        isMusicPlaying = true;
        musicBtn.textContent = '🔊';
    }).catch(() => {
        isMusicPlaying = false;
        musicBtn.textContent = '🔇';
    });

    setTimeout(() => {
        overlay.classList.add('hidden');
    }, 1350);
});

// 2. მუსიკის ჩართვა / გამორთვის ღილაკი
musicBtn.addEventListener('click', () => {
    if (isMusicPlaying) {
        bgMusic.pause();
        musicBtn.textContent = '🔇';
    } else {
        bgMusic.play();
        musicBtn.textContent = '🔊';
    }
    isMusicPlaying = !isMusicPlaying;
});

// 3. დღის და ღამის რეჟიმის გადართვა
themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    themeBtn.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
});

// 4. სქროლვის დროს სექციების ლამაზად ამოსვლა
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.section').forEach(sec => observer.observe(sec));

// 5. უკუთვლის ტაიმერი (31 ოქტომბერი, 2026 - 12:00 სთ)
const eventDate = new Date("October 31, 2026 12:00:00").getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const diff = eventDate - now;

    if (diff > 0) {
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById('days').innerText = String(d).padStart(2, '0');
        document.getElementById('hours').innerText = String(h).padStart(2, '0');
        document.getElementById('minutes').innerText = String(m).padStart(2, '0');
        document.getElementById('seconds').innerText = String(s).padStart(2, '0');
    } else {
        document.getElementById('days').innerText = "00";
        document.getElementById('hours').innerText = "00";
        document.getElementById('minutes').innerText = "00";
        document.getElementById('seconds').innerText = "00";
    }
}
updateCountdown();
setInterval(updateCountdown, 1000);

// 6. ცვენადი შემოდგომის ფოთლების Canvas ანიმაცია
const canvas = document.getElementById('leaves-canvas');
const ctx = canvas.getContext('2d');
let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
});

const leafColors = ['#d95d26', '#c88a2b', '#9e2a2b', '#e09f3e', '#b5451b'];
const leaves = Array.from({ length: 26 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 9 + 6,
    speedY: Math.random() * 1.2 + 0.5,
    speedX: Math.random() * 1 - 0.5,
    angle: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 0.03,
    color: leafColors[Math.floor(Math.random() * leafColors.length)]
}));

function drawLeaves() {
    ctx.clearRect(0, 0, width, height);
    leaves.forEach(leaf => {
        ctx.save();
        ctx.translate(leaf.x, leaf.y);
        ctx.rotate(leaf.angle);
        ctx.fillStyle = leaf.color;
        ctx.globalAlpha = 0.75;

        ctx.beginPath();
        ctx.moveTo(0, -leaf.size);
        ctx.quadraticCurveTo(leaf.size, 0, 0, leaf.size);
        ctx.quadraticCurveTo(-leaf.size, 0, 0, -leaf.size);
        ctx.fill();
        ctx.restore();

        leaf.y += leaf.speedY;
        leaf.x += Math.sin(leaf.y * 0.015) + leaf.speedX;
        leaf.angle += leaf.spin;

        if (leaf.y > height + 20) {
            leaf.y = -20;
            leaf.x = Math.random() * width;
        }
    });
    requestAnimationFrame(drawLeaves);
}
drawLeaves();