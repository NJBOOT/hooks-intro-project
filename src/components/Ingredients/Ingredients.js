import React, { useReducer, useCallback, useMemo } from "react";
import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";
import ErrorModal from "../UI/ErrorModal";

const ingredientReducer = (state, action) => {
  switch (action.type) {
    case "SET":
      return action.ingredients;
    case "ADD":
      return [...state, action.ingredient];
    case "DELETE":
      return state.filter(ing => ing.id !== action.id);
    default:
      throw new Error("should not be here");
  }
};

const httpReducer = (httpState, action) => {
  switch (action.type) {
    case "SEND":
      return { loading: true, error: null };
    case "RESPONSE":
      return { ...httpState, loading: false };
    case "ERROR":
      return { loading: false, error: action.error };
    case "CLEAR":
      return { ...httpState, error: null };
    default:
      return httpState;
  }
};

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const [httpState, dispatchHttp] = useReducer(httpReducer, {
    loading: false,
    error: null,
  });

  const handleAddIngredient = useCallback(async ingredient => {
    try {
      dispatchHttp({ type: "SEND" });
      const res = await fetch(
        "https://react-hooks-update-c694b.firebaseio.com/ingredients.json",
        {
          method: "POST",
          body: JSON.stringify(ingredient),
          headers: { "Content-Type": "application/json" },
        }
      );
      const resData = await res.json();
      dispatchHttp({ type: "RESPONSE" });
      dispatch({
        type: "ADD",
        ingredient: { id: resData.name, ...ingredient },
      });
    } catch (err) {
      dispatchHttp({
        type: "ERROR",
        error: err.message,
      });
    }
  }, []);

  const handleRemoveIngredient = useCallback(async id => {
    try {
      dispatchHttp({ type: "SEND" });
      await fetch(
        `https://react-hooks-update-c694b.firebaseio.com/ingredients/${id}.json`,
        {
          method: "DELETE",
        }
      );
      dispatchHttp({ type: "RESPONSE" });
      dispatch({ type: "DELETE", id: id });
    } catch (err) {
      dispatchHttp({
        type: "ERROR",
        error: err.message,
      });
    }
  }, []);

  const handleFilterIngredients = useCallback(ings => {
    dispatch({
      type: "SET",
      ingredients: ings,
    });
  }, []);

  const clearError = useCallback(() => {
    dispatchHttp({ type: "CLEAR" });
  }, []);

  const ingredientList = useMemo(
    () => (
      <IngredientList
        ingredients={userIngredients}
        onRemoveItem={handleRemoveIngredient}
      />
    ),
    [userIngredients, handleRemoveIngredient]
  );

  return (
    <div className="App">
      {httpState.error && (
        <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>
      )}
      <IngredientForm
        handleAddIngredient={handleAddIngredient}
        loading={httpState.loading}
      />
      <section>
        <Search onLoadIngredients={handleFilterIngredients} />
        {ingredientList}
      </section>
    </div>
  );
};

export default Ingredients;
