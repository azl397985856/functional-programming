const $ = require("jquery");
const { curry, compose, map } = require("ramda");

const { getUrlParam } = require("./utils");

import news from "../db/news.json";

const queryNews = curry((url, news) => {
  const title = getUrlParam("title", url.slice(url.indexOf("?")));

  return {
    items: news.filter(item => item.title.indexOf(title) !== -1)
  };
});
const ajax = (url, cb) =>
  setTimeout(() => cb(queryNews(url, news.items)), Math.random() * 1000);

const getJSON = curry((cb, url) => ajax(url, cb));
const setHtml = curry((selector, html) => $(selector).html(html));
const trace = curry((tag, x) => {
  console.log(tag, x);
  return x;
});

const getNewsByTitle = title =>
  `http://news.test.com/api/v2/news?title=${title}`;
const prop = curry((property, object) => object[property]);
const coverUrls = compose(
  map(prop("cover")),
  trace("items: "),
  prop("items")
);

const img = src => $("<img />", { src });

const images = compose(
  map(img),
  trace("coverUrls: "),
  coverUrls
);

const render = compose(
  setHtml("#main"),
  trace("iamges: "),
  images
);
const app = compose(
  getJSON(render),
  trace("news url: "),
  getNewsByTitle
);

app("hello world");
