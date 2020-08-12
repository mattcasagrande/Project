/**
 *
 * IssueTemplateProvider
 *
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectIssueTemplateProvider from './selectors';
import reducer from './reducer';
import saga from './saga';
import { loadIssueTemplates } from './actions';

export function IssueTemplateProvider({ dispatch }) {
  useInjectReducer({ key: 'issueTemplateProvider', reducer });
  useInjectSaga({ key: 'issueTemplateProvider', saga });

  useEffect(() => {
    dispatch(loadIssueTemplates());
  }, []);

  return <div />;
}

IssueTemplateProvider.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  issueTemplateProvider: makeSelectIssueTemplateProvider(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(IssueTemplateProvider);
