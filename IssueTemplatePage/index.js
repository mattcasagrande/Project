/**
 *
 * IssueTemplatePage
 *
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import CategorySelector from 'components/CategorySelector';
import TemplateSelectorDropdown from '../../components/TemplateSelectorDropdown';
import PageHeader from '../../components/PageHeader';
import {
  archiveTemplate,
  deleteTemplate,
  duplicateTemplate,
  loadIssueTemplate,
  loadIssueTemplateEvery,
  updateTemplateCategory,
} from '../IssueTemplateProvider/actions';
import { getIssueTemplates } from '../IssueTemplateProvider/selectors';
import makeSelectIssueTemplatePage from './selectors';
import reducer from './reducer';
import saga from './saga';
import { getCategories } from '../CategoryProvider/selectors';
import {
  createCategory,
  deleteCategory,
  updateCategory,
  moveCategory,
} from '../CategoryProvider/actions';
import StyledPaper from '../../components/StyledPaper';
import { loadRules } from '../RulesProvider/actions';
import { loadActions } from '../ActionsProvider/actions';
import { getRules } from '../RulesProvider/selectors';
import { getTemplateActions } from '../ActionsProvider/selectors';
import SearchBar from '../../components/SearchBar/SearchBar'

export function IssueTemplatePage({
  dispatch,
  issueTemplateData,
  categoryData,
  rulesData,
  actionsData,
}) {
  useInjectReducer({ key: 'issueTemplatePage', reducer });
  useInjectSaga({ key: 'issueTemplatePage', saga });

  

  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showSearchResults , setShowSearchResults] = useState(false)

  console.log('props', arguments[0]);
  console.log('selected template', selectedTemplate)

  const setTemplate = templateId => {
    setSelectedTemplate(templateId);
  };
  const preLoadTemplates = () => {
    if(!showSearchResults){
    issueTemplateData.filter(
      x =>
        x.category === selectedSubcategory || x.id === selectedTemplate,
    ).forEach(element => {
      dispatch(loadIssueTemplateEvery(element.id))
    });
}
  }

  useEffect(() => {
    if (selectedTemplate != null) {
      // dispatch(loadIssueTemplate(selectedTemplate));
      dispatch(loadRules(selectedTemplate));
      dispatch(loadActions(selectedTemplate));
    }
  }, [selectedTemplate]);

  return (
    console.log("showSearchResults",showSearchResults),
    <div>
      <PageHeader
        title="Issue Templates"
        description="Create responses, filter them, and perform tasks automatically."
      />
      <StyledPaper>
        <SearchBar
        showSearchResults={x => setShowSearchResults(x)}
        displayResults={showSearchResults}
        />
        {(()=>{
          if(!showSearchResults){
            return(
            <CategorySelector
          preLoadTemplates={preLoadTemplates}
          // loadIssueTemplate = {loadIssueTemplate}
          categoryData={categoryData}
          showActions
          createCategory={(name, parent) =>
            dispatch(createCategory(name, parent))
          }
          updateCategory={(id, name, parent) =>
            dispatch(updateCategory(id, name, parent))
          }
          moveCategory={(id, parent) => dispatch(moveCategory(id, parent))}
          deleteCategory={id => dispatch(deleteCategory(id))}
          updateTemplateCategory={(id, category) =>
            dispatch(updateTemplateCategory(id, category))
          }
          clearSelectedTemplate={() => setSelectedTemplate(null)}
          selectedTemplate={selectedTemplate}
          subcategorySelected={subcategory =>
            setSelectedSubcategory(subcategory)
          }
        />)
          }
        })()}
        <TemplateSelectorDropdown
          preLoadTemplates={preLoadTemplates}
          templateData={issueTemplateData.filter(
            
            x =>
              x.category === selectedSubcategory || x.id === selectedTemplate,
          )}
          rulesData={rulesData}
          actionsData={actionsData}
          onGreetings={false}
          value={selectedTemplate}
          selectedTemplate={selectedTemplate}
          selectedSubcategory={selectedSubcategory}
          setTemplate={setTemplate}
          showActions
          duplicateTemplate={x => dispatch(duplicateTemplate(x))}
          deleteTemplate={x => dispatch(deleteTemplate(x))}
          archiveTemplate={(x, archived) =>
            dispatch(archiveTemplate(x, archived))
          }
        />
      </StyledPaper>
    </div>
  );
}

IssueTemplatePage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  issueTemplateData: PropTypes.array,
  rulesData: PropTypes.array,
  actionsData: PropTypes.array,
  categoryData: PropTypes.array,
};

const mapStateToProps = createStructuredSelector({
  issueTemplatePage: makeSelectIssueTemplatePage(),
  issueTemplateData: getIssueTemplates(),
  rulesData: getRules(),
  actionsData: getTemplateActions(),
  categoryData: getCategories(),
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

export default compose(withConnect)(IssueTemplatePage);
