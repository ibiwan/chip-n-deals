export const getAllChipSets = `#graphql
{
  allChipSets{
  name
    opaqueId
    chips {
      color
      value
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
    chips {
      color
      value
      opaqueId
    }
  }
}
`;

export const createChipSet = `#graphql
mutation CreateChipSet ($chipSetData:CreateChipSetInput!){
  createChipSet(chipSetData:$chipSetData){
    name
    opaqueId
    chips {
      color 
      value
      opaqueId
    }
  }
}
`;
