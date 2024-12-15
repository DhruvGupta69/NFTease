import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import { Principal } from "@dfinity/principal";
// import { AuthClient } from "@dfinity/auth-client";

const CURRENT_USER_ID = Principal.fromText("2vxsx-fae");
export default CURRENT_USER_ID;

const init = async () => {
  // const authClient = await AuthClient.create();
  // await authClient.login({
  //   identityProvider:"https://identity.ic0.app/#authorize",
  //   onSuccess:() =>{
  //     ReactDOM.createRoot(document.getElementById("root")).render(
  //       <React.StrictMode>
  //         <App />
  //       </React.StrictMode>
  //     )
  //   })

  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

init();
