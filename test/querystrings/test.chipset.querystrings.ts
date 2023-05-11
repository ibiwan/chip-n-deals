export const getChipSet = `#graphql
query getChipSet($opaque_id:String!){
  chipSet(opaque_id:$opaque_id){
    name
    opaqueId
    chips {
      color
      value
    }
  }
}
`;

export const createChipSet = `#graphql
mutation CreateChipSet ($chipSetData:ChipSetInput!){
  createChipSet(chipSetData:$chipSetData){
    name
    opaqueId
    chips {
      color 
      value
    }
  }
}
`
