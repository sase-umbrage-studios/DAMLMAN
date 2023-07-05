import React, { useState } from "react";

const ContractJSON = ({contract, filter}) => {
  const [toggled, setToggled] = useState(false);
  if (JSON.stringify(contract).indexOf(filter) === -1) return;

  return <div>
    <div className="contract-display-name" id="json" onClick={() => setToggled(!toggled)}>{contract.templateId.split(":").at(-1)}</div>
    {toggled? <pre id="json" className=".json">{JSON.stringify(contract.payload, undefined, 2)}</pre> : <div></div> }
  </div>
};

export default ({filter, DATA}) => {
  return <div className="contracts-with-json">
    {(DATA.activeContracts || []).map((contract, i) => <ContractJSON key={`contract-${i}`} {...{contract, filter}}/> )}
  </div>
};