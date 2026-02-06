// scripts/app.js
import { getSession } from './utils.js';
import { renderSidebar, initSidebarEvents } from './components/Sidebar.js';

const routes = {
    "public": ["/login"],
    "private": {
        "candidate": ["/dashboard", "/plans", "/matches"],
        "company": ["/dashboard", "/plans", "/subscription", "/create-offer", "/search"]
    }
};

async function router() {
    const hash = window.location.hash.replace('#', '') || '/login';
    const user = getSession();
    const sidebarContainer = document.getElementById('sidebar-root');
    const contentContainer = document.getElementById('content-root');

    // protect routes
    if (!user && !routes.public.includes(hash)) {
        window.location.hash = '#/login';
        return;
    }

    if (user && !routes.public.includes(hash)) {
        const allowed = routes.private[user.rol];
        if (!allowed.includes(hash)) {
            window.location.hash = allowed[0]; // home per defect
            return;
        }
    }

    // sidebar render
    if (user && hash !== '/login') {
        sidebarContainer.innerHTML = renderSidebar();
        initSidebarEvents();
    } else {
        sidebarContainer.innerHTML = '';
    }

    //load view
    const viewName = (hash === '/login') ? 'login' : (hash === '/dashboard') ? (user.rol === 'company' ? 'company' : 'candidate') : hash.replace('/', '');

    try {
        const response = await fetch(`./pages/${viewName}.html`);
        const html = await response.text();
        contentContainer.innerHTML = html;

        // load script dynamic on the page
        const script = document.createElement('script');
        script.type = 'module';
        script.src = `./scripts/${viewName}.js?v=${Date.now()}`;
        document.body.appendChild(script);
        
    } catch (err) {
        contentContainer.innerHTML = "<h2>Error 404: page not found</h2>";
    }
}

window.addEventListener('hashchange', router);
window.addEventListener('load', router);