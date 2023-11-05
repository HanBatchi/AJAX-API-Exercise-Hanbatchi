"use strict";

// Default URL for missing images
const defaultUrl = "https://tinyurl.com/missing-tv";
// TV Maze API base URL
const tvmazeUrl = "http://api.tvmaze.com/";

const $showsList = $("#showsList");
const $episodesList = $("#episodesList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
    const response = await axios({
      baseURL : tvmazeUrl,
      url: "search/shows",
      method: "GET",
      params: {
        q:term,
      },
    });

    // const shows =
    return response.data.map(result =>{
      const show = result.show;
      return{
        id: show.id,
        name: show.name,
        summary: show.summary,
        image: show.image ? show.image.medium : defaultUrl,
      };
    });

}

/** Given list of shows, create markup for each and to DOM */

function createShowCard(show) {
  const showCard = document.createElement('div');
  showCard.className = 'Show col-md-12 col-lg-6 mb-4';
  showCard.setAttribute('data-show-id', show.id);

  const mediaDiv = document.createElement('div');
  mediaDiv.className = 'media';

  const img = document.createElement('img');
  img.src = show.image;
  img.alt = show.name;
  img.className = 'w-25 me-3';

  const mediaBody = document.createElement('div');
  mediaBody.className = 'media-body';

  const title = document.createElement('h5');
  title.className = 'text-primary';
  title.textContent = show.name;

  const summary = document.createElement('div');
  summary.innerHTML = `<small>${show.summary}</small>`;

  const episodesButton = document.createElement('button');
  episodesButton.className = 'btn btn-outline-light btn-sm Show-getEpisodes';
  episodesButton.textContent = 'Episodes';

  mediaBody.appendChild(title);
  mediaBody.appendChild(summary);
  mediaBody.appendChild(episodesButton);

  mediaDiv.appendChild(img);
  mediaDiv.appendChild(mediaBody);

  showCard.appendChild(mediaDiv);

  // Create elements and set their attributes and content
  return showCard;
}

/** 
 * Populate the shows list in the DOM with the provided shows array.
 */

function populateShows(shows) {
  const showsList = document.getElementById('showsList');
  showsList.innerHTML = '';

  for (let show of shows) {
      const showCard = createShowCard(show);
      showsList.appendChild(showCard);
  }
}

/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

// Attach a submit event handler to the search form
$searchForm.on("submit", async function (e) {
  e.preventDefault();
  await searchForShowAndDisplay();
});

// async function getEpisodesOfShow(id) { }
async function getEpisodes(showId) {
    const response = await axios({
      baseURL: `http://api.tvmaze.com/`,
      url: `shows/${showId}/episodes`,
      method: "GET",
    });
    const episodes = response.data.map((episode) => ({
      id: episode.id,
      name: episode.name,
      season: episode.season,
      number: episode.number,
    }));
    return episodes;
}

// function populateEpisodes(episodes) { }

function populateEpisodes(episodes) {
  const $episodesList = $('#episodesList');
  $episodesList.empty();

  episodes.forEach((episode) => {
      const $episodeItem = $('<li>', {
          text: `${episode.name} (season ${episode.season}, number ${episode.number})`,
      });
      $episodesList.append($episodeItem);
  });
}

// Attach a click event handler to the shows list to get episodes for a show
$showsList.on('click', '.Show-getEpisodes', async function () {
  const $showCard = $(this).closest('.Show');
  const showId = $showCard.data('show-id');
  const episodes = await getEpisodes(showId);
  populateEpisodes(episodes);
  $episodesArea.show();
});
