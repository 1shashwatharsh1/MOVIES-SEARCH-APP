// Initial References
let movieNameRef = document.getElementById("movie-name");
let searchBtn = document.getElementById("search-btn");
let result = document.getElementById("result");
let getRecommendationsBtn = document.getElementById("get-recommendations-btn");
let recommendationsList = document.getElementById("recommendations-list");
let viewFavoritesBtn = document.getElementById("view-favorites-btn");
let topRatedList = document.getElementById('top-rated-list');

// Example array of movie names for recommendations
const movieRecommendations = [
  "Inception",
  "Interstellar",
  "The Matrix",
  "The Shawshank Redemption",
  "The Godfather",
  "Pulp Fiction",
  "Fight Club",
  "Forrest Gump",
  "The Dark Knight",
  "The Lord of the Rings"
];

// Store favorite movies
const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// Function to fetch data from API
let getMovie = () => {
  let movieName = movieNameRef.value;
  let url = `http://www.omdbapi.com/?t=${movieName}&apikey=${key}`;
  
  if (movieName.length <= 0) {
    result.innerHTML = `<h3 class="msg">Please Enter A Movie Name</h3>`;
  } else {
    fetch(url)
      .then((resp) => resp.json())
      .then((data) => {
        if (data.Response === "True") {
          result.innerHTML = `
            <div class="info">
              <img src="${data.Poster}" class="poster">
              <div>
                <h2>${data.Title}</h2>
                <div class="rating">
                  <img src="./NEW/assets/star.png">
                  <h4>${data.imdbRating}</h4>
                </div>
                <div class="details">
                  <span>${data.Rated}</span>
                  <span>${data.Year}</span>
                  <span>${data.Runtime}</span>
                </div>
                <div class="genre">
                  <div>${data.Genre.split(",").join("</div><div>")}</div>
                </div>
              </div>
            </div>
            <h3>Plot:</h3>
            <p>${data.Plot}</p>
            <h3>Cast:</h3>
            <p>${data.Actors}</p>
            <button id="favorite-btn" class="glass">Add to Favorites</button>
          `;
          
          // Attach event listener to the new button
          document.getElementById('favorite-btn').addEventListener('click', () => addToFavorites(data));
        } else {
          result.innerHTML = `<h3 class='msg'>${data.Error}</h3>`;
        }
      })
      .catch(() => {
        result.innerHTML = `<h3 class="msg">Error Occurred</h3>`;
      });
  }
};

// Function to add a movie to favorites
const addToFavorites = (movie) => {
  if (!favorites.some(fav => fav.imdbID === movie.imdbID)) {
    favorites.push(movie);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    alert('Movie added to favorites!');
  } else {
    alert('Movie is already in favorites!');
  }
};

// Function to view favorites
const viewFavorites = () => {
  if (favorites.length === 0) {
    result.innerHTML = '<h3 class="msg">No favorites yet!</h3>';
    return;
  }
  result.innerHTML = `<h2>Favorite Movies</h2><ul>${favorites.map(movie => `
    <li>
      <img src="${movie.Poster}" class="poster">
      <h3>${movie.Title}</h3>
    </li>`).join('')}</ul>`;
};

// Function to get random movie recommendations
const getRandomRecommendations = () => {
  recommendationsList.innerHTML = '';
  
  let shuffled = movieRecommendations.sort(() => 0.5 - Math.random());
  let topRecommendations = shuffled.slice(0, 5);
  
  topRecommendations.forEach(movie => {
    let listItem = document.createElement("li");
    listItem.textContent = movie;
    listItem.addEventListener("click", () => {
      movieNameRef.value = movie;
      getMovie();
    });
    recommendationsList.appendChild(listItem);
  });
};

// Function to fetch and display top-rated movies
const getTopRatedMovies = () => {
  const url = `http://www.omdbapi.com/?s=top+rated&apikey=${key}`; // Modify the endpoint if necessary

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.Response === 'True') {
        const movies = data.Search;
        topRatedList.innerHTML = '';

        movies.forEach(movie => {
          const movieItem = document.createElement('li');
          movieItem.innerHTML = `
            <img src="${movie.Poster}" alt="${movie.Title}" class="movie-poster" />
            <h4>${movie.Title} (${movie.Year})</h4>
          `;
          topRatedList.appendChild(movieItem);
        });
      } else {
        topRatedList.innerHTML = `<li>No top rated movies found.</li>`;
      }
    })
    .catch(() => {
      topRatedList.innerHTML = `<li>Error fetching top rated movies.</li>`;
    });
};

// Function to populate Movie News section with sample news
const populateNews = () => {
  const newsContainer = document.getElementById('news-container');
  const newsItems = [
    {
      image: 'https://via.placeholder.com/100x75?text=News1',
      text: 'Marvel Studios announces the next phase of their cinematic universe with exciting new projects and release dates.',
    },
    {
      image: 'https://via.placeholder.com/100x75?text=News2',
      text: 'The upcoming film "Eclipse" has just dropped its first teaser trailer, hinting at a thrilling storyline.',
    },
    {
      image: 'https://via.placeholder.com/100x75?text=News3',
      text: 'Critics are raving about the new sci-fi epic "Stellar Journey," calling it one of the best space adventures of the decade.',
    }
  ];

  newsContainer.innerHTML = newsItems.map(item => `
    <div class="news-item">
      <img src="${item.image}" alt="News Image" />
      <p>${item.text}</p>
    </div>
  `).join('');
};
// Get the button element by its ID
const backButton = document.getElementById('back-button');

// Add an event listener to the button
backButton.addEventListener('click', () => {
  // Use the window.location object to redirect to the homepage
  window.location.href = '/';
});
// Event listeners
searchBtn.addEventListener("click", getMovie);
getRecommendationsBtn.addEventListener("click", getRandomRecommendations);
viewFavoritesBtn.addEventListener("click", viewFavorites);
window.addEventListener("load", () => {
  getTopRatedMovies();
  populateNews();
});
// Set API endpoint and API key
const omdbApiUrl = 'https://www.omdbapi.com/';
const omdbApiKey = '817f60ef';

// Set parameters for API request
const params = {
  s: 'movie', // Search for movies
  type: 'news', // Get news articles
  r: 'json', // Return data in JSON format
  apikey: omdbApiKey
};

// Make API request using fetch
fetch(`${omdbApiUrl}?${new URLSearchParams(params)}`)
  .then(response => response.json())
  .then(data => {
    // Process data and display movie news in left panel
    const newsContainer = document.getElementById('news-container');
    const newsHtml = '';
    data.Search.forEach((article) => {
      newsHtml += `
        <h3>${article.Title}</h3>
        <p>${article.Year}</p>
        <p>${article.Plot}</p>
      `;
    });
    newsContainer.innerHTML = newsHtml;
  })
  .catch(error => {
    console.error(error);
  });

