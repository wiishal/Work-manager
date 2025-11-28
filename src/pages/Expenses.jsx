import "../style/expenses.css";
import ExpensesCard from "../componant/ExpensesCard";
import axios from "axios";
import { useEffect, useState } from "react";
import AddSpendCard from "../componant/AddSpendCard";
function Expenses() {

  function fetchSpends(){
     axios.get("http://localhost:3000/api/expenses").then((res) => {
       console.log(res.data);
       
       setCards(res.data.expenses);
     });
  }   
    useEffect(() => {
   fetchSpends();
  }, []);
  const [cards, setCards] = useState([]);
  
  
  return (
    <div className="expenses-main">
      <h1 className="expenses-mainTitle">Expenses</h1>

      <AddSpendCard fetchSpends={fetchSpends}></AddSpendCard>
      <div className="expenses-cardDiv">
        {cards.map((item) => (
          <ExpensesCard item={item} id={item.id} />
        ))}
      </div>
    </div>
  );
}

export default Expenses;
  