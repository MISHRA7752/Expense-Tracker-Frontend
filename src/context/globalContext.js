import React, { useContext, useState } from "react"
import axios from 'axios'
import { BASE_URL } from "../RuntimeConfig"


const GlobalContext = React.createContext()

export const GlobalProvider = ({children}) => {

    const [incomes, setIncomes] = useState([])
    const [limit, setLimit] = useState(0)
    const [expenses, setExpenses] = useState([])
    const [error, setError] = useState(null)

    //calculate incomes
    const addIncome = async (income) => {
        await axios.post(`${BASE_URL}add-income`, income)
            .catch((err) =>{
                setError(err.response.data.message)
            })
        getIncomes()
    }
    const addBulkExpence = async (bulkIncome) => {
        await axios.post(`${BASE_URL}add-bulk`, bulkIncome)
            .catch((err) =>{
                setError(err.response.data.message)
            })
        getExpenses()
    }

    const getIncomes = async () => {
        const response = await axios.get(`${BASE_URL}get-incomes`)
        setIncomes(response.data)
        console.log(response.data)
    }

    const deleteIncome = async (id) => {
        axios.delete(`${BASE_URL}delete-income/${id}`)
        getIncomes()
    }

    const totalIncome = () => {
        let totalIncome = 0;
        incomes.forEach((income) =>{
            totalIncome = totalIncome + income.amount
        })

        return totalIncome;
    }


    //calculate incomes
    const addExpense = async (income) => {
        await axios.get(`${BASE_URL}add-expense`)
            .catch((err) =>{
                setError(err.response.data.message)
            })
        getExpenses()
    }

    const getLimit = async () => {
        const response = await axios.get(`${BASE_URL}get-limit`)
            .catch((err) =>{
                setError(err.response.data.message)
            })
            setLimit(response.data)
        getExpenses()
    }
    const editLimit = async (limit) => {
        const response = await axios.post(`${BASE_URL}edit-limit`,{maxExpance: limit})
            .catch((err) =>{
                setError(err.response.data.message)
            })
        getLimit(response.data)
    }
    const deleteLimit = async () => {
        const response = await axios.post(`${BASE_URL}delete-limit`)
            .catch((err) =>{
                setError(err.response.data.message)
            })
        getLimit(response.data)
    }

    const getExpenses = async () => {
        const response = await axios.get(`${BASE_URL}get-expenses`)
        setExpenses(response.data)
        console.log(response.data)
    }

    const deleteExpense = async (id) => {
        await axios.delete(`${BASE_URL}delete-expense/${id}`)
        getExpenses()
    }

    const totalExpenses = () => {
        let totalIncome = 0;
        expenses.forEach((income) =>{
            totalIncome = totalIncome + income.amount
        })

        return totalIncome;
    }


    const totalBalance = () => {
        return totalIncome() - totalExpenses()
    }

    const transactionHistory = () => {
        const history = [...incomes, ...expenses]
        history.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt)
        })

        return history.slice(0, 3)
    }


    return (
        <GlobalContext.Provider value={{
            addIncome,
            getIncomes,
            incomes,
            deleteIncome,
            expenses,
            totalIncome,
            addExpense,
            getExpenses,
            deleteExpense,
            totalExpenses,
            totalBalance,
            transactionHistory,
            error,
            setError,
            addBulkExpence,
            limit,
            getLimit,
            editLimit,
            deleteLimit
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

export const useGlobalContext = () =>{
    return useContext(GlobalContext)
}