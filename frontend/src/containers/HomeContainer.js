import React, { Component } from "react";
import DataTableComponent from "../components/GeneralSetting/DataTableComponent";
import { connect } from "react-redux";
import { getSettingsList } from "../actions/getsetAction";

class HomeContainer extends Component {
  componentDidMount() {
    this.props.dispatch(getSettingsList(1,10,'','',''));
  }

  
  render() {
    return (
      <>
        <DataTableComponent />
      </>
    );
  }
}

export default connect()(HomeContainer);
