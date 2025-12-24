import { renderers } from './renderers.mjs';
import { c as createExports } from './chunks/entrypoint_CtqoypWN.mjs';
import { manifest } from './manifest_mCXyOy9Z.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/admin/dashboard.astro.mjs');
const _page2 = () => import('./pages/admin/users.astro.mjs');
const _page3 = () => import('./pages/api/admin/actions.astro.mjs');
const _page4 = () => import('./pages/api/admin/active-shifts.astro.mjs');
const _page5 = () => import('./pages/api/admin/dashboard-stats.astro.mjs');
const _page6 = () => import('./pages/api/admin/schedules.astro.mjs');
const _page7 = () => import('./pages/api/admin/telegram-check-link.astro.mjs');
const _page8 = () => import('./pages/api/admin/telegram-settings.astro.mjs');
const _page9 = () => import('./pages/api/admin/telegram-test-message.astro.mjs');
const _page10 = () => import('./pages/api/auth/callback.astro.mjs');
const _page11 = () => import('./pages/api/auth/logout.astro.mjs');
const _page12 = () => import('./pages/api/download-csv.astro.mjs');
const _page13 = () => import('./pages/api/server-users.astro.mjs');
const _page14 = () => import('./pages/api/update-hours.astro.mjs');
const _page15 = () => import('./pages/api/user-stats.astro.mjs');
const _page16 = () => import('./pages/dashboardindex.astro.mjs');
const _page17 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/admin/dashboard.astro", _page1],
    ["src/pages/admin/users.astro", _page2],
    ["src/pages/api/admin/actions.ts", _page3],
    ["src/pages/api/admin/active-shifts.ts", _page4],
    ["src/pages/api/admin/dashboard-stats.ts", _page5],
    ["src/pages/api/admin/schedules.ts", _page6],
    ["src/pages/api/admin/telegram-check-link.ts", _page7],
    ["src/pages/api/admin/telegram-settings.ts", _page8],
    ["src/pages/api/admin/telegram-test-message.ts", _page9],
    ["src/pages/api/auth/callback.ts", _page10],
    ["src/pages/api/auth/logout.ts", _page11],
    ["src/pages/api/download-csv.ts", _page12],
    ["src/pages/api/server-users.ts", _page13],
    ["src/pages/api/update-hours.ts", _page14],
    ["src/pages/api/user-stats.ts", _page15],
    ["src/pages/dashboardIndex.astro", _page16],
    ["src/pages/index.astro", _page17]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "397f5228-ed82-4c2d-9b98-bd7d890d00ad",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;

export { __astrojsSsrVirtualEntry as default, pageMap };
