import React from "react";

const Loader = () => {
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img alt="LOADING..." src="/portalLoader.gif" style={{ width: "40%" }} />
    </div>
  );
};

export default Loader;
