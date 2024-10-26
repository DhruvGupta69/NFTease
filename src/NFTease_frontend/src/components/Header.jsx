import React, { useEffect, useState } from "react";
import logo from "../../public/assets/logo.png";
import homeImage from "../../public/assets/home-img.png";
import { BrowserRouter, Link, Routes, Route } from "react-router-dom";
import Minter from "./Minter";
import Gallery from "./Gallery";
import { NFTease_backend } from "../../../declarations/NFTease_backend";
import CURRENT_USER_ID from "..";

function Header() {
  const [userOwnedGallery, setUserOwnedGallery] = useState("");

  async function getNFTs() {
    const userNftIDs = await NFTease_backend.getOwnedNFTs(CURRENT_USER_ID);
    setUserOwnedGallery(<Gallery title="My NFTs" ids={userNftIDs} />);
  }

  useEffect(() => {
    getNFTs();
  }, []);

  return (
    <BrowserRouter forceRefresh={true}>
      <div className="app-root-1">
        <header className="Paper-root AppBar-root AppBar-positionStatic AppBar-colorPrimary Paper-elevation4">
          <div className="Toolbar-root Toolbar-regular header-appBar-13 Toolbar-gutters">
            <div className="header-left-4"></div>
            <img className="header-logo-11" src={logo} />
            <div className="header-vertical-9"></div>
            <Link to="/">
              <h5 className="Typography-root header-logo-text">NFTease</h5>
            </Link>
            <div className="header-empty-6"></div>
            <div className="header-space-8"></div>
            <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
              <Link to="/discover">Discover</Link>
            </button>
            <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
              <Link to="/minter">Minter</Link>
            </button>
            <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
              <Link to="collection">My NFTs</Link>
            </button>
          </div>
        </header>
      </div>
      <Routes>
        <Route
          path="/"
          element={<img className="bottom-space" src={homeImage} />}
        />
        <Route path="/discover" element={<h1>Discover</h1>} />
        <Route path="/minter" element={<Minter />} />
        <Route path="/collection" element={userOwnedGallery} />
      </Routes>
    </BrowserRouter>
  );
}

export default Header;
