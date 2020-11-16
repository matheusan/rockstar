import * as React from 'react';
import {
  Container,
  Grid,
  Header,
  Image,
  Pagination,
  Divider
} from 'semantic-ui-react';

export const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';
const COLUMNS = 5;

const FeaturedFirst = ({ movies, onClick }) => {
  const [featured, ...rest] = movies;
  return (
    <>
      <Grid>
        <Grid.Row>
          <Grid.Column width={6} as='a' onClick={() => onClick(featured.id)}>
            <Image src={`${imageBaseUrl}${featured.poster_path}`} />
          </Grid.Column>
          <Grid.Column width={10}>
            <Grid columns={3}>
              {rest.slice(0, 6).map((item, i) => (
                <Grid.Column key={item.id} as='a' onClick={() => onClick(item.id)}>
                  <Image src={`${imageBaseUrl}${item.poster_path}`} />
                </Grid.Column>
              ))}
            </Grid>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Grid columns={COLUMNS}>
        {rest.slice(6).map((item, i) => (
          <Grid.Column key={item.id} as='a' onClick={() => onClick(item.id)}>
            <Image src={`${imageBaseUrl}${item.poster_path}`} />
          </Grid.Column>
        ))}
      </Grid>
    </>
  );
}

const Gallery = ({ movies, onClick }) => (
  <Grid columns={COLUMNS}>
    {movies.map((item, i) => (
      <Grid.Column key={item.id} as='a' onClick={() => onClick(item.id)}>
        <Image src={`${imageBaseUrl}${item.poster_path}`} />
      </Grid.Column>
    ))}
  </Grid>
);

const GridGallery = ({ featuredFirst = false, movies, page, totalPages, onPageChange, onClickMovie }) => {
  if (movies.length === 0) {
    return <Header as='h3'>No movies to show</Header>
  }

  return (
    <>
      {!featuredFirst || page > 1 ? (
        <Gallery movies={movies} onClick={onClickMovie} />
       ) : (
        <FeaturedFirst movies={movies} onClick={onClickMovie} />
       )}
      <Divider />
      {page && (
        <Container textAlign='center'>
          <Pagination
            pointing
            secondary
            activePage={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </Container>
      )}
    </>
  )
};

export default GridGallery;
