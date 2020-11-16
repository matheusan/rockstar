import React from 'react';
import {
  Button,
  Container,
  Grid,
  Label,
  Header,
  Image,
  Icon,
  Divider,
  TransitionablePortal,
  Segment,
  Rating
} from 'semantic-ui-react';

export const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';

const MovieDetails = ({ opened, movieDetails, onClickClose }) => {
  if (Object.keys(movieDetails).length === 0) {
    return <>Nothing to show</>;
  }

  const {
    poster_path,
    original_title,
    overview,
    genres,
    release_date,
    popularity,
    vote_average,
  } = movieDetails;

  const style = {
    width: '100vw',
    height: '100vh',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 1000
  };

  const [year, month, day] = release_date.split('-');
  return (
    <TransitionablePortal
      open={opened}
      onClose={onClickClose}
    >
      <Segment style={style}>
        <Container text>
          <Grid>
            <Grid.Row>
              <Grid.Column width={14}>
                <Header as='h3'>{original_title}</Header>
              </Grid.Column>
              <Grid.Column width={2}>
                <Button icon={<Icon name='close' />} onClick={onClickClose} />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={6}>
                <Image src={`${imageBaseUrl}${poster_path}`} />
              </Grid.Column>
              <Grid.Column width={10}>
                <Grid columns={3}>
                  <Container>
                    <Header as='h4'>Release date {`${month}/${day}/${year}`}</Header>
                    <Header as='h4'>Popularity <Rating disabled icon='heart' defaultRating={popularity} maxRating={5} /></Header>
                    <Header as='h4'>Critics <Rating disabled icon='star' defaultRating={vote_average} maxRating={10} /></Header>
                    <Divider />

                    <Header as='h4'>Plot</Header>
                    {overview}
                    <Divider />

                    <Header as='h4'>Genres</Header>
                    <Label.Group tag>
                      {genres.map(genre => (
                        <Label key={genre.id} color='teal'>{genre.name}</Label>)
                      )}
                    </Label.Group>
                  </Container>
                </Grid>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </Segment>
    </TransitionablePortal>
  )
};

export default MovieDetails;
