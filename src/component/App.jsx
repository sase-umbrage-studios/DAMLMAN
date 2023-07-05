import React, {useEffect, useState} from "react";
import CategoryAndButtons from  "./CategoryAndButtons.jsx";
import ContractAndContractIds from "./ContractsAndContractIds.jsx";
const socket = io();

export default () => {
  const [DATA, setDATA] = useState({});
  useEffect(() => socket.on("DATA", newData => {setDATA(newData); console.log({newData})}), []);

  return (<div id="app">
      <CategoryAndButtons {...{DATA}}/>
      <div className="divider"></div>
      <ContractAndContractIds {...{DATA}}/>
    </div>)
};