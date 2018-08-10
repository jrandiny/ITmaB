const poiSchema = {
  name : 'poi',
  properties : {
    id : 'int',
    nama : 'string',
    jenis : 'int',
    mapId: 'int',
    gedung : 'string',
    lantai : 'int',
    deskripsi : 'string',
    jambuka : 'int',
    jamtutup : 'int',
    pointx : 'int',
    pointy : 'int'
  }
}

const mapSchema = {
  name: 'map',
  properties:{
    id: 'int',
    nama:'string',
    jenis:'int',
    width:'int',
    height:'int',
    pointX:'int',
    pointY:'int'
  }
}

export {poiSchema, mapSchema};
