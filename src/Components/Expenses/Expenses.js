import React, { useEffect } from "react";
import styled from "styled-components";
import { useGlobalContext } from "../../context/globalContext";
import { InnerLayout } from "../../styles/Layouts";
import IncomeItem from "../IncomeItem/IncomeItem";
import ExpenseForm from "./ExpenseForm";
import Button from "../Button/Button";
const rgx = /^\d*$/;

const ExpEdit = styled.input`
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
`;
const ExpCon = styled.div`
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
`;

function getExpComp(
  setExpenseLimit,
  expenseLimit,
  setIsEditMode,
  isEditMode,
  editLimit,
  deleteLimit
) {
  if (isEditMode) {
    return (
      <div style={{ display: "flex", gap: "10px" }}>
        <ExpEdit
          type="text"
          name={"Limit"}
          placeholder="Expense Limit"
          value={expenseLimit}
          onChange={(e) =>
            rgx.test(e.target.value) && setExpenseLimit(e.target.value)
          }
        />
        <Button
          name={"Save"}
          onClick={() => {
            setIsEditMode((prev) => !prev);
            editLimit(expenseLimit);
          }}
          bg={"var(--color-accent"}
          color={"#fff"}
          bRad={"3px"}
          bPad={".5rem 1rem"}
        />
      </div>
    );
  } else {
    return (
      <div style={{ display: "flex", gap: "10px" }}>
        <ExpCon>
          <div>
            Expance Limit : {expenseLimit > 0 ? expenseLimit : "Not Set"}
          </div>
        </ExpCon>
        <Button
          name={"Edit"}
          onClick={() => {
            setExpenseLimit(expenseLimit);
            setIsEditMode((prev) => !prev);
          }}
          bg={"var(--color-accent"}
          color={"#fff"}
          bRad={"3px"}
          bPad={".5rem 1rem"}
        />
        {expenseLimit > 0 && (
          <Button
            name={"Delete"}
            onClick={() => {
              setExpenseLimit(0);
              deleteLimit();
            }}
            bg={"var(--color-accent"}
            color={"#fff"}
            bRad={"3px"}
            bPad={".5rem 1rem"}
          />
        )}
      </div>
    );
  }
}
const SltDiv = styled.select`
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
`

function Expenses() {
  const {
    expenses,
    getExpenses,
    deleteExpense,
    totalExpenses,
    limit,
    editLimit,
    deleteLimit,
  } = useGlobalContext();
  const [expenseLimit, setExpenseLimit] = React.useState(limit.maxExpance);
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [filter, setFilter] = React.useState("");
  console.log(filter,",@@@@@)")


  useEffect(() => {
    getExpenses();
    // eslint-disable-next-line
  }, []);
  return (
    <ExpenseStyled>
      <InnerLayout>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h1>Expenses</h1>{" "}
          <div className="input-control">
            {getExpComp(
              setExpenseLimit,
              expenseLimit,
              setIsEditMode,
              isEditMode,
              editLimit,
              deleteLimit
            )}
          </div>
        </div>
        <h2 className="total-income">
          Total Expense:{" "}
          <span>
            ₹{totalExpenses()}{" "}
            {totalExpenses() > expenseLimit ? "🚨 Over Spent 🚨" : ""}
          </span>
          <div className="selects input-control">
        <SltDiv onChange={(e)=>setFilter(e.target.value)}>
          <option value="">
            Select Option For Filter
          </option>
          <option value="education">Education</option>
          <option value="groceries">Groceries</option>
          <option value="health">Health</option>
          <option value="subscriptions">Subscriptions</option>
          <option value="takeaways">Takeaways</option>
          <option value="clothing">Clothing</option>
          <option value="travelling">Travelling</option>
          <option value="other">Other</option>
        </SltDiv>
      </div>
        </h2>
        <div className="income-content">
          <div className="form-container"
          style={{
            overflow: 'scroll',
            height: 'calc(-19rem + 100vh)',
          }}
          >
            <ExpenseForm setExpenseLimit />
          </div>
          <div
            className="incomes"
            style={{
              overflow: "scroll",
              height: "calc(100vh - 19rem)",
            }}
          >
            {expenses.map((income) => {
              const { _id, title, amount, date, category, description, type } =
                income;
              console.log(income);
              return (
                (filter ===category || !filter) && <IncomeItem
                  key={_id}
                  id={_id}
                  title={title}
                  description={description}
                  amount={amount}
                  date={date}
                  type={type}
                  category={category}
                  indicatorColor="var(--color-green)"
                  deleteItem={deleteExpense}
                />
              );
            })}
          </div>
        </div>
      </InnerLayout>
    </ExpenseStyled>
  );
}

const ExpenseStyled = styled.div`
  display: flex;
  overflow: auto;
  .total-income {
    display: flex;
    justify-content: center;
    align-items: center;
    background: #fcf6f9;
    border: 2px solid #ffffff;
    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
    border-radius: 20px;
    padding: 1rem;
    margin: 1rem 0;
    font-size: 2rem;
    gap: 0.5rem;
    span {
      font-size: 2.5rem;
      font-weight: 800;
      color: var(--color-green);
    }
  }
  .income-content {
    display: flex;
    gap: 2rem;
    .incomes {
      flex: 1;
    }
  }
`;

export default Expenses;
