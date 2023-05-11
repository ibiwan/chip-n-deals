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
query getChipsForChipSet($chipset_opaque_id:String!){
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

export const getChipSet = `#graphql
query getChipSet($opaque_id:String!){
  chipSet(opaque_id:$opaque_id){
    name
    opaqueId
    chips{
      color
      value
    }
  }
}
`;
