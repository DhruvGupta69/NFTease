import React, { useEffect, useState } from "react";
import logo from "../../public/assets/logo.png";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../../../declarations/nft";
import { idlFactory as tokenIdlFactory } from "../../../declarations/token_backend";
import { Principal } from "@dfinity/principal";
import Button from "./Button";
import { NFTease_backend } from "../../../declarations/NFTease_backend";
import CURRENT_USER_ID from "..";
import PriceLabel from "./PriceLabel";

function Item(props) {
  const [name, setName] = useState();
  const [image, setImage] = useState();
  const [owner, setOwner] = useState();
  const [button, setButton] = useState();
  const [priceInput, setPriceInput] = useState();
  const [loaderHidden, setLoaderHidden] = useState(true);
  const [blur, setBlur] = useState();
  const [status, setStatus] = useState("");
  const [priceLabel, setPriceLabel] = useState();
  const [shouldDisplay, setDisplay] = useState(true);

  const id = props.id;
  const localhost = "http://127.0.0.1:3000/";
  const agent = new HttpAgent({ host: localhost });
  agent.fetchRootKey();

  let nftActor;
  async function loadNFT() {
    nftActor = await Actor.createActor(idlFactory, {
      agent,
      canisterId: id,
    });

    const name = await nftActor.getName();
    const owner = await nftActor.getOwner();
    const imageData = await nftActor.getAsset();
    const imageContent = new Uint8Array(imageData);
    const image = URL.createObjectURL(
      new Blob([imageContent.buffer], { type: "image/png" })
    );

    setName(name);
    setOwner(owner.toText());
    setImage(image);

    if (props.role == "collection") {
      const nftIsListed = await NFTease_backend.isListed(id);
      if (nftIsListed) {
        setOwner("NFTease");
        setBlur({ filter: "blur(4px)" });
        setStatus("Listed");
      } else {
        setButton(<Button handleClick={handleSell} text="Sell" />);
      }
    } else if (props.role == "discover") {
      const originalOwner = await NFTease_backend.getOriginalOwner(id);
      if (originalOwner.toText() != CURRENT_USER_ID) {
        setButton(<Button handleClick={handleBuy} text="Buy" />);
      }
      const listedPrice = await NFTease_backend.getListedNFTPrice(id);
      setPriceLabel(<PriceLabel sellPrice={listedPrice.toString()} />);
    }
  }

  useEffect(() => {
    loadNFT();
  }, []);

  let price;
  function handleSell() {
    setPriceInput(
      <input
        placeholder="Price in MUDRA"
        type="number"
        className="price-input"
        value={price}
        onChange={(e) => (price = e.target.value)}
      ></input>
    );
    setButton(<Button handleClick={sellItem} text="Confirm" />);
  }

  async function sellItem() {
    setBlur({ filter: "blur(4px)" });
    setLoaderHidden(false);
    try {
      const listingResult = await NFTease_backend.listItems(id, Number(price));
      console.log("Listing Result :" + listingResult);
      if (listingResult == "Success") {
        const NFTeaseID = await NFTease_backend.getNFTeaseCanisterId();
        const transferResult = await nftActor.transferOwnership(NFTeaseID);
        console.log("Transfer Result : " + transferResult);
        if (transferResult == "Success") {
          setLoaderHidden(true);
          setButton();
          setPriceInput();
          setOwner("NFTease");
          setStatus("Listed");
        }
      }
    } catch (error) {
      console.log("Error Listing NFT! Please try again");
    }
  }

  async function handleBuy() {
    console.log("Buy was triggered");
    setLoaderHidden(false);
    try {
      const tokenActor = await Actor.createActor(tokenIdlFactory, {
        agent,
        canisterId: Principal.fromText("dfdal-2uaaa-aaaaa-qaama-cai"),
      });

      const sellerId = await NFTease_backend.getOriginalOwner(id);
      const itemPrice = await NFTease_backend.getListedNFTPrice(id);

      const result = await tokenActor.transfer(sellerId, itemPrice);
      console.log("Transfer Result:", result);

      if (result === "Success") {
        await NFTease_backend.completePurchase(id, sellerId, CURRENT_USER_ID);
        console.log("Purchase Successful");
        console.log(id);
        setLoaderHidden(true);
        setDisplay(false);
      } else {
        console.log("Transfer Failed:", result);
      }
    } catch (error) {
      console.error("Error during purchase:", error);
    }
  }

  return (
    <div
      style={{ display: shouldDisplay ? "inline" : "none" }}
      className="disGrid-item"
    >
      <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
        <img
          className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
          src={image}
          style={blur}
        />
        <div className="lds-ellipsis" hidden={loaderHidden}>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className="disCardContent-root">
          {priceLabel}
          <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
            {name}
            <span className="purple-text"> {status} </span>
          </h2>
          <p className="disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
            Owner: {owner}
          </p>
          {priceInput}
          {button}
        </div>
      </div>
    </div>
  );
}

export default Item;
