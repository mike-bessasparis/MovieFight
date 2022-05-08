const myAPIKey = "ea5fd99";
let rightMovieData;
let leftMovieData;
//
//
const onMovieSelect = async (movie, summaryElement, side) => {
    let response = await axios.get("http://omdbapi.com/", {
        params: {
            apikey: myAPIKey,
            i: movie.imdbID,
        },
    });
    summaryElement.innerHTML = movieTemplate(response.data);

    switch (side) {
        case "left":
            leftMovieData = response.data;
            break;
        case "right":
            rightMovieData = response.data;
            break;
        default:
            break;
    }

    if (leftMovieData && rightMovieData) {
      runComparison();
    }

};

const runComparison = () => {
    let leftSideStats = document.querySelectorAll('#left-summary .notification');
    let rightSideStats = document.querySelectorAll('#right-summary .notification');

    leftSideStats.forEach((leftStat, index) => {
        let rightStat = rightSideStats[index];

        if (parseFloat(rightStat.dataset.value) > parseFloat(leftStat.dataset.value)) {
            leftStat.classList.remove('is-primary');
            leftStat.classList.add('is-warning');
        } else {
            rightStat.classList.remove('is-primary');
            rightStat.classList.add('is-warning');
        }

    })
    
};

//
const movieTemplate = (movieDetail) => {

        let dollars = parseInt(movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, ''));
        let metascore = parseInt(movieDetail.Metascore);
        let imdbRating = parseFloat(movieDetail.imdbRating);
        let imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''));
        
        let awards = movieDetail.Awards.split(' ').reduce((total, amount) => {
            let value = parseInt(amount); //used to skip over the words and cast as integers vice strings
            if (!isNaN(value)) {
                return total + value
            } else {
                return total
            }
        }, 0);

        console.log(awards);
    
    return `
        <article class="media">
            <figure class="media-left">
                <p class="image">
                    <img src="${movieDetail.Poster}" />
                </p>
            </figure>
            <div class="media-content">
                <div class="content">
                    <h1>${movieDetail.Title}</h1>
                    <h4>${movieDetail.Genre}</h4>
                    <p>${movieDetail.Plot}</p>
                </div>
            </div>
        </article>
        <article data-value=${awards} class="notification is-primary">
            <p class="title">${movieDetail.Awards}</p>
            <p class="subtitle">Awards</p>
        </article>
        <article data-value=${dollars} class="notification is-primary">
            <p class="title">${movieDetail.BoxOffice}</p>
            <p class="subtitle">Box Office</p>
        </article>
        <article data-value=${metascore} class="notification is-primary">
            <p class="title">${movieDetail.Metascore}</p>
            <p class="subtitle">Metascore</p>
        </article>
        <article data-value=${imdbRating} class="notification is-primary">
            <p class="title">${movieDetail.imdbRating}</p>
            <p class="subtitle">imbd Rating</p>
        </article>
        <article data-value=${imdbVotes} class="notification is-primary">
            <p class="title">${movieDetail.imdbVotes}</p>
            <p class="subtitle">imdb Votes</p>
        </article>
    `;
};


///////////////////////////////////////////////////////////////////////////////////////////

const autoCompleteConfig = {
    renderOption(movie) {
        let imgSrc = movie.Poster === "N/A" ? "" : movie.Poster;
        return `
            <img src="${imgSrc}"/>
            ${movie.Title} (${movie.Year})
        `;
    },
    inputValue(movie) {
        return movie.Title;
    },
    async fetchData(searchTerm) {
        const response = await axios.get("http://omdbapi.com/", {
            params: {
                apikey: myAPIKey,
                s: searchTerm,
            },
        });

        if (response.data.Error) {
            searchResult = [];
        } else {
            searchResult = response.data.Search;
        }
        return searchResult;
    },
};

createAutoComplete({
    ...autoCompleteConfig,
    root: document.querySelector("#left-autocomplete"),
    onOptionSelect(movie) {
        document.querySelector(".tutorial").classList.add("is-hidden");
        onMovieSelect(movie, document.querySelector("#left-summary"), 'left');
    },
});

createAutoComplete({
    ...autoCompleteConfig,
    root: document.querySelector("#right-autocomplete"),
    onOptionSelect(movie) {
        document.querySelector(".tutorial").classList.add("is-hidden");
        onMovieSelect(movie, document.querySelector("#right-summary"), 'right');
    },
});
