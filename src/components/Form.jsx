/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */

import { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import styles from "./Form.module.css";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import { useURLPosition } from "../CustomHooks/useURLPosition";
import Message from "./Message";
import Spinner from "./Spinner";
import BackButton from "./BackButton";
import { useCities } from "../context/CitiesContext";

// not working  , will figure it out later
export function getFlagEmoji(countryCode) {
  // Convert the country code to uppercase and split it into individual characters
  const countryChars = countryCode.toUpperCase().split("");

  // Convert each character to its corresponding regional indicator symbol
  const flagEmoji = countryChars.map((char) =>
    String.fromCodePoint(127397 + char.charCodeAt(0))
  );

  // Join the regional indicator symbols to form the flag emoji
  return flagEmoji.join("");
}

function Form() {
  const navigate = useNavigate();
  // context api
  const { createCity, isLoading } = useCities();
  // name of city
  const [cityName, setCityName] = useState("");
  // name of country
  const [country, setCountry] = useState("");
  // date of note or when you been over there
  const [date, setDate] = useState(new Date());
  // notes
  const [notes, setNotes] = useState("");
  // query string
  const { Lat: lat, Lng: lng } = useURLPosition();
  //
  const [emoji, setEmoji] = useState("");
  // any error while retriving data from api
  const [geoCodingError, setGeoCodingError] = useState("");
  // loading state for spinner , while api is fecthing data
  const [isLoadingGeocoding, setIsLoadingGeocoding] = useState(null);

  useEffect(() => {
    if (!lat || !lng) return;

    const fetchData = async () => {
      try {
        setIsLoadingGeocoding(true);

        setGeoCodingError("");

        const res = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`
        );

        const data = await res.json();

        console.log(data);

        if (!data.countryCode)
          throw new Error(
            `That doesn't seem to be the city click somewhere else`
          );

        // You should use the 'data' variable here for further processing
        setCityName(data.city || data.locality || "");
        setCountry(data.countryName);

        setEmoji(getFlagEmoji(data.countryCode));
      } catch (error) {
        setGeoCodingError(error);
      } finally {
        setIsLoadingGeocoding(false);
      }
    };

    fetchData();
  }, [lat, lng]);

  // handler function can be an async function
  // it was made async because of await for createcity
  async function handleSubmit(e) {
    e.preventDefault();
    if (!cityName || !date) return;

    const newCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: { lat, lng },
      // id is automatically by fake server
    };
    // lets upload data to fake api
    // console.log(newCity);

    // since createCity is an async function
    // all async function return promise
    await createCity(newCity);

    // this is not gonna work as expected i.e. being moving to app/coites soon after click.
    navigate("/app/cities");
  }

  if (isLoadingGeocoding) return <Spinner />;

  if (!lat && !lng)
    return <Message message="start by clicking somewhere on the map" />;

  if (geoCodingError) return <Message message={`${geoCodingError}`} />;

  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ""}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <DatePicker
          id="date"
          onChange={(date) => setDate(date)}
          selected={date}
          dateFormat="dd/MM/yyyy"
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
