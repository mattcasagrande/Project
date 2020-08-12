/*
 *
 * IssueTemplateProvider actions
 *
 */

import {
  DELETE_ITEM,
  DUPLICATE_ITEM,
  LOAD_REQUEST,
  UPSERT_ITEM,
  LOAD_REQUEST_EVERY
} from './constants';

const uuidv4 = require('uuid/v4');

export function loadIssueTemplates() {
  return {
    type: LOAD_REQUEST,
  };
}
export function searchTemplates(value) {
  console.log("entro al action" , value)
  return {
    type: LOAD_REQUEST,
    payload: {
        value
    },
  };
}


export function loadIssueTemplate(id) {
  return {
    type: LOAD_REQUEST,
    payload: { id },
  };
}

export function loadIssueTemplateEvery(id) {
  return {
    type: LOAD_REQUEST_EVERY,
    payload: { id },
  }
}



export function createTemplate(
  id,
  name,
  positiveCriteria,
  negativeCriteria,
  escalation,
  text,
  category,
) {
  return {
    type: UPSERT_ITEM,
    payload: {
      id,
      name,
      positiveCriteria,
      negativeCriteria,
      escalation,
      text,
      userLastUpdated: new Date(),
      archived: false,
      category,
    },
  };
}

export function updateTemplate(
  id,
  name,
  positiveCriteria,
  negativeCriteria,
  escalation,
  text,
  category,
) {
  return {
    type: UPSERT_ITEM,
    payload: {
      id,
      name,
      positiveCriteria,
      negativeCriteria,
      escalation,
      text,
      userLastUpdated: new Date(),
      category,
    },
  };
}

export function deleteTemplate(id) {
  return {
    type: DELETE_ITEM,
    payload: { id },
  };
}

export function archiveTemplate(id, archived) {
  return {
    type: UPSERT_ITEM,
    payload: { id, archived },
  };
}

export function duplicateTemplate(templateId) {
  return {
    type: DUPLICATE_ITEM,
    payload: { id: uuidv4(), oldId: templateId },
  };
}

export function updateTemplateCategory(id, category) {
  return {
    type: UPSERT_ITEM,
    payload: { id, category },
  };
}
