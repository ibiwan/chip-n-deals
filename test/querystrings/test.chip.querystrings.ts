export const getAllChips = `#graphql
{
  allChips {
    color 
    value 
    opaqueId
    chipSet {
      name 
      opaqueId
      owner {username}
    }
    owner {username}
  }
}
`;

export const getChipsForSet = `#graphql
query GetChipsForChipSet($chipset_opaque_id:String!){
  chipsForChipSet(chipset_opaque_id:$chipset_opaque_id){
    color
    value
    opaqueId
    chipSet {
      name
      opaqueId
      owner {username}
    }
    owner {username}
  }
}
`;

export const createChip = `#graphql
mutation CreateChip ($chipData:CreateChipInput!){
  createChip(chipData:$chipData){
    color
    value
    opaqueId
    chipSet{
      opaqueId
      name
      owner {username}
    }
    owner {username}
  }
}
`;
