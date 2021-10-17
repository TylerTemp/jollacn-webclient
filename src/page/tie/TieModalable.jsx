import React from 'react';
import {
  BrowserRouter as Router, Switch, Route, Link,
} from 'react-router-dom';

// import { withStyles } from '@mui/material/styles';

import TieListWithHeaderPagination from './TieListWithHeaderPagination';
import TiePage from './TiePage';
import TieModal from './TieModal';
import tieListPaginationStore from '~/component/storage/TieListPaginationStore';


// const styles = theme => ({
// });
//
//
// @withStyles(styles)
class TieModalSwitch extends React.Component {
  previousLocation = this.props.location;

  componentWillUpdate(nextProps) {
    const { location } = this.props;
    if (
      nextProps.history.action !== 'POP'
      && (!location.state || !location.state.modal)
    ) {
      this.previousLocation = this.props.location;
    }
  }

  render() {
    const { location } = this.props;

    console.log('location = ', location);

    const is_modal = !!(
      location.state
      && location.state.modal
      && this.previousLocation !== location
    ); // not initial render
    // console.log('history', this.props.history);
    const back_path = is_modal ? this.previousLocation.pathname : '/tie';
    return (
      <React.Fragment>
        <Switch location={is_modal ? this.previousLocation : location}>
          {/* TODO: fix: click to go to page 1 */}
          <Route path="/tie" exact component={TieListWithHeaderPagination} />
          {/* <Route path="/tie" exact render={
              ({match, location}) => {
                match.params['page'] = '1';
                tieListPaginationStore.fetchTiesPage(1);
                return <TieListWithHeaderPagination
                  match={ match }
                  location={ location }
                ></TieListWithHeaderPagination>
              }
            } /> */}
          <Route path="/tie/page/:page" exact component={TieListWithHeaderPagination} />
          <Route path="/tie/:id" exact component={TiePage} />
        </Switch>
        {
          is_modal
            ? (
              <Route
                path="/tie/:id"
                exact
                render={
                  ({ match, location, history }) => (
                    <TieModal
                      match={match}
                      location={location}
                      history={history}
                    />
                  )
                }
              />
            )
            : null
        }
      </React.Fragment>
    );
  }
}


export default TieModalSwitch;

// export default observer(App);
