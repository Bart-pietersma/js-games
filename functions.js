function importCss(path){
  let name = path.split('/');
  const last = name.length -1;
  name = name[last].split('.');
  name = name[0];
      const cssId = name;  // you could encode the css path itself to generate id..
          if (!document.getElementById(cssId)) {
            var head = document.getElementsByTagName('head')[0];
            var link = document.createElement('link');
            link.id = cssId;
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = path;
            link.media = 'all';
            head.appendChild(link);
          }
  }

function makeElement(type , id){
  const item = document.createElement(type);
  if (id) item.id = id;
  return item
}

// Simple hash function to generate a seed from a string
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// PRNG function (using a simple linear congruential generator)
function seededRandom(seed) {
  let m = 0x80000000; // 2^31
  let a = 1103515245;
  let c = 12345;
  
  seed = (seed * a + c) % m;
  return seed / (m - 1);
}

// Get the current date and format it as a string (YYYY-MM-DD)
function getCurrentDateString() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function dailyNumber(number){
  // Generate a seed based on the current date
  const currentDateString = getCurrentDateString();
  const seed = hashString(currentDateString);
  
  // Generate a pseudo-random number using the seed
  const randomValue = seededRandom(seed);
  
  console.log(`Seed: ${seed}`);
  console.log(`Random value for ${currentDateString}: ${randomValue}`);
  return Math.floor(randomValue * (number +1));
}





  export {importCss , makeElement , dailyNumber,}