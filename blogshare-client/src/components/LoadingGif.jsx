import React from "react";
import loadingGif from "../../public/Loading_Square.gif"; 

const GifComponent = () => {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh"
    }}>
      <img
        src={loadingGif}
        alt="Loading"
        style={{ width: "300px", height: "150px" }}
      />
      <h1 style={{color: "white"}}>Loading Data...</h1>
      <p style={{color: "white"}}>Please wait while the data is loading.</p>
    </div>
  );
};

export default GifComponent;