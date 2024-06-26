"use client"
import axios from "axios";
import { useState,useEffect } from "react";
export default function Home() {

  const[data,setData]= useState([]);
  const[isLoading, setLoading]= useState(true);
  useEffect(() => {
    const getData = async () => {
      const fetchedData = await fetchData();
      setData(fetchedData);
      setLoading(false);
    };

    getData();
  }, []);
  const fetchData = async () =>
  {
    try{
      const response = await axios.get('http://localhost:3001/');
      return response.data;
    }
    catch(error){
      console.error("Error Occurred: "+ error);
      return [];
    }
  }

  if(isLoading) return <p>Loading...</p>
  return (
   <div>
    <table border="1" cellPadding="10">
      <thead>
        <tr>
          <th>TokenID</th>
          <th>Liquidity</th>
          <th>Token0Symbol</th>
          <th>Token0</th>
          <th>Token0Balance</th>
          <th>GrowthInside0</th>
          <th>Token1Symbol</th>
          <th>Token1</th>
          <th>Token1Balance</th>
          <th>GrowthInside1</th>
          <th>Reward</th>
          <th>SecondsInside</th>
        </tr>
      </thead>
      <tbody>
        {data.map(item => (
          <tr key={item.TokenID}>
            <td>{item.TokenID}</td>
            <td>{item.Liquidity}</td>
            <td>{item.Token0Symbol}</td>
            <td>{item.Token0}</td>
            <td>{item.Token0Balance}</td>
            <td>{item.GrowthInside0}</td>
            <td>{item.Token1Symbol}</td>
            <td>{item.Token1}</td>
            <td>{item.Token1Balance}</td>
            <td>{item.GrowthInside1}</td>
            <td>{item.Reward}</td>
            <td>{item.SecondsInside}</td>
          </tr>
        ))}
      </tbody>
    </table>
   </div>
  );
}
