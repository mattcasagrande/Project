/**
 *
 * TemplateSelectorDropdown
 *
 */

import React, { useState , useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import AddIcon from '@material-ui/icons/AddCircle';
import DeleteIcon from '@material-ui/icons/Delete';
import CopyIcon from '@material-ui/icons/FileCopy';
import ArchiveIcon from '@material-ui/icons/Archive';
import UnarchiveIcon from '@material-ui/icons/Unarchive';
import { createStructuredSelector } from 'reselect';
import { makeStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import colors from 'utils/colors';
import ActionsComponent from '../../containers/ActionsComponent';
import RulesComponent from '../../containers/RulesComponent';
import IssueTemplateComponent from '../../containers/IssueTemplateComponent';
import StyledIconButton from '../StyledIconButton';
import { getRules } from '../../containers/RulesProvider/selectors';
import { getTemplateActions, getTemplates } from '../../containers/ActionsProvider/selectors';

const useStyles = makeStyles(() => ({
  root: {
    alignItems: 'center',
    marginBottom: 25,
  },
  buttonWrapp: {
    marginRight: 10,
  },
  preview: {
    position: 'relative',
    paddingBottom: 10,
    width: 'auto',
    height: 'auto',
    minHeight: 445,
    padding: 10,
  },
  templatePreview: {
    height: '93%',
  },
  titleContainer: {
    display: 'inline-flex',
    width: 'auto',
    marginBottom: 25,
  },
  templateStats: {
    display: 'inline',
    fontFamily: 'Nunito',
    fontSize: 15,
    fontWeight: 'normal',
    fontStyle: 'normal',
    fontStretch: 'normal',
    lineHeight: 1.79,
    letterSpacing: 'normal',
    color: colors.grey1,
  },
  templateNames: {
    display: 'inline',
    fontFamily: 'Nunito',
    fontSize: 15,
    fontWeight: 'bold',
    fontStyle: 'normal',
    fontStretch: 'normal',
    lineHeight: 1.79,
    letterSpacing: 'normal',
    color: colors.dark,
  },
  categoryList: {
    padding: 5,
    width: 'auto',
    height: '100%',
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    overflowY: 'scroll',
  },
  templateName: {
    margin: 'auto',
    fontFamily: 'Nunito',
    fontSize: 15,
    fontWeight: 'normal',
    fontStyle: 'normal',
    fontStretch: 'normal',
    lineHeight: 1.79,
    letterSpacing: 'normal',
    color: colors.grey1,
  },
  templateNameSelected: {
    margin: 'auto',
    fontFamily: 'Nunito',
    fontSize: 15,
    fontWeight: 'bold',
    fontStyle: 'normal',
    fontStretch: 'normal',
    lineHeight: 1.79,
    letterSpacing: 'normal',
    color: '#4A90E2',
  },
  templateCount: {
    margin: 'auto',
    fontFamily: 'Nunito',
    fontSize: 12,
    fontWeight: 'black',
    fontStyle: 'normal',
    fontStretch: 'normal',
    lineHeight: 1.79,
    letterSpacing: 'normal',
    color: colors.grey1,
  },
  icon: {
    color: colors.grey1,
  },
  catTitle: {
    marginTop: 3,
    display: 'inline',
    width: 'auto',
    marginRight: 10,
  },
}));

function TemplateSelectorDropdown({
  onGreetings,
  setTemplate,
  selectedSubcategory,
  selectedTemplate,
  templateData,
  value,
  onChange,
  duplicateTemplate,
  deleteTemplate,
  archiveTemplate,
  rulesData,
  actionsData,
  templates,
  preLoadTemplates
}) {
  const getSelectedTemplate = () => templateData.find(x => x.id === value);
  const classes = useStyles();

  const rulesCount = () =>
    rulesData.filter(x => x.templateId === selectedTemplate).length;

  const actionsCount = () =>
    actionsData.filter(x => x.templateId === selectedTemplate).length;

  const [newTemplateActive, setNewTemplateActive] = useState(false);
  const [lastSelected, setLastSelected] = useState(null);
  const [selectedView, setSelectedView] = useState(0);
  useEffect(() => {
    
     preLoadTemplates()
    
  }, [selectedSubcategory]);
  return (
    <div className={classes.root}>
      {console.log("templates",templates)}
      {console.log("templateData",templateData)}
      <div className={classes.titleContainer}>
        <Typography variant="h3" className={classes.catTitle}>
          Templates
        </Typography>
        <div className={classes.buttonWrapp}>
          <span>
            {(() => {
              if (selectedTemplate || newTemplateActive) {
                return (
                  <span>
                    <StyledIconButton
                      onClick={() => {
                        setTemplate(null);
                        setNewTemplateActive(true);
                      }}
                      className={classes.icons}
                      disabled={templateData.length === 0}
                      tooltip="Create Template"
                      icon={AddIcon}
                    />
                    <StyledIconButton
                      onClick={() => {
                        deleteTemplate(value);
                        onChange(null);
                      }}
                      disabled={!getSelectedTemplate()}
                      tooltip="Delete Template"
                      icon={DeleteIcon}
                    />
                    <StyledIconButton
                      onClick={() => {
                        duplicateTemplate(value);
                        onChange(null);
                      }}
                      disabled={!getSelectedTemplate()}
                      tooltip="Duplicate Template"
                      icon={CopyIcon}
                    />
                    {(() => {
                      if (
                        !getSelectedTemplate() ||
                        !getSelectedTemplate().archived
                      ) {
                        return (
                          <StyledIconButton
                            onClick={() => {
                              archiveTemplate(value, true);
                              onChange(null);
                            }}
                            disabled={!getSelectedTemplate()}
                            tooltip="Archive Template"
                            icon={ArchiveIcon}
                          />
                        );
                      }
                      return (
                        <StyledIconButton
                          onClick={() => {
                            archiveTemplate(value, false);
                            onChange(null);
                          }}
                          disabled={!getSelectedTemplate()}
                          tooltip="Unarchive Template"
                          icon={UnarchiveIcon}
                        />
                      );
                    })()}
                  </span>
                );
              }
              return <span />;
            })()}
          </span>
        </div>
      </div>
      <Grid container spacing={4}>
        <Grid item xs={4} lg={3}>
          {(() => {
            if (onGreetings || selectedSubcategory) {
              return (
                <div className={classes.categoryList}>
                  <List component="nav">
                    {templateData.map(x => (
                      <ListItem
                        button
                        alignItems="flex-start"
                        key={x.id}
                        onClick={() => {
                          setTemplate(x.id);
                          setLastSelected(x.id);
                        }}
                        onMouseEnter={() => {
                          setTemplate(x.id);
                        }}
                        onMouseLeave={() => {
                          setTemplate(lastSelected);
                        }}
                      >
                        <ListItemText
                          primary={
                            <Typography
                              className={
                                x.id === selectedTemplate
                                  ? classes.templateNameSelected
                                  : classes.templateName
                              }
                            >
                              {x.name}
                            </Typography>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </div>
              );
            }
            return null;
          })()}
        </Grid>
        <Grid item xs={8} lg={9}>
          {(() => {
            if (!onGreetings && selectedSubcategory) {
              return (
                <div style={{ paddingBottom: 20 }}>
                  <Tabs
                    style={{
                      borderBottomColor: '#95A5A6',
                      borderBottomWidth: 5,
                    }}
                    value={selectedView}
                    onChange={(e, newValue) => setSelectedView(newValue)}
                    indicatorColor="primary"
                  >
                    <Tab label="Template" />
                    <Tab
                      label={rulesCount() ? `Rules (${rulesCount()})` : `Rules`}
                    />
                    <Tab
                      label={
                        actionsCount()
                          ? `Actions (${actionsCount()})`
                          : `Actions`
                      }
                    />
                  </Tabs>
                </div>
              );
            }
            return null;
          })()}

          <div className={classes.preview}>
            {(() => {
              if (selectedTemplate || newTemplateActive || selectedView) {
                if (selectedView === 0 || onGreetings) {
                  return (
                    <IssueTemplateComponent
                      onGreetings={onGreetings}
                      selectedTemplate={selectedTemplate}
                      selectedSubcategory={selectedSubcategory}
                      value={value}
                      setSelectedTemplate={x => setTemplate(x)}
                      actionsData={actionsData}
                    />
                  );
                }
                if (selectedView === 1 && selectedSubcategory) {
                  return (
                    <RulesComponent
                      selectedSubcategory={selectedSubcategory}
                      selectedTemplate={selectedTemplate}
                      setSelectedTemplate={x => {
                        setTemplate(x);
                      }}
                    />
                  );
                }
                if (selectedView === 2 && selectedSubcategory) {
                  return (
                    <ActionsComponent selectedTemplate={selectedTemplate} />
                  );
                }
              }
              return null;
            })()}
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

const mapStateToProps = createStructuredSelector({
  rulesData: getRules(),
  actionsData: getTemplateActions(),
  templates: getTemplates(),
});

TemplateSelectorDropdown.propTypes = {
  templateData: PropTypes.array,
  rulesData: PropTypes.array,
  actionsData: PropTypes.array,
  selectedSubcategory: PropTypes.object,
  selectedTemplate: PropTypes.object,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onGreetings: PropTypes.bool,
  duplicateTemplate: PropTypes.func,
  setTemplate: PropTypes.func,
  deleteTemplate: PropTypes.func,
  archiveTemplate: PropTypes.func,
};
const withConnect = connect(mapStateToProps);

export default compose(withConnect)(TemplateSelectorDropdown);
