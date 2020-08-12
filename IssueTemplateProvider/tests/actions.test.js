import { loadIssueTemplates } from '../actions';
import { LOAD_REQUEST } from '../constants';

describe('IssueTemplateProvider actions', () => {
  describe('Default Action', () => {
    it('has a type of DEFAULT_ACTION', () => {
      const expected = {
        type: LOAD_REQUEST,
      };
      expect(loadIssueTemplates()).toEqual(expected);
    });
  });
});
