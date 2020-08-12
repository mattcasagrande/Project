import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the issueTemplatePage state domain
 */

const selectIssueTemplatePageDomain = state =>
  state.issueTemplatePage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by IssueTemplatePage
 */

const makeSelectIssueTemplatePage = () =>
  createSelector(
    selectIssueTemplatePageDomain,
    substate => substate,
  );

export default makeSelectIssueTemplatePage;
export { selectIssueTemplatePageDomain };
