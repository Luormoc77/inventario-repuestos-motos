/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_590519246")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE INDEX `idx_1tSe7qX9fe` ON `repuestos` (`nombre`)",
      "CREATE INDEX `idx_ViZNiBizT4` ON `repuestos` (`precio`)",
      "CREATE INDEX `idx_7NvXiwMx6p` ON `repuestos` (`stock`)",
      "CREATE INDEX `idx_OIdoVkAUNr` ON `repuestos` (`categoria`)"
    ]
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_590519246")

  // update collection data
  unmarshal({
    "indexes": []
  }, collection)

  return app.save(collection)
})
