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

  const emitId = (e) => {
    events.emit('navClicked', e.target.parentNode.dataset.id);
  }

  const navItemsClick = () => {
    const navbar = document.querySelector('nav');
    const navItems = navbar.querySelectorAll('.nav-item');
    navItems.forEach((item) => {
      item.addEventListener('click', emitId);
    });
  }

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
  }

  const content = document.querySelector('.content');
  loadPage('./views/home.html')
  events.on('navClicked', clearContent);
  events.on('navClicked', setView);
})();

const homeView = (() => {
  const aboutClick = () => {
    events.emit('navClicked', 1);
  }

  const projectsClick = () => {
    events.emit('navClicked', 2);
  }

  return { 
    aboutClick,
    projectsClick
  };
})();