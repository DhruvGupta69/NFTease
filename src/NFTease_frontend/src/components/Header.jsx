import React, { useEffect, useState } from "react";
import logo from "../../public/assets/logo.png";
import homeImage from "../../public/assets/home-img.png";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Minter from "./Minter";
import Gallery from "./Gallery";
import { NFTease_backend } from "../../../declarations/NFTease_backend";
import CURRENT_USER_ID from "..";

function Header() {
  const [userOwnedGallery, setUserOwnedGallery] = useState();
  const [listingGallery, setListingGallery] = useState();

  async function getNFTs() {
    const userNftIDs = await NFTease_backend.getOwnedNFTs(CURRENT_USER_ID);
    setUserOwnedGallery(
      <Gallery title="My NFTs" ids={userNftIDs} role="collection" />
    );

    const listedNFTIds = await NFTease_backend.getListedNFTs();
    setListingGallery(
      <Gallery title="Discover" ids={listedNFTIds} role="discover" />
    );
  }

  useEffect(() => {
    getNFTs();
  }, []);

  const handleNavigate = (path) => {
    window.location.href = path; // Reload the window and navigate
  };

  return (
    <BrowserRouter>
      <div className="app-root-1">
        <header className="Paper-root AppBar-root AppBar-positionStatic AppBar-colorPrimary Paper-elevation4">
          <div className="Toolbar-root Toolbar-regular header-appBar-13 Toolbar-gutters">
            <div className="header-left-4"></div>
            <img className="header-logo-11" src={logo} alt="Logo" />
            <div className="header-vertical-9"></div>
            <h5
              className="Typography-root header-logo-text"
              onClick={() => handleNavigate("/")}
              style={{ cursor: "pointer" }}
            >
              NFTease
            </h5>
            <div className="header-empty-6"></div>
            <div className="header-space-8"></div>
            <button
              className="ButtonBase-root Button-root Button-text header-navButtons-3"
              onClick={() => handleNavigate("/discover")}
            >
              Discover
            </button>
            <button
              className="ButtonBase-root Button-root Button-text header-navButtons-3"
              onClick={() => handleNavigate("/minter")}
            >
              Minter
            </button>
            <button
              className="ButtonBase-root Button-root Button-text header-navButtons-3"
              onClick={() => handleNavigate("/collection")}
            >
              My NFTs
            </button>
          </div>
        </header>
      </div>
      <Routes>
        <Route
          path="/"
          element={<img className="bottom-space" src={homeImage} alt="Home" />}
        />
        <Route path="/discover" element={listingGallery} />
        <Route path="/minter" element={<Minter />} />
        <Route path="/collection" element={userOwnedGallery} />
      </Routes>
    </BrowserRouter>
  );
}

export default Header;
