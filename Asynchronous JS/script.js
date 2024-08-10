'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');


// const countries = [
//     'nigeria', 'kenya', 'egypt', 'south africa', 'ghana', // Africa
//     'china', 'india', 'japan', 'south korea', 'indonesia', // Asia
//     'germany', 'france', 'italy', 'spain', 'netherlands', // Europe
//     'canada', 'usa', 'mexico', 'guatemala', 'cuba', // North America
//     'brazil', 'argentina', 'colombia', 'chile', 'peru', // South America
//     'australia', 'new zealand', 'fiji', 'papua new guinea', 'samoa', // Oceania
//     'antarctica' // Antarctica
//   ];




const renderCountry = function(data, className = '') {
    const html = `
       <article class="country ${className}">
        <img class="country__img" src="${data.flags.png}" />
        <div class="country__data">
          <h3 class="country__name">${data.name.common}</h3>
          <h4 class="country__region">${data.region}</h4>
          <p class="country__row"><span>👫</span>${(
            data.population / 1000000
          ).toFixed(1)} million people</p>
          <p class="country__row"><span>🗣️</span>${data.languages ? Object.values(data.languages)[0] : 'N/A'}</p>
          <p class="country__row"><span>💰</span>${data.currencies ? Object.values(data.currencies)[0].name : 'N/A'}</p>
        </div>
      </article>
    `;
    countriesContainer.insertAdjacentHTML('beforeend', html);
    countriesContainer.style.opacity = 1;
  };
  

  
const getCountryAndNeighbour = function (country) {
    const request = new XMLHttpRequest();
    request.open('GET', `https://restcountries.com/v3.1/name/${country}`);
    request.send();
  
    request.addEventListener('load', function () {
      const [data] = JSON.parse(this.responseText);
      console.log(data);
      
      // Render the main country
      renderCountry(data,'country');
  
      const neighbours = data.borders || [];
      if (neighbours.length === 0) {
        console.log('No neighboring countries found.');
        return;
      }
  
      for (let i of neighbours) {
        const request2 = new XMLHttpRequest();
        request2.open('GET', `https://restcountries.com/v3.1/alpha/${i}`);
        request2.send();
  
        request2.addEventListener('load', function () {
          const data2 = JSON.parse(this.responseText);
          console.log(data2);
  
          renderCountry(data2[0], 'neighbour');
        });
      }
    });
  };
  
  
// getCountryAndNeighbour('china');


// const getCountryData = function (country) {
//   fetch(`https://restcountries.com/v3.1/name/${country}`).then(function (response) {
//     return response.json();  // Ensure you parse the JSON from the response
//   }).then(function (data) {
//     console.log(data);
//     renderCountry(data[0]);
//   }).catch(function (error) {
//     console.error('Error fetching country data:', error);
//   });
// };

const getJSON = function (url, errormessage="Something went wrong") {
    return fetch(url).then(response => 
      {
      if (!response. ok) throw new Error(`${errormessage} (${response.status})`) ;
      return response.json();
    });
};


// const getCountryData = function (country) {
//   fetch(`https://restcountries.com/v3.1/name/${country}`)
//     .then(response => {

//       console.log(response);

//       console.log(response.ok);

//       if(!response.ok) {
//           throw new Error(`Country: ${country} not found ->${response.status}`)
//       }

//       return response.json()})

//     .then(data => {
//       renderCountry(data[0]);
//       const neighbour = data[0].borders?.[0];

//       if(!neighbour) return;

//       country-2
//       return fetch(`https://restcountries.com/v3.1/alpha/${neighbour}`)

//     })

//     .then(response => response.json())
//     .then((data) => renderCountry(data[0], 'neighbour'))
//     .catch(error => countriesContainer.insertAdjacentText('beforeend',error.message))
//     .finally(() => countriesContainer.style.opacity = 1)

// };

const getCountryData = function (country) {
  //country-1
  getJSON(`https://restcountries.com/v3.1/name/${country}`,`Country: ${country} not found`)
    .then(data => {
      renderCountry(data[0]);
      const neighbour = data[0].borders?.[0];

      if(!neighbour) throw new Error('No Neighboring Country Found');

      //country-2
      return getJSON(`https://restcountries.com/v3.1/alpha/${neighbour}`,`Country: ${country} not found`)

    })

    
    .then((data) => renderCountry(data[0], 'neighbour'))
    .catch(error => countriesContainer.insertAdjacentText('beforeend',error.message))
    .finally(() => countriesContainer.style.opacity = 1)

};

// btn.addEventListener("click", function () {
//   getCountryData('India');
// })

// const whereAmI = function(lat,lng){
//   fetch(
//     `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
//   )
//     .then(response => {
//        if (response.status === 400 || !response.ok) {
//          throw new Error(`No country found in these coordinates. Purinjika Machan`);
//        }
//     //console.log(response);
//     return response.json();
//     })
//     .then(data => {
//       console.log(data);
//       if (!data.city || !data.countryName) {
//         throw new Error('Location data is incomplete.');
//       }
//       console.log(`You are in ${data.city}, ${data.countryName.toLowerCase()}`);
//       //renderCountry(data.countryName.toLowerCase())
//       return fetch(`https://restcountries.com/v3.1/name/${data.countryName.toLowerCase()}`)
//     })
//     .then(response => response.json()).then(data => renderCountry(data[0]))
//     .catch(error => countriesContainer.insertAdjacentText('beforeend',error.message))
//     .finally(() => countriesContainer.style.opacity = 1)
// }
//  whereAmI(12.718941, 77.820787); // San Francisco coordinates

