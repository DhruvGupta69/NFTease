import Text "mo:base/Text";
import Principal "mo:base/Principal";
import NFTActorClass "../NFT/nft";
import Cycles "mo:base/ExperimentalCycles";

actor NFTease{
  public shared(msg) func mint(imgData: [Nat8], name:Text) : async Principal{
    
    Cycles.add(100_500_000_000);
    let owner: Principal = msg.caller;
    let newNft = await NFTActorClass.NFT(name, owner, imgData);
    let newNftPrincipal = await newNft.getCanisterId();

    return newNftPrincipal;
  }
}