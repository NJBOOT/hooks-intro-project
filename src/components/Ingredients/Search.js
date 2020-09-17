import React, { useEffect, useRef, useState } from "react";
import Card from "../UI/Card";
import "./Search.css";

const Search = React.memo(props => {
  const [searchTerm, setSearchTerm] = useState("");
  const { onLoadIngredients } = props;
  const inputTerm = useRef();

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
    const fetchData = async () => {
      const query =
        searchTerm.length === 0
          ? ""
          : `?orderBy="title"&equalTo="${searchTerm}"`;
      const res = await fetch(
        "https://react-hooks-update-c694b.firebaseio.com/ingredients.json/" +
          query
      );
      const data = await res.json();
      const fetchedIngredients = [];
      for (let key in data) {
        fetchedIngredients.push({
          id: key,
          title: data[key].title,
          amount: data[key].amount,
        });
      }
      onLoadIngredients(fetchedIngredients);
    };
    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm, onLoadIngredients, inputTerm]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
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
