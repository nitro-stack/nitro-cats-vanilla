const appEl = document.getElementById('app');
const baseUrl = 'http://localhost:3000';

const service = {
  async getCats() {
    const res = await fetch(`${baseUrl}/cats`)
    const json = await res.json()
    return json;
  },
  async updateCat(cat) {
    const res = await fetch(`${baseUrl}/cats/${cat.id}`, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(cat)
    })
    return await res.text();
  },
  async removeCat(id) {
    const res = await fetch(`${baseUrl}/cats/${id}`, {
      method: 'DELETE'
    })
    return await res.text();
  }
}

Handlebars.registerHelper('toJSON', function (obj) {
  return JSON.stringify(obj);
});

async function hashHandler() {
  console.log('The hash has changed!', location.hash);
  const hash = !location.hash ? '#/' : location.hash;
  appEl.innerHTML = await routes[hash]();
}

async function paw(cat) {
  let updatedCat = { ...cat, rating: parseInt(cat.rating) + 1};
  //  .post(`${this.baseUrl}/cats/${id}/paw`, { rating })
  // so PUT call to update 
  const text = await service.updateCat(updatedCat);
  
  console.log(`Kitty updated`, text);
  appEl.innerHTML = await routes['#/latest']();
}

async function removeKitty(id) {
  let yes = confirm(`Really remove kitty ${id} ?`)
  if (yes) {
    const text = await service.removeCat(id);
    console.log(`Kitty updated`, text);
  }
  appEl.innerHTML = await routes['#/latest']();
}

async function init() {
  const hash = !location.hash ? '#/' : location.hash;
  appEl.innerHTML = await routes[hash]();
}

function buildTemplate(tmpId, context) {
  var template = $('#' + tmpId).html();

  // Compile the template data into a function
  var templateScript = Handlebars.compile(template);
  var html = templateScript(context);
  return html;
}

const routes = {
  '#/': () => {
    return 'default page'
  }, 
  '#/latest': async() => {
    const json = await service.getCats();
    return buildTemplate('cats-list', { cats: json })
  },
  '#/top': async() => {
    const json = await service.getCats();
    return buildTemplate('cats-list', { cats: json })
  },
  '#/submit': () => {
    return buildTemplate('cat-submit', {})
  }
}

init();

window.addEventListener('hashchange', hashHandler, false);