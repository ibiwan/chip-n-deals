export const getAllChips = `#graphql
{
  allChips {
    color 
    value 
    chipSet {
      name 
      opaqueId
    }
  }
}
`;

export const getChipsForSet = `#graphql
query GetChipsForChipSet($chipset_opaque_id:String!){
  chipsForChipSet(chipset_opaque_id:$chipset_opaque_id){
    color
    value
    chipSet {
      name
      opaqueId
    }
  }
}
`;

export const createChip = `#graphql
mutation CreateChip ($chipData:ChipInput!){
  createChip(chipData:$chipData){
    color
    value
    chipSet{
      opaqueId
      name
    }
  }
}
`;
