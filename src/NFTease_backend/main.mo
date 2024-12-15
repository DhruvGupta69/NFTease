import Text "mo:base/Text";
import Principal "mo:base/Principal";
import NFTActorClass "../NFT/nft";
import Cycles "mo:base/ExperimentalCycles";
import HashMap "mo:base/HashMap";
import List "mo:base/List";
import Iter "mo:base/Iter";

actor NFTease{

  private type Listing ={
    itemOwner: Principal;
    itemPrice: Nat;
  };

  var mapNFTs = HashMap.HashMap<Principal, NFTActorClass.NFT>(1,Principal.equal,Principal.hash);
  var mapOwners = HashMap.HashMap<Principal, List.List<Principal>>(1,Principal.equal,Principal.hash);
  var mapOfListed = HashMap.HashMap<Principal,Listing>(1,Principal.equal,Principal.hash);

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
  };

  public query func getListedNFTs() : async [Principal]{
    let ids = Iter.toArray(mapOfListed.keys());
    return ids;
  };

  public shared(msg) func listItems(id:Principal, price:Nat):async Text{
    var item: NFTActorClass.NFT = switch(mapNFTs.get(id)){
      case null return "NFT does not exists.";
      case (?result) result;
    };

    let owner = await item.getOwner();
    if(Principal.equal(owner,msg.caller)){
      let newListing : Listing = {
        itemOwner = owner;
        itemPrice = price;
      };
      mapOfListed.put(id,newListing);
      return "Success";
    }else{
      return "You don't own the NFT";
    }
  };

  public query func getNFTeaseCanisterId():async Principal{
    return Principal.fromActor(NFTease);
  };

  public query func isListed(id:Principal):async Bool{
    if(mapOfListed.get(id) == null){
      return false;
    }else{
      return true;
    }
  };

  public query func getOriginalOwner(id:Principal) : async Principal{
    var listing : Listing = switch(mapOfListed.get(id)){
      case null return Principal.fromText("");
      case (?result) result;
    };

    return listing.itemOwner;
  };

  public query func getListedNFTPrice(id:Principal) : async Nat{
    var listing : Listing = switch(mapOfListed.get(id)){
      case null return 0;
      case(?result) result;
    };

    return listing.itemPrice;
  };

  public shared(msg) func completePurchase(id:Principal,ownerId:Principal,newOwnerId:Principal) : async Text{
    var purchasedNFT : NFTActorClass.NFT = switch(mapNFTs.get(id)){
      case null return "NFT does not exist";
      case (?result) result;
    };

    let transferResult = await purchasedNFT.transferOwnership(newOwnerId);
    if(transferResult == "Success"){
      mapOfListed.delete(id);
      var ownedNFTs: List.List<Principal> = switch(mapOwners.get(ownerId)){
        case null List.nil<Principal>();
        case (?result) result;
      };

      ownedNFTs := List.filter(ownedNFTs,func(listItemId:Principal):Bool{
        return listItemId != id;
      });
      mapOwners.put(ownerId, ownedNFTs);
      addToOwnerMap(newOwnerId, id);
      
      return "Success";
    }else{
      return transferResult;
    }
  };

}