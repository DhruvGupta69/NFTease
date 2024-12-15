import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import Item from "./Item";
import Minter from "./Minter";

function App() {
  // const nftID = "bkyz2-fmaaa-aaaaa-qaaaq-cai";
  // console.log(nftID);
  return (
    <div className="App">
      {/* <Item id={nftID} /> */}

      <Header />
      <Footer />
    </div>
  );
}

export default App;
