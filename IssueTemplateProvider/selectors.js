import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the issueTemplateProvider state domain
 */

const selectIssueTemplateProviderDomain = state =>
  state.issueTemplateProvider || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by IssueTemplateProvider
 */

const makeSelectIssueTemplateProvider = () =>
  createSelector(
    selectIssueTemplateProviderDomain,
    substate => substate,
  );

const getIssueTemplates = () =>
  createSelector(
    selectIssueTemplateProviderDomain,
    substate =>
      Object.values(substate.items).sort((a, b) => {
        if (a.archived && !b.archived) {
          return 1;
        }
        if (!a.archived && b.archived) {
          return -1;
        }
        if (a.name.toLowerCase() > b.name.toLowerCase()) {
          return 1;
        }
        if (a.name.toLowerCase() < b.name.toLowerCase()) {
          return -1;
        }
        return 0;
      }),
  );

const getIssueTemplatesLoading = () =>
  createSelector(
    selectIssueTemplateProviderDomain,
    substate => substate.loading,
  );

export default makeSelectIssueTemplateProvider;
export {
  selectIssueTemplateProviderDomain,
  getIssueTemplates,
  getIssueTemplatesLoading,
};
