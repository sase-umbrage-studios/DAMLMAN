import React from "react";

export default ({setFilter, DATA}) => {
  return <div className="main-party-and-contractids">
    <div className="party-display">
      <div className="party-display-name">Platform Admin</div>
      <div className="party-display-identifier">{DATA.platformAdmin || ""}</div>
    </div>

    <div className="party-display">
      <div className="party-display-name">Carrier</div>
      <div className="party-display-identifier">{DATA.carrier || ""}</div>
    </div>

    <div className="party-display">
      <div className="party-display-name">PolicyStateTracker ContractId</div>
      <div className="party-display-identifier">{DATA.policyStateTrackerId || ""}</div>
    </div>

    <input type="text" className="search" placeholder="Search Contracts" onChange={e => setFilter(e.target.value)}/>
  </div>
};