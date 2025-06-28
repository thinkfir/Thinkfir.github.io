// Particle Network Background with dynamic brightness based on overlay
(function () {
  function setupParticleBG() {
    var canvas = document.getElementById('particle-bg');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var particles = [];
    var PARTICLE_COUNT = 32; // less busy
    var PARTICLE_SIZE = 2.1;
    var LINE_DIST = 100;

    // Cache overlay elements for hit-testing
    var overlays = [];
    function updateOverlays() {
      overlays = [];
      var selectors = [
        '.header', '.site-footer', '.glass-panel', '.main-bg'
      ];
      selectors.forEach(function (sel) {
        document.querySelectorAll(sel).forEach(function (el) {
          overlays.push(el.getBoundingClientRect());
        });
      });
    }
    window.addEventListener('resize', updateOverlays);
    setTimeout(updateOverlays, 500);
    setTimeout(updateOverlays, 1500);
    setTimeout(updateOverlays, 3000);

    function isOverOverlay(x, y) {
      for (var i = 0; i < overlays.length; i++) {
        var r = overlays[i];
        if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) {
          return true;
        }
      }
      return false;
    }

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      updateOverlays();
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    function randomVel() {
      return (Math.random() - 0.5) * 1.2;
    }
    function createParticles() {
      particles = [];
      for (var i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: randomVel(),
          vy: randomVel()
        });
      }
    }
    createParticles();

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Draw lines
      for (var i = 0; i < particles.length; i++) {
        for (var j = i + 1; j < particles.length; j++) {
          var dx = particles[i].x - particles[j].x;
          var dy = particles[i].y - particles[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINE_DIST) {
            // If both ends are over overlay, darken line
            var overA = isOverOverlay(particles[i].x, particles[i].y);
            var overB = isOverOverlay(particles[j].x, particles[j].y);
            ctx.save();
            ctx.globalAlpha = (1 - dist / LINE_DIST) * (overA && overB ? 0.18 : 1.0);
            ctx.strokeStyle = "#fff";
            ctx.lineWidth = 1.7;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }
      // Draw particles
      for (var p = 0; p < particles.length; p++) {
        var over = isOverOverlay(particles[p].x, particles[p].y);
        ctx.beginPath();
        ctx.arc(particles[p].x, particles[p].y, PARTICLE_SIZE, 0, Math.PI * 2);
        ctx.fillStyle = "#fff";
        ctx.shadowColor = "#fff";
        ctx.shadowBlur = over ? 6 : 22;
        ctx.globalAlpha = over ? 0.18 : 1;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
      }
    }

    function update() {
      for (var p = 0; p < particles.length; p++) {
        particles[p].x += particles[p].vx;
        particles[p].y += particles[p].vy;
        // Bounce off walls
        if (particles[p].x < PARTICLE_SIZE) {
          particles[p].x = PARTICLE_SIZE;
          particles[p].vx *= -1;
        }
        if (particles[p].x > canvas.width - PARTICLE_SIZE) {
          particles[p].x = canvas.width - PARTICLE_SIZE;
          particles[p].vx *= -1;
        }
        if (particles[p].y < PARTICLE_SIZE) {
          particles[p].y = PARTICLE_SIZE;
          particles[p].vy *= -1;
        }
        if (particles[p].y > canvas.height - PARTICLE_SIZE) {
          particles[p].y = canvas.height - PARTICLE_SIZE;
          particles[p].vy *= -1;
        }
      }
    }

    function animate() {
      update();
      draw();
      requestAnimationFrame(animate);
    }
    animate();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupParticleBG);
  } else {
    setupParticleBG();
  }
})();
