/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useReducer,
} from "react";

const CitiesContext = createContext();

const BASE_URL = `http://localhost:9000`;

const intialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "cities/loaded":
      return { ...state, isLoading: false, cities: action.payload };
    case "city/loaded":
      return { ...state, isLoading: false, currentCity: action.payload };
    case "city/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };
    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      };
    case "rejected":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    default:
      throw new Error("Unknown action type");
  }
}

function CitiesProvider({ children }) {
  // const [cities, SetCities] = useState([]);
  // const [isLoading, SetIsLoading] = useState(false);
  // // used for opening city component , marked city row where we visited , so it is not a local one byt a global one infact
  // const [currentCity, setCurrentCity] = useState([]);

  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    intialState
  );

  // fetch city data from json file
  useEffect(function () {
    async function fetchCityData() {
      // SetIsLoading(true)
      dispatch({ type: "loading" });
      try {
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        // SetCities(data);
        dispatch({ type: "cities/loaded", payload: data });
      } catch (err) {
        // alert(err);
        dispatch({
          type: "rejected",
          payload: "There was an error loading data...",
        });
      } finally {
        // SetIsLoading(false)
      }
    }
    fetchCityData();
  }, []);

  // to be used by city component to fetch city data based on id
  // json provides id on its own
  async function getCity(id) {
    if (Number(id) === currentCity.id) return;

    dispatch({ type: "loading" });
    try {
      // SetIsLoading(true);
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();
      // setCurrentCity(data);
      dispatch({ type: "city/loaded", payload: data });
    } catch (err) {
      // alert(err);
      dispatch({
        type: "rejected",
        payload: "There was an error loading data...",
      });
    }
  }

  async function createCity(newCity) {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      // console.log(data);
      // keep ui in sync with ui
      // updating state without need to fetch data again
      // SetCities((cities) => [...cities, data]);
      dispatch({ type: "city/created", payload: data });
    } catch (err) {
      // alert(err);
      dispatch({
        type: "rejected",
        payload: "There was an error creating data...",
      });
    }
  }

  async function deleteCity(id) {
    dispatch({ type: "loading" });
    try {
      // SetIsLoading(true);

      const res = await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      // SetCities((cities) => cities.filter((city) => city.id !== id));
      dispatch({ type: "city/deleted", payload: id });
    } catch (err) {
      // alert("there was an error while deleting city");
      dispatch({
        type: "rejected",
        payload: "There was an error deleting the city...",
      });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);

  if (context === undefined) {
    throw new Error("Context used before use of CitiesContext.Provider");
  }

  return context;
}
export { CitiesProvider, useCities };
