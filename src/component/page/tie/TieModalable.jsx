import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';

import TieListWithHeaderPagination from './TieListWithHeaderPagination';
import TieWithComment from './TieWithComment';
import TieModal from './TieModal';


const styles = theme => ({
});


@withStyles(styles)
class TieModalSwitch extends React.Component {

  previousLocation = this.props.location;

  componentWillUpdate(nextProps) {
    const { location } = this.props;
    if (
      nextProps.history.action !== "POP" &&
      (!location.state || !location.state.modal)
    ) {
      this.previousLocation = this.props.location;
    }
  }

  render() {
    const { location } = this.props;
    const is_modal = !!(
      location.state &&
      location.state.modal &&
      this.previousLocation !== location
    ); // not initial render
    // console.log('history', this.props.history);
    const back_path = is_modal? this.previousLocation.pathname: `/tie`;
    return (
      <React.Fragment>
        <Switch location={is_modal ? this.previousLocation : location}>
          <Route path="/tie" exact component={TieListWithHeaderPagination} />
          <Route path="/tie/page/:page" exact component={TieListWithHeaderPagination} />
          <Route path="/tie/:id" exact component={TieWithComment} />
        </Switch>
        {
          is_modal
            ? <Route
                path="/tie/:id"
                exact
                render={
                  ({match}) => {
                    return <TieModal
                      match={ match }
                      closeCallback={ () => { console.log(`back to ${back_path}`); this.props.history.push(back_path)} }
                    ></TieModal>
                  }
                }
              />
            : null
        }
      </React.Fragment>
    );
  }
}


export default TieModalSwitch;

// export default observer(App);
