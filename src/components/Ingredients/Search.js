import React, { useEffect, useRef, useState } from "react";
import useHttp from "../../hooks/http";
import Card from "../UI/Card";
import ErrorModal from "../UI/ErrorModal";
import "./Search.css";

const Search = React.memo(props => {
  const [searchTerm, setSearchTerm] = useState("");
  const { onLoadIngredients } = props;
  const inputTerm = useRef();

  const { isLoading, error, data, clear, sendRequest } = useHttp();

  const handleSearch = e => {
    const { value } = e.target;
    setSearchTerm(value);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm === inputTerm.current.value) {
        fetchData();
      }
    }, 500);
    const fetchData = () => {
      const query =
        searchTerm.length === 0
          ? ""
          : `?orderBy="title"&equalTo="${searchTerm}"`;
      sendRequest(
        "https://react-hooks-update-c694b.firebaseio.com/ingredients.json/" +
          query,
        "GET"
      );
    };
    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm, inputTerm, sendRequest]);

  useEffect(() => {
    if (!isLoading && !error && data) {
      const fetchedIngredients = [];
      for (let key in data) {
        fetchedIngredients.push({
          id: key,
          title: data[key].title,
          amount: data[key].amount,
        });
      }
      onLoadIngredients(fetchedIngredients);
    }
  }, [data, isLoading, error, onLoadIngredients]);
  return (
    <section className="search">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          {isLoading && <span>Loading...</span>}
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            ref={inputTerm}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
