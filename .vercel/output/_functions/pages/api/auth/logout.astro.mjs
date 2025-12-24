import { c as clearUserSession } from '../../../chunks/auth_CSCHR02c.mjs';
export { renderers } from '../../../renderers.mjs';

const GET = async ({ cookies, redirect }) => {
  clearUserSession(cookies);
  return redirect("/");
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
