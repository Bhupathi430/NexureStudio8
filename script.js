document.addEventListener('DOMContentLoaded', () => {
    // --------------------------------------------------------------------------
    // 1. Particle Canvas Background Animation
    // --------------------------------------------------------------------------
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.radius = Math.random() * 2 + 1;
            this.vx = (Math.random() - 0.5) * 0.6;
            this.vy = (Math.random() - 0.5) * 0.6;
            this.alpha = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 240, 255, ${this.alpha})`;
            ctx.fill();
        }
    }

    const particles = Array.from({ length: 65 }, () => new Particle());

    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 130) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 240, 255, ${0.15 * (1 - dist / 130)})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        connectParticles();
        requestAnimationFrame(animateParticles);
    }

    animateParticles();

    // --------------------------------------------------------------------------
    // 2. 6-Day Countdown Timer Logic
    // --------------------------------------------------------------------------
    const STORAGE_KEY = 'nexus_maintenance_end_time';
    const SIX_DAYS_MS = 6 * 24 * 60 * 60 * 1000;

    let targetTime = localStorage.getItem(STORAGE_KEY);
    if (!targetTime) {
        targetTime = Date.now() + SIX_DAYS_MS;
        localStorage.setItem(STORAGE_KEY, targetTime);
    } else {
        targetTime = parseInt(targetTime, 10);
    }

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    function updateCountdown() {
        const now = Date.now();
        const difference = targetTime - now;

        if (difference <= 0) {
            daysEl.textContent = '00';
            hoursEl.textContent = '00';
            minutesEl.textContent = '00';
            secondsEl.textContent = '00';
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / (1000 * 60)) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        daysEl.textContent = String(days).padStart(2, '0');
        hoursEl.textContent = String(hours).padStart(2, '0');
        minutesEl.textContent = String(minutes).padStart(2, '0');
        secondsEl.textContent = String(seconds).padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    // --------------------------------------------------------------------------
    // 3. Dynamic Terminal Feed Simulator
    // --------------------------------------------------------------------------
    const terminalFeed = document.getElementById('terminalFeed');
    const refreshLogsBtn = document.getElementById('refreshLogsBtn');

    const logPool = [
        { type: 'info', msg: '[INFO] Initializing system isolation protocol...' },
        { type: 'ok',   msg: '[SUCCESS] Core database backup created successfully.' },
        { type: 'warn', msg: '[WARN] Anomaly detected on node-us-east-04 (latency spike).' },
        { type: 'info', msg: '[INFO] Deploying hotfix patch v3.8.12...' },
        { type: 'ok',   msg: '[SUCCESS] Node clusters 01 through 08 re-aligned.' },
        { type: 'info', msg: '[INFO] Executing integrity check on user table partitions...' },
        { type: 'warn', msg: '[WARN] Re-indexing database indices. Estimated duration: 14h.' },
        { type: 'ok',   msg: '[SUCCESS] Firewall SSL certificates renewed.' },
        { type: 'info', msg: '[INFO] Scheduled maintenance window active: Day 1 of 6.' }
    ];

    function generateLogs() {
        terminalFeed.innerHTML = '';
        const now = new Date();
        
        logPool.forEach((item, index) => {
            const timeStr = new Date(now.getTime() - (logPool.length - index) * 45000)
                .toTimeString().split(' ')[0];
            
            const line = document.createElement('div');
            line.className = 'log-line';
            
            let tagClass = 'tag-info';
            if (item.type === 'warn') tagClass = 'tag-warn';
            if (item.type === 'ok') tagClass = 'tag-ok';

            line.innerHTML = `<span class="timestamp">[${timeStr}]</span><span class="${tagClass}">${item.msg}</span>`;
            terminalFeed.appendChild(line);
        });

        terminalFeed.scrollTop = terminalFeed.scrollHeight;
    }

    generateLogs();

    refreshLogsBtn.addEventListener('click', () => {
        refreshLogsBtn.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            refreshLogsBtn.style.transform = 'none';
        }, 300);
        generateLogs();
    });

    // --------------------------------------------------------------------------
    // 4. Form Submission & Toast Message
    // --------------------------------------------------------------------------
    const notifyForm = document.getElementById('notifyForm');
    const toastMessage = document.getElementById('toastMessage');

    notifyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('emailInput').value.trim();
        
        if (email) {
            toastMessage.style.display = 'flex';
            notifyForm.reset();
            setTimeout(() => {
                toastMessage.style.display = 'none';
            }, 5000);
        }
    });

    // --------------------------------------------------------------------------
    // 5. Support Modal Functionality
    // --------------------------------------------------------------------------
    const supportBtn = document.getElementById('supportBtn');
    const supportModal = document.getElementById('supportModal');
    const closeModal = document.getElementById('closeModal');

    supportBtn.addEventListener('click', (e) => {
        e.preventDefault();
        supportModal.classList.add('active');
    });

    closeModal.addEventListener('click', () => {
        supportModal.classList.remove('active');
    });

    supportModal.addEventListener('click', (e) => {
        if (e.target === supportModal) {
            supportModal.classList.remove('active');
        }
    });
});