const getPosition = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};


// const whereAmI = function(){
//   getPosition().then(position => {
//     const {latitude:lat,longitude:lng} = position.coords;
//     return fetch(
//       `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
//     )
//   })
//     .then(response => {
//        if (response.status === 400 || !response.ok) {
//          throw new Error(`No country found in these coordinates. Purinjika Machan`);
//        }
//     //console.log(response);
//     return response.json();
//     })
//     .then(data => {
//       console.log(data);
//       if (!data.city || !data.countryName) {
//         throw new Error('Location data is incomplete.');
//       }
//       console.log(`You are in ${data.city}, ${data.countryName.toLowerCase()}`);
//       //renderCountry(data.countryName.toLowerCase())
//       return fetch(`https://restcountries.com/v3.1/name/${data.countryName.toLowerCase()}`)
//     })
//     .then(response => response.json()).then(data => renderCountry(data[0]))
//     .catch(error => countriesContainer.insertAdjacentText('beforeend',error.message))
//     .finally(() => countriesContainer.style.opacity = 1)
// }


// btn.addEventListener("click", function () {
//   whereAmI();
// })


const whereAmI = async function () {
  try {
    // Geolocation
    const pos = await getPosition();
    const { latitude: lat, longitude: lng } = pos.coords;

    // Reverse geocoding
    const resGeo = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`);
    if (!resGeo.ok) throw new Error('Problem with geocoding');
    const dataGeo = await resGeo.json();
    console.log(dataGeo);

    // Country data
    const res = await fetch(`https://restcountries.com/v3.1/name/${dataGeo.countryName}`);
    if (!res.ok) throw new Error('Problem with country data');
    const data = await res.json();
    console.log(data);
    renderCountry(data[0]);
    return(`You are in ${dataGeo.city}`);
  } catch (err) {
    console.error(`${err.message}`);
  }
};


// console.log("I will be printed before call")
// const city=whereAmI();
// console.log(city);

/*
I will be printed before call
Promise {<pending>}
  [[Prototype]]: Promise
  [[PromiseState]]: "fulfilled"
  [[PromiseResult]]: "You are in Hosur"
{latitude: 12.718941, lookupSource: 'coordinates', longitude: 77.820787, localityLanguageRequested: 'en', continent: 'Asia', …}
(2) [{…}, {…}]
*/

// console. log('1: Will get location');
// whereAmI().then(city => console.log(city));
// console. log('2: Finished getting location');


const get3Countries = async function(cl, c2, c3) {
  try {
  // const [data1]=await getJSON(`https://restcountries.com/v3.1/name/${cl}`,'Load aagala pa -->1');
  // const [data2]=await getJSON(`https://restcountries.com/v3.1/name/${c2}`,'Load aagala pa -->2');
  // const [data3]=await getJSON(`https://restcountries.com/v3.1/name/${c3}`,'Load aagala pa -->3');
  //console.log([data1.capital,data2.capital,data3.capital]);

  const data = await Promise.all([  // if one promise.all rejects, then the whole promise.all rejects as well
    getJSON(`https://restcountries.com/v3.1/name/${cl}`,'Load aagala pa -->1'),
    getJSON(`https://restcountries.com/v3.1/name/${c2}`,'Load aagala pa -->2'),
    getJSON(`https://restcountries.com/v3.1/name/${c3}`,'Load aagala pa -->3')
  ]);
  
  console.log(data.map(d => d[0].capital))
  } 
  
  catch(err) {
    console.error(err);
  }
  }

get3Countries('portugal','usa','singapore');



// Promise.race
(async function () {
  const res = await Promise.race([
    getJSON(`https://restcountries.com/v3.1/name/egypt`),
    getJSON(`https://restcountries.com/v3.1/name/mexico`),
    getJSON(`https://restcountries.com/v3.1/name/italy`),
   
    
  ]);
  console.log("Next paa.......");
  console.log(res);
})();


// Promise.allSettled
Promise.allSettled([
  Promise.resolve('Success'),
  Promise.reject('ERROR'),
  Promise.resolve('Another success'),
]).then(res => console.log('Promise.allSettled',res));

// Promise.all
Promise.all([
  Promise.resolve('Success'),
  Promise.reject('ERROR'),
  Promise.resolve('Another success'),
])
  .then(res => console.log('Promise.all',res))
  .catch(err => console.error('Promise.all',err));

// Promise.any
Promise.any([
  //Promise.resolve('Success'),
  Promise.reject('ERROR'),
  //Promise.resolve('Another success'),
])
  .then(res => console.log('Promise.any',res))
  .catch(err => console.error('Promise.any',err));


  const imagePaths = ['img/img-1.jpg', 'img/img-2.jpg']; // Array of image paths
  let currentImg;
  
  function createImage(imgPath) {
    return new Promise((resolve, reject) => {
      const img = document.createElement('img');
      img.src = imgPath;
      img.onload = () => {
        document.body.append(img);
        resolve(img);
      };
      img.onerror = () => reject(new Error('Image not found'));
    });
  }
  
  function wait(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
  }
  
  async function loadImagesSequentially() {
    try {
      for (let i = 0; i < imagePaths.length; i++) {
        const imgPath = imagePaths[i];
        currentImg = await createImage(imgPath);
        console.log(`Image ${i + 1} loaded`);
        await wait(2);
        currentImg.style.display = 'none';
      }
    } catch (err) {
      console.error(err);
    }
  }
  
  loadImagesSequentially();
  