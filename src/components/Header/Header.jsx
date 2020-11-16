import * as React from  'react';
import { Segment } from 'semantic-ui-react';

const Header = ({ children }) => (
  <Segment
    inverted
    textAlign='center'
    style={{ minHeight: 700, padding: '1em 0em' }}
    vertical
  >
    {children}
  </Segment>
);

export default Header