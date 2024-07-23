const { State } = require('../../models/Admin/Location'); 
const { City } = require('../../models/Admin/Location');
const { generateResponse } = require('../../utils/responseUtils');

// Add a new state
const addState = async (req, res) => {
  const { StateName, StateCode, Capital } = req.body;
  
  try {
    const existingState = await State.findOne({ where: { StateCode } });
    if (existingState) {
      return generateResponse(res, 400, 'State with this code already exists');
    }
    
    const newState = await State.create({ StateName, StateCode, Capital });
    generateResponse(res, 201, 'State added successfully', { state: newState });
  } catch (error) {
    console.error('Error adding state:', error);
    generateResponse(res, 500, 'Server error', null, error.message);
  }
};

// Get all states
const getAllStates = async (req, res) => {
  try {
    const states = await State.findAll();
    generateResponse(res, 200, 'States retrieved successfully', { states });
  } catch (error) {
    console.error('Error getting states:', error);
    generateResponse(res, 500, 'Server error', null, error.message);
  }
};

// Update a state
const updateState = async (req, res) => {
  const { StateId } = req.params;
  const { StateName, StateCode, Capital } = req.body;

  try {
    const state = await State.findByPk(StateId);
    if (!state) {
      return generateResponse(res, 404, 'State not found');
    }

    await state.update({ StateName, StateCode, Capital });
    generateResponse(res, 200, 'State updated successfully', { state });
  } catch (error) {
    console.error('Error updating state:', error);
    generateResponse(res, 500, 'Server error', null, error.message);
  }
};

// Delete a state
const deleteState = async (req, res) => {
  const { StateId } = req.params;

  try {
    const state = await State.findByPk(StateId);
    if (!state) {
      return generateResponse(res, 404, 'State not found');
    }

    await state.destroy();
    generateResponse(res, 200, 'State deleted successfully');
  } catch (error) {
    console.error('Error deleting state:', error);
    generateResponse(res, 500, 'Server error', null, error.message);
  }
};

// Add a new city
const addCity = async (req, res) => {
  const { CityName, StateId } = req.body;
  
  try {
    // Check if the city already exists in the given state
    const existingCity = await City.findOne({
      where: {
        CityName: CityName,
        StateId: StateId
      }
    });

    if (existingCity) {
      return generateResponse(res, 400, 'City already exists in this state');
    }

    const newCity = await City.create({ CityName, StateId });
    generateResponse(res, 201, 'City added successfully', { city: newCity });
  } catch (error) {
    console.error('Error adding city:', error);
    generateResponse(res, 500, 'Server error', null, error.message);
  }
};

// Get all cities
const getAllCities = async (req, res) => {
  try {
    const cities = await City.findAll();
    generateResponse(res, 200, 'Cities retrieved successfully', { cities });
  } catch (error) {
    console.error('Error getting cities:', error);
    generateResponse(res, 500, 'Server error', null, error.message);
  }
};

// Update a city
const updateCity = async (req, res) => {
  const { CityId } = req.params;
  const { CityName, StateId } = req.body;

  try {
    const city = await City.findByPk(CityId);
    if (!city) {
      return generateResponse(res, 404, 'City not found');
    }

    await city.update({ CityName, StateId });
    generateResponse(res, 200, 'City updated successfully', { city });
  } catch (error) {
    console.error('Error updating city:', error);
    generateResponse(res, 500, 'Server error', null, error.message);
  }
};

// Delete a city
const deleteCity = async (req, res) => {
  const { CityId } = req.params;

  try {
    const city = await City.findByPk(CityId);
    if (!city) {
      return generateResponse(res, 404, 'City not found');
    }

    await city.destroy();
    generateResponse(res, 200, 'City deleted successfully');
  } catch (error) {
    console.error('Error deleting city:', error);
    generateResponse(res, 500, 'Server error', null, error.message);
  }
};

module.exports = {
  addState,
  getAllStates,
  updateState,
  deleteState,
  addCity,
  getAllCities,
  updateCity,
  deleteCity,
};