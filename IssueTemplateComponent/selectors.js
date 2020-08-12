import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the issueTemplateComponent state domain
 */

const selectIssueTemplateComponentDomain = state =>
  state.issueTemplateComponent || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by IssueTemplateComponent
 */

const makeSelectIssueTemplateComponent = () =>
  createSelector(
    selectIssueTemplateComponentDomain,
    substate => substate,
  );

export default makeSelectIssueTemplateComponent;
export { selectIssueTemplateComponentDomain };
