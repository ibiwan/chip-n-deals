http://localhost:3000/graphql

{
  allChips{
    color
    value
  }
  chipsForChipSet(chipset_opaque_id:"d098ec38-4e3b-4a26-82d6-c2e67ac0d1c1"){
      color
      value    
  }
  chipSet(opaque_id:"d098ec38-4e3b-4a26-82d6-c2e67ac0d1c1"){
    opaqueId
    name
    chips{
      color
      value
    }
  }
}

http://localhost:3000/populate


TODO:
https://blog.logrocket.com/use-dataloader-nestjs/
