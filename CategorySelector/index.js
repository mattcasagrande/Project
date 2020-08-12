/**
 *
 * CategorySelector
 *
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AddIcon from '@material-ui/icons/AddCircle';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import DoneIcon from '@material-ui/icons/CheckCircle';
import MoveIcon from '@material-ui/icons/SwapHorizontalCircle';
import ClearIcon from '@material-ui/icons/Clear';
import { makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import colors from 'utils/colors';
import StyledIconButton from '../StyledIconButton';
import StyledTextField from '../StyledTextField';
import { loadIssueTemplates } from '../../containers/IssueTemplateProvider/actions';
import { compose } from 'redux';


const maxCategories = 15;
const maxCategoryNameCharacters = 25;

const useStyles = makeStyles(() => ({
  root: {
    marginBottom: 0,
  },
  categoryItem: {
    borderRadius: 2,
    justifyContent: 'space-between',
    textAlign: 'center',
    marginRight: 30,
    marginBottom: 30,
    padding: 4,
    border: 'solid',
    borderWidth: 0.5,
    height: 50,
    width: 140,
    fontFamily: 'Nunito',
    fontSize: 13,
    fontWeight: 'normal',
    fontStyle: 'normal',
    fontStretch: 'normal',
    lineHeight: 1.79,
    letterSpacing: 'normal',
    color: colors.grey1,
    display: 'flex',
  },
  catTitleContainer: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  catTitle: {
    marginTop: 3,
    display: 'inline',
    width: 'auto',
    marginRight: 10,
  },
  categoryText: {
    display: 'inline',
    margin: 'auto',
    justifyContent: 'center',
  },
  categoryItemSelected: {
    color: colors.white,
    backgroundColor: colors.blue,
    borderWidth: 0,
  },
  categoryContainer: {
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'start',
    flexWrap: 'wrap',
    flexWidth: 1,
    marginTop: 32.5,
    marginBottom: 25,
    '& p:nth-child(6n)': {
      marginRight: 0,
    },
  },
  iconSelected: {
    color: 'black',
  },
  editField: {
    '&&': {
      height: 45,
      width: 120,
      marginTop: 0,
      marginBottom: 0,
      marginLeft: 0,
      marginRight: 0,
    },
  },
  buttonContainer: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: 0,
  },
  buttonContainerOuter: {
    marginLeft: 0,
  },
}));

function CategorySelector({
  dispatch,
  loadIssueTemplate,
  categoryData,
  showActions,
  createCategory,
  updateCategory,
  moveCategory,
  deleteCategory,
  updateTemplateCategory,
  clearSelectedTemplate,
  selectedTemplate,
  subcategorySelected,
  categorySelected,
  showClear,
  canDeleteSubcategory,
  templateData,
  preLoadTemplates
}) {
  const classes = useStyles();

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryAddField, setCategoryAddField] = useState('');
  const [categoryAddFieldVisible, setCategoryAddFieldVisible] = useState(false); // box para poner nombre
  const [categoryMoveFieldVisible, setCategoryMoveFieldVisible] = useState(
    false,
  );
  const [addNewCat, setaddNewCat] = useState(false);

  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [editSelected, seteditSelected] = useState(false);
  const [subcategoryAddField, setSubcategoryAddField] = useState('');
  const [subcategoryAddFieldVisible, setSubcategoryAddFieldVisible] = useState(
    false,
  );
  const [
    subcategoryEditFieldVisible,
    setSubcategoryEditFieldVisible,
  ] = useState(false);
  const [addNewSubCat, setAddNewSubCat] = useState(false);
  const [
    subcategoryMoveFieldVisible,
    setSubcategoryMoveFieldVisible,
  ] = useState(false);
  


  const selectedCategoryData = () =>
    categoryData.find(x => x.id === selectedCategory);

  const selectedSubcategoryData = () =>
    categoryData.find(x => x.id === selectedSubcategory);

  const filteredCategoryData = () =>
    categoryData.filter(x => x.parent === null);

  const filteredSubcategoryData = () => {
    const result = categoryData.filter(
      x => x.parent === selectedCategory && x.parent !== null,
    );
    return result;
  };

  const editInProgressCat = () =>
    editSelected || categoryMoveFieldVisible || categoryAddFieldVisible;

  const editInProgressSub = () =>
    subcategoryMoveFieldVisible ||
    subcategoryAddFieldVisible ||
    subcategoryEditFieldVisible;

  const doSelectCategory = category => {
    setSelectedCategory(category);
    categorySelected(category);
  };

  const doSelectSubcategory = subcategory => {
    setSelectedSubcategory(subcategory);
    subcategorySelected(subcategory);
  };

  return (
    <div className={classes.root}>
      <div>
        <div className={classes.catTitleContainer}>
          <Typography variant="h3" className={classes.catTitle}>
            Category
          </Typography>
          <div>
            {(() => {
              if (categoryMoveFieldVisible) {
                return (
                  <span>
                    <StyledIconButton
                      onClick={() => {
                        if (selectedSubcategory) {
                          moveCategory(selectedSubcategory, selectedCategory);
                        }
                        setCategoryMoveFieldVisible(false);
                      }}
                      disabled={false}
                      tooltip="Save Category"
                      icon={DoneIcon}
                      color="green"
                    />
                  </span>
                );
              }
              if (showActions && !editInProgressCat()) {
                // contiene todos los iconos
                return (
                  <span>
                    <StyledIconButton
                      onClick={() => {
                        doSelectCategory(null);
                        doSelectSubcategory(null);
                        clearSelectedTemplate();
                        setCategoryAddField('');
                        setaddNewCat(true);
                      }}
                      disabled={filteredCategoryData().length >= 10}
                      tooltip="Create Category"
                      icon={AddIcon}
                    />
                    <StyledIconButton
                      onClick={() => {
                        deleteCategory(selectedCategory);
                        doSelectCategory(null);
                        doSelectSubcategory(null);
                        clearSelectedTemplate();
                      }}
                      disabled={
                        !selectedCategory ||
                        filteredSubcategoryData().length !== 0
                      }
                      tooltip="Delete Category"
                      icon={DeleteIcon}
                    />
                    <StyledIconButton
                      onClick={() => {
                        setCategoryAddFieldVisible(true);
                        setCategoryAddField(selectedCategoryData().name);
                      }}
                      disabled={!selectedCategory}
                      tooltip="Edit Category"
                      icon={EditIcon}
                    />
                    <StyledIconButton
                      onClick={() => {
                        setCategoryMoveFieldVisible(true);
                      }}
                      disabled={!selectedSubcategory}
                      tooltip="Move Selected Subcategory"
                      icon={MoveIcon}
                    />
                  </span>
                );
              }
              if (!showActions && showClear) {
                return (
                  <span>
                    <StyledIconButton
                      onClick={() => {
                        doSelectCategory(null);
                        doSelectSubcategory(null);
                        clearSelectedTemplate();
                      }}
                      disabled={selectedCategory === null}
                      tooltip="Clear Category"
                      icon={ClearIcon}
                    />
                  </span>
                );
              }
              return <span />;
            })()}
          </div>
        </div>
      </div>
      <span className={classes.categoryContainer}>
        {(() => {
          if (addNewCat) {
            return (
              <Typography className={classes.categoryItem}>
                <StyledTextField // campo para editar categoria
                  className={classes.editField}
                  margin="dense"
                  variant="outlined"
                  required
                  autoFocus
                  id="email"
                  value={categoryAddField}
                  onChange={value => setCategoryAddField(value)}
                  maxCharacters={maxCategoryNameCharacters}
                  onKeyDown={event => {
                    if (event.key === 'Enter') {
                      createCategory(categoryAddField, null);
                      setaddNewCat(false);
                      setSelectedCategory(null);
                    }
                  }}
                />
              </Typography>
            );
          }
          return null;
        })()}

        {filteredCategoryData()
          .slice(0, 10)
          .map(x => {
            if (
              editInProgressCat() &&
              x.id === selectedCategory &&
              !categoryMoveFieldVisible
            ) {
              if (x.id === selectedCategory) {
                return (
                  <Typography
                    className={
                      x.id === selectedCategory
                        ? `${classes.categoryItemSelected} 
                        ${classes.categoryItem}`
                        : classes.categoryItem
                    }
                  >
                    <StyledTextField // campo para editar categoria
                      className={classes.editField}
                      margin="dense"
                      variant="outlined"
                      required
                      autoFocus
                      id="email"
                      value={categoryAddField}
                      onChange={value => setCategoryAddField(value)}
                      maxCharacters={maxCategoryNameCharacters}
                      onKeyDown={event => {
                        if (event.key === 'Enter') {
                          updateCategory(
                            selectedCategory,
                            categoryAddField,
                            null,
                          );
                          setCategoryAddFieldVisible(false);
                          seteditSelected(false);
                          setSelectedCategory(null);
                        }
                      }}
                    />
                  </Typography>
                );
              }
            } else {
              return (
                <Typography
                  key={x.id}
                  className={
                    x.id === selectedCategory
                      ? `${classes.categoryItemSelected} 
                      ${classes.categoryItem}`
                      : classes.categoryItem
                  }
                  clickable={
                    !categoryAddFieldVisible &&
                    !subcategoryAddFieldVisible &&
                    !subcategoryMoveFieldVisible
                  }
                  onClick={() => {
                    doSelectCategory(x.id);
                    if (!categoryMoveFieldVisible) {
                      doSelectSubcategory(null);
                    }
                    if (!subcategoryMoveFieldVisible) {
                      clearSelectedTemplate();
                    }
                    setCategoryAddFieldVisible(false);
                  }}
                >
                  <span className={classes.categoryText}>
                    {x.name} ({x.count})
                  </span>
                </Typography>
              );
            }
            return null;
          })}
      </span>
      <div>
        <div className={classes.buttonContainerOuter}>
          <Typography variant="h3" className={classes.catTitle}>
            Subcategory
          </Typography>
          {(() => {
            if (subcategoryMoveFieldVisible) {
              return (
                <span>
                  <StyledIconButton
                    onClick={() => {
                      if (selectedSubcategory) {
                        updateTemplateCategory(
                          selectedTemplate,
                          selectedSubcategory,
                        );
                      }
                      setSubcategoryMoveFieldVisible(false);
                    }}
                    disabled={false}
                    tooltip="Save Subcategory"
                    icon={DoneIcon}
                    color="green"
                  />
                </span>
              );
            }
            if (showActions && !editInProgressSub()) {
              return (
                <span>
                  <StyledIconButton
                    onClick={() => {
                      doSelectSubcategory(null);
                      clearSelectedTemplate();
                      setAddNewSubCat(true);
                      setSubcategoryAddField('');
                    }}
                    disabled={
                      !selectedCategory ||
                      filteredSubcategoryData() >= maxCategories
                    }
                    tooltip="Create Subcategory"
                    icon={AddIcon}
                  />
                  <StyledIconButton
                    onClick={() => {
                      setSubcategoryEditFieldVisible(true);
                      setSubcategoryAddField(selectedSubcategoryData().name);
                    }}
                    disabled={!selectedSubcategory}
                    tooltip="Edit Subcategory"
                    icon={EditIcon}
                  />
                  <StyledIconButton
                    onClick={() => {
                      setSubcategoryMoveFieldVisible(true);
                    }}
                    disabled={!selectedTemplate}
                    tooltip="Move Selected Template"
                    icon={MoveIcon}
                  />
                  <StyledIconButton
                    onClick={() => {
                      deleteCategory(selectedSubcategory);
                      doSelectSubcategory(null);
                      clearSelectedTemplate();
                    }}
                    disabled={!selectedSubcategory && canDeleteSubcategory}
                    tooltip="Delete Subcategory"
                    icon={DeleteIcon}
                  />
                </span>
              );
            }
            if (!showActions && showClear) {
              return (
                <span>
                  <StyledIconButton
                    onClick={() => {
                      doSelectSubcategory(null);
                      clearSelectedTemplate();
                    }}
                    disabled={selectedSubcategory === null}
                    tooltip="Clear Subcategory"
                    icon={ClearIcon}
                  />
                </span>
              );
            }
            return <span />;
          })()}
        </div>
      </div>
      <span className={classes.categoryContainer}>
        {(() => {
          if (addNewSubCat) {
            return (
              <Typography className={classes.categoryItem}>
                <StyledTextField // cuadrito editar subcategorias
                  className={classes.editField}
                  margin="dense"
                  variant="outlined"
                  required
                  autoFocus
                  id="email"
                  value={subcategoryAddField}
                  onChange={value => setSubcategoryAddField(value)}
                  maxCharacters={maxCategoryNameCharacters}
                  onKeyDown={event => {
                    if (event.key === 'Enter') {
                      if (selectedSubcategory && selectedCategory) {
                        updateCategory(
                          selectedSubcategory,
                          subcategoryAddField,
                          selectedCategory,
                        );
                      } else if (selectedCategory) {
                        createCategory(subcategoryAddField, selectedCategory);
                      }
                      setAddNewSubCat(false);
                    }
                  }}
                />
              </Typography>
            );
          }
          return null;
        })()}
        {filteredSubcategoryData().map(x => {
          if (
            editInProgressSub() &&
            x.id === selectedSubcategory &&
            !subcategoryMoveFieldVisible
          ) {
            return (
              <Typography
                key={x.id}
                className={
                  x.id === selectedSubcategory
                    ? `${classes.categoryItemSelected} ${classes.categoryItem}`
                    : classes.categoryItem
                }
              >
                <StyledTextField // cuadrito editar subcategorias
                  className={classes.editField}
                  margin="dense"
                  variant="outlined"
                  required
                  autoFocus
                  id="email"
                  value={subcategoryAddField}
                  onChange={value => setSubcategoryAddField(value)}
                  maxCharacters={maxCategoryNameCharacters}
                  onKeyDown={event => {
                    if (event.key === 'Enter') {
                      if (selectedSubcategory && selectedCategory) {
                        updateCategory(
                          selectedSubcategory,
                          subcategoryAddField,
                          selectedCategory,
                        );
                      } else if (selectedCategory) {
                        createCategory(subcategoryAddField, selectedCategory);
                      }
                      setSubcategoryEditFieldVisible(false);
                    }
                  }}
                />
              </Typography>
            );
          }
          return (
            <Typography
              key={x.id}
              className={
                x.id === selectedSubcategory
                  ? `${classes.categoryItemSelected} ${classes.categoryItem}`
                  : classes.categoryItem
              }
              clickable
              onClick={() => {
                if (categoryMoveFieldVisible) {
                  return;
                }
                doSelectSubcategory(x.id);
                if (!subcategoryMoveFieldVisible) {
                  clearSelectedTemplate();
                }
                setSubcategoryAddFieldVisible(false);
              }}
            >
              <span className={classes.categoryText}>
                {x.name} ({x.count})
              </span>
            </Typography>
          );
        })}
      </span>
    </div>
  );
}
CategorySelector.defaultProps = {
  categorySelected: () => {},
  clearSelectedTemplate: () => {},
};
function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

CategorySelector.propTypes = {
  categoryData: PropTypes.array,
  showActions: PropTypes.bool,
  createCategory: PropTypes.func,
  updateCategory: PropTypes.func,
  moveCategory: PropTypes.func,
  deleteCategory: PropTypes.func,
  updateTemplateCategory: PropTypes.func,
  clearSelectedTemplate: PropTypes.func,
  selectedTemplate: PropTypes.string,
  subcategorySelected: PropTypes.func,
  categorySelected: PropTypes.func,
  showClear: PropTypes.bool,
  canDeleteSubcategory: PropTypes.bool,
};
const withConnect = connect(
  mapDispatchToProps,
);

export default compose(withConnect) (CategorySelector);
