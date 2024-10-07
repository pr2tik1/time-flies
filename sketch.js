let particles = [];
let lastTime = "";
let noiseScale = 0.01;

function setup() {
    createCanvas(700, 700);
    let canvas = document.querySelector('canvas');
    canvas.style.borderRadius = '50%';
    createParticles();
    noStroke();
}

function draw() {
    background(255, 255, 255);
    particles.forEach((particle) => {
        particle.update();
        particle.draw();
    });
    drawTime();
}

class Particle {
    constructor(x, y, isDigit) {
        this.x = x;
        this.y = y;
        this.initialX = x; 
        this.initialY = y; 
        this.isDigit = isDigit;
        this.size = 10;
        this.color = this.isDigit ? "rgba(0, 0, 0, 1)" : "rgba(0, 0, 0, 0.5)";
        this.noiseOffsetX = random(100);
        this.noiseOffsetY = random(100);
        this.noiseSpeed = 0.04;
    }

    update() {
        if (this.isDigit) {
            // Controlled noise-based movement for digit particles
            this.x = this.initialX + map(noise(this.noiseOffsetX), 0, 1, -2, 2);
            this.y = this.initialY + map(noise(this.noiseOffsetY), 0, 1, -2, 2);
            this.noiseOffsetX += this.noiseSpeed;
            this.noiseOffsetY += this.noiseSpeed;
        } else {
            // Free movement for background particles
            this.x += map(noise(this.noiseOffsetX), 0, 1, -2, 2);
            this.y += map(noise(this.noiseOffsetY), 0, 1, -2, 2);
            this.noiseOffsetX += this.noiseSpeed; 
            this.noiseOffsetY += this.noiseSpeed; 
            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
            if (this.y < 0) this.y = height;
            if (this.y > height) this.y = 0;
        }
    }

    draw() {
        fill(this.color);
        // ellipse(this.x, this.y, this.size, this.size);
        triangle(this.x, this.y - this.size / 4, this.x - this.size / 4, this.y + this.size / 4, this.x + this.size / 4, this.y + this.size / 3);
    }

    setTarget(x, y) {
        this.targetX = x;
        this.targetY = y;
    }
}

const digits = [
    [1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1],
    [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
    [1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1],
    [1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1],
    [1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
];

const digitLookupTable = {
    0: digits[0],
    1: digits[1],
    2: digits[2],
    3: digits[3],
    4: digits[4],
    5: digits[5],
    6: digits[6],
    7: digits[7],
    8: digits[8],
    9: digits[9],
    ":": digits[10],
};

function drawTime() {
    const now = new Date();
    const hours = nf(now.getHours(), 2);
    const minutes = nf(now.getMinutes(), 2);
    const currentTime = `${hours}:${minutes}`;
    
    if (currentTime !== lastTime) {
        lastTime = currentTime;
        createDigitParticles(currentTime);
    }

    particles.forEach((particle) => {
        if (particle.isDigit) {
            particle.update();
            particle.draw();
        }
    });
}

function createDigitParticles(currentTime) {
    const digitParticles = [];
    const startX = width / 4;

    for (let i = 0; i < currentTime.length; i++) {
        const digitPattern = digitLookupTable[currentTime[i]];
        const targetY = height / 2;

        for (let y = 0; y < 5; y++) {
            for (let x = 0; x < 4; x++) {
                if (digitPattern[y * 4 + x]) {
                    const targetX = startX + i * 70 + x * 15;
                    const targetYPosition = targetY - (4 - y) * 15;
                    const newParticle = new Particle(targetX, targetYPosition, true);
                    digitParticles.push(newParticle);
                }
            }
        }
    }

    particles = particles.filter(p => !p.isDigit);
    particles.push(...digitParticles);
}

function createParticles() {
    const numBackgroundParticles = 250;
    for (let i = 0; i < numBackgroundParticles; i++) {
        const angle = random(TWO_PI);
        const radius = random(width / 2 - 10);
        const x = width / 2 + cos(angle) * radius;
        const y = height / 2 + sin(angle) * radius;
        particles.push(new Particle(x, y, false));
    }
}
