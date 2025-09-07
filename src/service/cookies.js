import VueCookies from "vue-cookies";

const setCookies = (name, value, days = 1) => {
  VueCookies.set(name, value, `${days}d`, "/");
};

const getCookies = (name) => {
  return VueCookies.get(name);
};

const delCookies = (name) => {
  VueCookies.remove(name, "/");
};

export { setCookies, getCookies, delCookies };
