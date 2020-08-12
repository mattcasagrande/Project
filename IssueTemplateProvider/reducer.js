/*
 *
 * IssueTemplateProvider reducer
 *
 */
import produce from 'immer';
import getGenericReducerHelper from 'utils/genericReducer';
import { DUPLICATE_ITEM } from './constants';

export const initialState = { loading: false, items: {} };

const genericReducerHelper = getGenericReducerHelper('IssueTemplateProvider');

/* eslint-disable default-case, no-param-reassign */
const issueTemplateProviderReducer = (state = initialState, action) =>
  produce(state, draft => {
    genericReducerHelper(action, state, draft);
    switch (action.type) {
      case DUPLICATE_ITEM: {
        draft.loading = true;
        const { id, oldId } = action.payload;
        const duplicatedItem = Object.assign({}, state.items[oldId]);
        duplicatedItem.id = id;
        duplicatedItem.name += ' (Duplicate)';
        draft.items[id] = duplicatedItem;
        break;
      }
      default:
        break;
    }
  });

export default issueTemplateProviderReducer;
