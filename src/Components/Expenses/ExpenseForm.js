import React, { useRef, useState } from "react";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useGlobalContext } from "../../context/globalContext";
import Button from "../Button/Button";
import { plus } from "../../utils/Icons";
const rgx = /^\d*$/;
const avilableTypes = [
  "education",
  "groceries",
  "health",
  "subscriptions",
  "takeaways",
  "clothing",
  "travelling",
];

function ExpenseForm() {
  const { addExpense, error, setError, addBulkExpence } = useGlobalContext();
  const ref = useRef(null);
  const fileRef = useRef(null);
  const [inputState, setInputState] = useState({
    title: "",
    amount: "",
    date: "",
    category: "",
    description: "",
  });

  const { title, amount, date, category, description } = inputState;

  const handleInput = (name) => (e) => {
    setInputState({ ...inputState, [name]: e.target.value });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addExpense(inputState);
    setInputState({
      title: "",
      amount: "",
      date: "",
      category: "",
      description: "",
    });
  };
  function onFileUpload(e) {
    setError("");
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = function (event) {
      const contents = event.target.result;
      const lines = contents.split("\n");
      const keys = lines[0].split(",");
      const data = lines.slice(1).map((line) => {
        const values = line.split(",");
        return keys.reduce((object, key, index) => {
          object[key] = values[index];
          if (key === "category" && !avilableTypes.includes(values[index])) {
            object[key] = "other";
          }
          if (key === "date") {
            object[key] = new Date(values[index]);
          }
          return object;
        }, {});
      });
      ref.current = data;
    };
    reader.onerror = function (event) {
      console.error("File could not be read! Code " + event.target.error.code);
    };
    reader.readAsText(file);
  }

  return (
    <ExpenseFormStyled onSubmit={handleSubmit}>
      {error && <p className="error">{error}</p>}
      <div style={{ gap: "10px", display: "flex", flexDirection: "column" }}>
        <input
          type="file"
          name="title"
          onChange={onFileUpload}
          accept=".csv"
          ref={fileRef}
        />
        <Button
          name={"Add Bulk Expense"}
          icon={plus}
          bPad={".8rem 1.6rem"}
          bRad={"30px"}
          bg={"var(--color-accent"}
          color={"#fff"}
          type="button"
          onClick={() => {
            if (!ref.current) {
              setError("Please select a file");
              return;
            }
            addBulkExpence({ bulkIncome: ref.current });
            fileRef.current.value = "";
          }}
        />
      </div>
      <div className="input-control">
        <input
          type="text"
          value={title}
          name={"title"}
          placeholder="Expense Title"
          onChange={handleInput("title")}
        />
      </div>
      <div className="input-control">
        <input
          value={amount}
          type="text"
          name={"amount"}
          placeholder={"Expense Amount"}
          onChange={(e) => rgx.test(e.target.value) && handleInput("amount")(e)}
        />
      </div>
      <div className="input-control">
        <DatePicker
          id="date"
          placeholderText="Enter A Date"
          selected={date}
          dateFormat="dd/MM/yyyy"
          value={inputState.date}
          onChange={(date) => {
            setInputState({ ...inputState, date: date });
          }}
        />
      </div>
      <div className="selects input-control">
        <select
          required
          value={category}
          name="category"
          id="category"
          onChange={handleInput("category")}
        >
          <option value="" disabled>
            Select Option
          </option>
          <option value="education">Education</option>
          <option value="groceries">Groceries</option>
          <option value="health">Health</option>
          <option value="subscriptions">Subscriptions</option>
          <option value="takeaways">Takeaways</option>
          <option value="clothing">Clothing</option>
          <option value="travelling">Travelling</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div className="input-control">
        <textarea
          style={{width: "100%"}}
          name="description"
          value={description}
          placeholder="Add A Reference"
          id="description"
          cols="30"
          rows="4"
          onChange={handleInput("description")}
        ></textarea>
      </div>
      <div className="submit-btn">
        <Button
          name={"Add Expense"}
          icon={plus}
          bPad={".8rem 1.6rem"}
          bRad={"30px"}
          bg={"var(--color-accent"}
          color={"#fff"}
        />
      </div>
    </ExpenseFormStyled>
  );
}

const ExpenseFormStyled = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  input,
  textarea,
  select {
    font-family: inherit;
    font-size: inherit;
    outline: none;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    border: 2px solid #fff;
    background: transparent;
    resize: none;
    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
    color: rgba(34, 34, 96, 0.9);
    &::placeholder {
      color: rgba(34, 34, 96, 0.4);
    }
  }
  .input-control {
    input {
      width: 100%;
    }
  }

  .selects {
    display: flex;
    justify-content: flex-end;
    select {
      color: rgba(34, 34, 96, 0.4);
      &:focus,
      &:active {
        color: rgba(34, 34, 96, 1);
      }
    }
  }

  .submit-btn {
    button {
      box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
      &:hover {
        background: var(--color-green) !important;
      }
    }
  }
`;
export default ExpenseForm;
