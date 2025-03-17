

describe('Service Samples tests', () => {
  test('samples remap', () => {
    

    //load file mocks/samples.m2n.json  
    const samples = require('../mocks/samples.m2n.json');
    //console.log(samples);

    

    const reamped = [
        {
            "id": "67d7a850ff15a5db7ee65007",
            "name": "apero2023_pp_wp2_002_st01_d_d1_1",
            "createdAt": "2025-03-17T04:42:56.308Z",
            "sampleId": "67d7a850ff15a5db7ee64fe6",
            "userId": "67d2f61ab9c27832838594af",
            "metadataModelId": null,
            "qCStateId": null,
            "scan": [
                {
                    "id": "67d7a850ff15a5db7ee65015",
                    "url": "/Volumes/sgalvagno/plankton/zooscan_zooprocess_test/Zooscan_apero_pp_2023_wp2_sn002/Zooscan_scan/_raw/apero2023_pp_wp2_002_st01_d_d1_raw_1.tif",
                    "type": "SCAN",
                    "createdAt": "2025-03-17T04:42:56.405Z",
                    "userId": "67d2f61ab9c27832838594af",
                    "instrumentId": "67d2e965b9c2783283859438",
                    "background": false,
                    "archived": false,
                    "deleted": false,
                    "deletedAt": null,
                    "projectId": "67d7a84fff15a5db7ee64f9e"
                }
            ]
        },
        {
            "id": "67d7a850ff15a5db7ee65018",
            "name": "apero2023_pp_wp2_002_st01_d_d2_1",
            "createdAt": "2025-03-17T04:42:56.430Z",
            "sampleId": "67d7a850ff15a5db7ee64fe6",
            "userId": "67d2f61ab9c27832838594af",
            "metadataModelId": null,
            "qCStateId": null,
            "scan": [
                {
                    "id": "67d7a850ff15a5db7ee65026",
                    "url": "/Volumes/sgalvagno/plankton/zooscan_zooprocess_test/Zooscan_apero_pp_2023_wp2_sn002/Zooscan_scan/_raw/apero2023_pp_wp2_002_st01_d_d2_raw_1.tif",
                    "type": "SCAN",
                    "createdAt": "2025-03-17T04:42:56.508Z",
                    "userId": "67d2f61ab9c27832838594af",
                    "instrumentId": "67d2e965b9c2783283859438",
                    "background": false,
                    "archived": false,
                    "deleted": false,
                    "deletedAt": null,
                    "projectId": "67d7a84fff15a5db7ee64f9e"
                }
            ]
        }
    ]


    
    validTypes.forEach(type => {
      expect(Object.values(ScanType)).toContain(type)
    })
  })