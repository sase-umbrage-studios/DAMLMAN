import React, { useState } from "react";
import MainPartyAndContractIds from "./MainPartyAndContractIds";
import ContractsWithJSON from "./ContractsWithJSON";

export default ({DATA}) => {
  const [filter, setFilter] = useState("");

  return <div className="contracts-and-contract-ids">
    <MainPartyAndContractIds {...{setFilter, DATA}}/>
    <ContractsWithJSON {...{filter, DATA}}/>
  </div>
};