import Text "mo:base/Text";
import Principal "mo:base/Principal";
import NFTActorClass "../NFT/nft";
import Cycles "mo:base/ExperimentalCycles";
import HashMap "mo:base/HashMap";
import List "mo:base/List";

actor NFTease{

  var mapNFTs = HashMap.HashMap<Principal, NFTActorClass.NFT>(1,Principal.equal,Principal.hash);
  var mapOwners = HashMap.HashMap<Principal, List.List<Principal>>(1,Principal.equal,Principal.hash);

  public shared(msg) func mint(imgData: [Nat8], name:Text) : async Principal{
    
    Cycles.add(100_500_000_000);

    let owner: Principal = msg.caller;
    let newNft = await NFTActorClass.NFT(name, owner, imgData);
    let newNftPrincipal = await newNft.getCanisterId();

    mapNFTs.put(newNftPrincipal,newNft);
    addToOwnerMap(owner,newNftPrincipal);

    return newNftPrincipal;
  };

  private func addToOwnerMap(owner:Principal, nftID:Principal){
    
    var ownedNFTs: List.List<Principal> = switch(mapOwners.get(owner)){
      case null List.nil<Principal>();
      case (?result) result;
    };

    ownedNFTs := List.push(nftID,ownedNFTs);
    mapOwners.put(owner,ownedNFTs);
  };

  public query func getOwnedNFTs(user: Principal): async [Principal] {
    
    var usersNFTs: List.List<Principal> = switch(mapOwners.get(user)){
      case null List.nil<Principal>();
      case (?result) result;
    };

    return List.toArray(usersNFTs);
  }

}