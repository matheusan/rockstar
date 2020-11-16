import Api from './api';

export default class MovieDb {
  api = new Api(process.env.REACT_APP_API_ENDPOINT);
  language = 'en-US';
  includeAdult = false;

  async getMovies(sortBy = 'popularity.desc', page = 1, rating = 0) {
    const ratings = range => range === 0 ? {} : ({
      'vote_average.gte': range === 0 ? 0 : range,
      'vote_average.lte': range + 2
    })

    const movies = await this.api.get('discover/movie', {
      params: {
        language: this.language,
        sort_by: sortBy,
        include_adult: this.includeAdult,
        include_video: false,
        page,
        ...ratings(rating)
      },
    });

    return movies;
  }

  async searchMovies(query = '', sortBy = 'popularity.desc', page = 1) {
    return this.api.get('search/movie', {
      params: {
        language: this.language,
        sort_by: sortBy,
        include_adult: this.includeAdult,
        include_video: false,
        page,
        query
      },
    });
  }

  async getMovieDetails(movieId = null) {
    const movies = await this.api.get(`movie/${movieId}`, {
      params: {
        language: this.language
      },
    });

    return movies;
  }

  async getGenres() {
    const genres = await this.api.get('/genre/movie/list', {
      params: {
        language: this.language
      },
    });

    return genres;
  }
};

// https://api.themoviedb.org/3/discover/movie?api_key=<<api_key>>&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1
