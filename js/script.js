//events - a super-basic Javascript (publish subscribe) pattern
var events = {
  events: {},
  on: function (eventName, fn) {
    this.events[eventName] = this.events[eventName] || [];
    this.events[eventName].push(fn);
  },
  off: function(eventName, fn) {
    if (this.events[eventName]) {
      for (var i = 0; i < this.events[eventName].length; i++) {
        if (this.events[eventName][i] === fn) {
          this.events[eventName].splice(i, 1);
          break;
        }
      };
    }
  },
  emit: function (eventName, data) {
    if (this.events[eventName]) {
      this.events[eventName].forEach(function(fn) {
        fn(data);
      });
    }
  }
};

const navbarView = (() => {

  // TOOD: indicator on mobile
  const indicator = (e) => {
    const marker = navbar.querySelector('.marker');
    if (navbar.offsetWidth < 600) {
      marker.style.left  = `${e.target.offsetLeft + 10}px`;
      marker.style.width = `${e.target.offsetWidth - 20}px`;
    } else {
      marker.style.display = 'none';
    }
  }

  const emitId = (e) => {
    events.emit('navClicked', e.target.parentNode.dataset.id);
  }

  const navItemsClick = () => {
    const navItems = navbar.querySelectorAll('.nav-item');
    navItems.forEach((item) => {
      item.addEventListener('click', emitId);
      item.addEventListener('click', indicator);
    });
  }

  const navbar = document.querySelector('nav');
  navItemsClick();
})();

const domController = (() => {

  const clearContent = () => {
    const content = document.querySelector('.content');
    while (content.firstChild) 
      content.removeChild(content.firstChild);
  }

  const fetchHtmlAsText = async (url) => {
    return await (await fetch(url)).text();
  }

  const loadPage = async (path) => {
    content.innerHTML = await fetchHtmlAsText(path);
  }

  const setView = (id) => {
    const views = [
      'home.html',
      'about.html',
      'projects.html'
    ];
    loadPage(`./views/${views[id]}`);
    // events.emit('pageLoaded', id);
  }

  const content = document.querySelector('.content');
  loadPage('./views/home.html')
  events.on('navClicked', clearContent);
  events.on('navClicked', setView);
})();

// const homeView = (() => {
//   const init = (id) => {
//     if (id == 0) {
//       setButtons();
//     }
//   }

//   const setButtons = () => {
//     const about = document.querySelector('.btn__about');
//     const proj  = document.querySelector('.btn__proj');

//     about.addEventListener('click', () => {
//       events.emit('navClicked', 1);
//     });
//   }

//   events.on('pageLoaded', init);
//   init(0);
// })();