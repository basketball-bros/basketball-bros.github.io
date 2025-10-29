// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });
  });
});

// Animation on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("fade-in");
    }
  });
});

document.querySelectorAll(".game-card").forEach((card) => {
  observer.observe(card);
});

// Lazy load YouTube iframe when user scrolls near it
const youtubeEmbed = document.getElementById('youtube-embed');
if (youtubeEmbed) {
  const lazyLoadObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const iframe = entry.target;
        if (iframe.dataset.src) {
          iframe.src = iframe.dataset.src;
          iframe.removeAttribute('data-src');
        }
        lazyLoadObserver.unobserve(iframe);
      }
    });
  }, {
    rootMargin: '100px'
  });
  
  lazyLoadObserver.observe(youtubeEmbed);
}

// Game Modal Functions
function openGameModal(gameUrl, gameTitle) {
  const modal = document.getElementById('gameModal');
  const modalTitle = document.getElementById('gameModalTitle');
  const modalIframe = document.getElementById('gameModalIframe');
  
  modalTitle.textContent = gameTitle;
  modalIframe.src = gameUrl;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeGameModal(event) {
  event.stopPropagation();
  const modal = document.getElementById('gameModal');
  const modalIframe = document.getElementById('gameModalIframe');
  
  // First exit fullscreen if active
  if (modal.classList.contains('fullscreen')) {
    modal.classList.remove('fullscreen');
    // Try to exit browser fullscreen if available
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(err => console.log(err));
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
  
  modal.classList.remove('active');
  document.body.style.overflow = 'auto';
  
  // Clear iframe src to stop the game from running
  setTimeout(() => {
    modalIframe.src = '';
  }, 300);
}

// Update all Play Now buttons
document.querySelectorAll('.play-btn').forEach((button) => {
  const originalLink = button.getAttribute('href');
  if (originalLink && originalLink.startsWith('/')) {
    const gameTitle = button.closest('.game-card').querySelector('.game-title').textContent;
    button.setAttribute('onclick', `event.preventDefault(); openGameModal('${originalLink}', '${gameTitle}');`);
    button.style.cursor = 'pointer';
  }
});

// Toggle Fullscreen Function
function toggleFullscreen() {
  const modal = document.getElementById('gameModal');
  const modalContent = modal.querySelector('.game-modal-content');
  
  if (modal.classList.contains('fullscreen')) {
    // Exit fullscreen
    modal.classList.remove('fullscreen');
    // Try to exit browser fullscreen if available
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(err => console.log(err));
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  } else {
    // Enter fullscreen
    modal.classList.add('fullscreen');
    // Try to enter browser fullscreen
    if (modalContent.requestFullscreen) {
      modalContent.requestFullscreen().catch(err => console.log(err));
    } else if (modalContent.webkitRequestFullscreen) {
      modalContent.webkitRequestFullscreen();
    } else if (modalContent.mozRequestFullScreen) {
      modalContent.mozRequestFullScreen();
    } else if (modalContent.msRequestFullscreen) {
      modalContent.msRequestFullscreen();
    }
  }
}

// Listen for fullscreen changes
document.addEventListener('fullscreenchange', function() {
  const modal = document.getElementById('gameModal');
  if (!document.fullscreenElement) {
    modal.classList.remove('fullscreen');
  }
});

document.addEventListener('webkitfullscreenchange', function() {
  const modal = document.getElementById('gameModal');
  if (!document.webkitFullscreenElement) {
    modal.classList.remove('fullscreen');
  }
});

document.addEventListener('mozfullscreenchange', function() {
  const modal = document.getElementById('gameModal');
  if (!document.mozFullScreenElement) {
    modal.classList.remove('fullscreen');
  }
});

document.addEventListener('MSFullscreenChange', function() {
  const modal = document.getElementById('gameModal');
  if (!document.msFullscreenElement) {
    modal.classList.remove('fullscreen');
  }
});

// Close modal on ESC key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    const modal = document.getElementById('gameModal');
    if (modal.classList.contains('active')) {
      // Exit fullscreen first if active
      if (modal.classList.contains('fullscreen')) {
        toggleFullscreen();
      } else {
        closeGameModal({ stopPropagation: () => {} });
      }
    }
  }
});

