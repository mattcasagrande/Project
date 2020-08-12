import getGenericSaga from 'utils/genericSaga';
import { DUPLICATE_ITEM } from './constants';

import { getIssueTemplates } from './selectors';

const genericSaga = getGenericSaga(
  'IssueTemplateProvider',
  '/issueTemplates',
  getIssueTemplates,
  [DUPLICATE_ITEM],
);

// Individual exports for testing
export default function* issueTemplateProviderSaga() {
  yield genericSaga();
}
