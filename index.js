const fetch = require('node-fetch');
const fs = require('fs');
const spawnPromise = require('./lib/spawn-promise');

const MAX_PAGES = 34;
const baseUrl = 'https://api.github.com/search/repositories?q=language:javascript&sort=stars';

const processPage = async (page) => {
  const pageData = await fetchPage(page);
  
  pageData.items.reduce((cur, next) => {
    return cur.then(() => {
      return lintItem(next);
    });
  }, Promise.resolve());
}

const fetchPage = (page) => {
  return fetch(`${baseUrl}&page=${page}`)
    .then((res) => res.json());
};

const lintItem = async (item) => {
  const {
    clone_url: cloneUrl,
    name
  } = item;

  console.log(cloneUrl);

  const linterOutput = await spawnPromise(
    './lint-command.sh',
    [
      cloneUrl
    ]
  );
  
  fs.writeFileSync(`./output/${name}.json`, JSON.stringify({
    githubData: item,
    linterOutput: JSON.parse(linterOutput)
  }));
}

processPage(1).catch(console.error);