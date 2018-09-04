import { withProps } from 'recompose';

export default withProps(props => console.log('props:', props) || {});
