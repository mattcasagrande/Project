/**
 *
 * IssueTemplateComponent
 *
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import moment from 'moment';
import { useLocation } from 'react-router-dom';
import reducer from './reducer';
import saga from './saga';
import SaveableForm from '../../components/SaveableForm';
import {
  createTemplate,
  updateTemplate,
} from '../IssueTemplateProvider/actions';
import makeSelectGreetingTemplatePage from './selectors';
import {
  createTemplate as createTemplateGreetings,
  updateTemplate as updateTemplateGreetings,
} from '../GreetingTemplateProvider/actions';

import {
  getGreetingTemplates,
  getGreetingTemplatesLoading,
} from '../GreetingTemplateProvider/selectors';
import makeSelectIssueTemplatePage from '../IssueTemplatePage/selectors';
import {
  getIssueTemplates,
  getIssueTemplatesLoading,
} from '../IssueTemplateProvider/selectors';

const uuidv4 = require('uuid/v4');
const _ = require('lodash');

const defaultTemplate = 'To fix this issue, please restart your computer.';

export function IssueTemplateComponent({
  dispatch,
  defaultTemplateHeader,
  defaultTemplateFooter,
  issueTemplateData,
  issueTemplatesLoading,
  selectedSubcategory,
  selectedTemplate,
  setSelectedTemplate,
  onGreetings,
  greetingTemplateData,
  greetingTemplatesLoading,
}) {
  useInjectReducer({ key: 'issueTemplateComponent', reducer });
  useInjectSaga({ key: 'issueTemplateComponent', saga });

  const params = useLocation();

  const [draftTemplate, setDraftTemplate] = useState(null);

  // Worth it to memoize?
  const getSelectedTemplate = () => {
    if (params.pathname === '/greetings') {
      console.log("greetingTemplateData component",greetingTemplateData)
      return greetingTemplateData.find(x => x.id === selectedTemplate);
    } else{
    return issueTemplateData.find(x => x.id === selectedTemplate);
  }};
  const saveTemplate = (
    title,
    positiveCriteria,
    negativeCriteria,
    escalation,
    text,
  ) => {
    if (selectedTemplate == null) {
      const newId = uuidv4();
      dispatch(
        createTemplate(
          newId,
          title,
          positiveCriteria,
          negativeCriteria,
          escalation,
          text,
          selectedSubcategory,
        ),
      );
      setSelectedTemplate(newId);
    } else {
      dispatch(
        updateTemplate(
          selectedTemplate,
          title,
          positiveCriteria,
          negativeCriteria,
          escalation,
          text,
          selectedSubcategory,
        ),
      );
    }
  };
  const saveTemplateGreetings = (
    title,
    positiveCriteria,
    negativeCriteria,
    headerText,
    footerText,
  ) => {
    if (selectedTemplate == null) {
      const newId = uuidv4();
      dispatch(
        createTemplateGreetings(
          newId,
          title,
          positiveCriteria,
          negativeCriteria,
          headerText,
          footerText,
        ),
      );
      setSelectedTemplate(newId);
    } else {
      dispatch(
        updateTemplateGreetings(
          selectedTemplate,
          title,
          positiveCriteria,
          negativeCriteria,
          headerText,
          footerText,
        ),
      );
    }
  };
  const lastUpdatedValue = () => {
    if (getSelectedTemplate()) {
      return `Last updated ${moment(
        getSelectedTemplate().userLastUpdated,
      ).fromNow()}`;
    }
    return 'Last updated: N/A';
  };
  return (
    <div>
      {(() => {
        if (onGreetings) {
          return (
            <SaveableForm
              fields={[
                {
                  id: 'name',
                  name: 'Template Name',
                  placeholder: 'Enter Template Name',
                  type: 'text',
                  fullWidth: true,
                  maxCharacters: 60,
                },
                {
                  id: 'positiveCriteria',
                  name: 'Yes Criteria',
                  placeholder: `This greeting should be used when...`,
                  type: 'text',
                  fullWidth: true,
                  multiline: true,
                  maxCharacters: 150,
                },
                {
                  id: 'negativeCriteria',
                  name: 'No Criteria',
                  placeholder: `This greeting should not be used when...`,
                  type: 'text',
                  fullWidth: true,
                  multiline: true,
                  maxCharacters: 150,
                },
                {
                  id: 'lastUpdated',
                  type: 'staticText',
                },
                {
                  name: 'Greeting',
                  id: 'headerText',
                  type: 'richText',
                  fullWidth: true,
                },
                {
                  name: 'Sign Off',
                  id: 'footerText',
                  type: 'richText',
                  fullWidth: true,
                },
              ]}
              onSave={x => {
                saveTemplateGreetings(
                  x.name,
                  x.positiveCriteria,
                  x.negativeCriteria,
                  x.headerText,
                  x.footerText,
                );
              }}
              disabled={greetingTemplatesLoading}
              initialValues={{
                name: (getSelectedTemplate() || {}).name || '',
                positiveCriteria:
                  (getSelectedTemplate() || {}).positiveCriteria || '',
                negativeCriteria:
                  (getSelectedTemplate() || {}).negativeCriteria || '',
                lastUpdated: lastUpdatedValue(),
                headerText:
                  (getSelectedTemplate() || {}).headerText ||
                  defaultTemplateHeader,
                footerText:
                  (getSelectedTemplate() || {}).footerText ||
                  defaultTemplateFooter,
              }}
            />
          );
        }
        return (
          <div>
            <SaveableForm
              fields={[
                {
                  id: 'name',
                  name: 'Template Name',
                  placeholder: 'Enter Template Name',
                  type: 'text',
                  fullWidth: true,
                  maxCharacters: 60,
                },
                {
                  id: 'positiveCriteria',
                  name: 'Yes Criteria',
                  placeholder: `This template should be used when...`,
                  type: 'text',
                  fullWidth: true,
                  multiline: true,
                  maxCharacters: 150,
                },
                {
                  id: 'negativeCriteria',
                  name: 'No Criteria',
                  placeholder: `This template should not be used when...`,
                  type: 'text',
                  fullWidth: true,
                  multiline: true,
                  maxCharacters: 150,
                },
                {
                  id: 'escalation',
                  name: 'Escalation',
                  type: 'select',
                  options: [
                    { id: 'RESPOND', name: 'No Escalation' },
                    { id: 'RESPONDESCALATE', name: 'Respond and Escalate' },
                    { id: 'ESCALATE', name: 'Escalate Only' },
                    { id: 'RESPONDCLOSE', name: 'Respond and Close' },
                    { id: 'ACTIONONLY', name: 'Action Only' },
                    { id: 'CLOSEONLY', name: 'Close Only' },
                  ],
                },
                {
                  id: 'lastUpdated',
                  type: 'staticText',
                },
                ...(_.get(draftTemplate, 'escalation', null) === 'ESCALATE' ||
                _.get(draftTemplate, 'escalation', null) === 'ACTIONONLY' ||
                _.get(draftTemplate, 'escalation', null) === 'CLOSEONLY'
                  ? []
                  : [{ id: 'text', type: 'richText', fullWidth: true }]),
              ]}
              onChange={x => {
                setDraftTemplate(x);
              }}
              onSave={x => {
                saveTemplate(
                  x.name,
                  x.positiveCriteria,
                  x.negativeCriteria,
                  x.escalation,
                  x.text,
                );
              }}
              disabled={issueTemplatesLoading}
              initialValues={{
                name: (getSelectedTemplate() || {}).name || '',
                positiveCriteria:
                  (getSelectedTemplate() || {}).positiveCriteria || '',
                negativeCriteria:
                  (getSelectedTemplate() || {}).negativeCriteria || '',
                lastUpdated: lastUpdatedValue(),
                escalation:
                  (getSelectedTemplate() || {}).escalation || 'RESPOND',
                text: (getSelectedTemplate() || {}).text || defaultTemplate,
              }}
            />
          </div>
        );
      })()}
    </div>
  );
}

IssueTemplateComponent.propTypes = {
  dispatch: PropTypes.func.isRequired,
  issueTemplateData: PropTypes.array,
  issueTemplatesLoading: PropTypes.bool,
  onGreetings: PropTypes.bool,
  selectedSubcategory: PropTypes.string,
  selectedTemplate: PropTypes.string,
  defaultTemplateHeader: PropTypes.string,
  defaultTemplateFooter: PropTypes.string,
  setSelectedTemplate: PropTypes.func,
  greetingTemplateData: PropTypes.array,
  greetingTemplatesLoading: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  issueTemplatePage: makeSelectIssueTemplatePage(),
  issueTemplateData: getIssueTemplates(),
  issueTemplatesLoading: getIssueTemplatesLoading(),
  greetingTemplatePage: makeSelectGreetingTemplatePage(),
  greetingTemplateData: getGreetingTemplates(),
  greetingTemplatesLoading: getGreetingTemplatesLoading(),
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

export default compose(withConnect)(IssueTemplateComponent);
