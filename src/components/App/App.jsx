import React, { useEffect, useState, useRef } from 'react';
import {
  Button,
  Container,
  Dimmer,
  Header,
  Input,
  Rating,
  Loader,
  Menu,
  Segment,
  Divider,
} from 'semantic-ui-react';
import GridGallery from '../GridGallery/GridGallery';
import { movieDbApi } from '../../api';

import MainHeader from '../Header';
import MovieDetails from '../MovieDetails/MovieDetails';

function debounce (fn, wait) {
  let t;
  return function () {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, arguments), wait);
  }
}

const HomepageHeading = ({ setSearchResults }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const throttled = useRef(debounce(queryString => doSearch(queryString), 500));

  useEffect(() => {
    if (searchQuery === '') {
      setSearchResults({
        query: '',
        results: []
      })
    }

    if (searchQuery.length > 1) {
      throttled.current(searchQuery)
    }
  }, [searchQuery]);

  const doSearch = query => movieDbApi.searchMovies(query)
      .then(results => setSearchResults({
        query,
        ...results
      }));

  const handleInput = event => {
    const { value } = event.currentTarget;
    setSearchQuery(value);
  }

  return (
    <Container>
      <Header
        as='h1'
        content='Your favourite movies. Explained.'
        inverted
        style={{
          fontSize: '4em',
          fontWeight: 'normal',
          marginBottom: 0,
          marginTop: '3em',
        }}
      />
      <Header
        as='h2'
        content='Figure out what happened. Then find out why.'
        inverted
        style={{
          fontSize: '1.7em',
          fontWeight: 'normal',
          marginTop: '.5em',
        }}
      />
      <Input
        icon='search'
        placeholder='Search for a movie...'
        style={{ marginTop: '3.5em' }}
        value={searchQuery}
        onChange={handleInput}
      />
    </Container>
  )
}

const App = () => {
  const [results, setResults] = useState({ total_pages: 1, movies: [] });
  const [page, setPage] = useState(1);
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [openMovie, setOpenMovie] = useState(null);
  const [movieDetail, setMovieDetail] = useState({});
  const [searchResults, setSearchResults] = useState({query: '', results: []});

  const handlePaginationChange = (e, { activePage }) => setPage(activePage);
  const openMovieDetail = movieId => {
    setOpenMovie(movieId)
  };
  const closeMovieDetail = () => setOpenMovie(null);

  const onRate = (e, {rating: newRating}) => {
    if (newRating === rating) {
      setRating(0);
    } else {
      setRating(newRating);
    }
    setPage(1);
  };

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const moviesList = await movieDbApi.getMovies('popularity.desc', page, rating);
      setResults({
        movies: moviesList.results,
        total_pages: moviesList.total_pages
      });
      setLoading(false);
    }
    fetchData();
  }, [page, rating]);

  useEffect(() => {
    async function getMovieDetails() {
      const movieDetails = await movieDbApi.getMovieDetails(openMovie);
      setMovieDetail(movieDetails);
    }

    if (openMovie !== null) {
      getMovieDetails();
    }
  }, [openMovie]);

  return (
    <>
      <MainHeader>
        <Menu
            inverted
            pointing
            secondary
            size='large'
          >
            <Container>
              <Menu.Item as='span'>
                TMDB
              </Menu.Item>
              <Menu.Item as='a'>Browse+</Menu.Item>
              <Menu.Item position='right'>
                <Button as='a' inverted>
                  Log in
                </Button>
                <Button as='a' inverted style={{ marginLeft: '0.5em' }} color='red'>
                  Sign Up
                </Button>
              </Menu.Item>
            </Container>
          </Menu>
        <HomepageHeading setSearchResults={setSearchResults} />
      </MainHeader>

      <Segment style={{ padding: '2em 0em' }} vertical>
        <Container text>
          <Dimmer active={loading}>
            <Loader />
          </Dimmer>
          {searchResults.query === '' && results.movies.length > 0 ? (
            <>
              <strong>Filter by rating: </strong>
              <Rating icon='star' rating={rating} maxRating={5} onRate={onRate} />
              <Divider />
              <GridGallery
                featuredFirst
                movies={results.movies}
                page={page}
                totalPages={results.total_pages}
                onPageChange={handlePaginationChange}
                onClickMovie={openMovieDetail}
              />
            </>
          ) : <></>}
          
          {searchResults.query !== '' && results.movies.length > 0 ? (
            <>
              <Header as='h4'>Searching for "{searchResults.query}" and found {searchResults.total_results} result(s).</Header>
              <GridGallery
                movies={searchResults.results}
                onPageChange={handlePaginationChange}
                onClickMovie={openMovieDetail}
              />
            </>
          ) : <></>}
        </Container>
      </Segment>
      <MovieDetails
        opened={openMovie !== null}
        movieDetails={movieDetail}
        onClickClose={closeMovieDetail}
      />
    </>
  )
}

export default App;
