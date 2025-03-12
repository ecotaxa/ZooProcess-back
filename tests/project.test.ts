const chai = require('chai');
const { expect } = require('chai');
const axios = require('axios');

describe('Project API Endpoints', () => {
  it('should return same project data when querying by name and id', async () => {
    const baseUrl = 'http://zooprocess.imev-mer.fr:8081/v1';
    
    // First query by name
    const nameResponse = await axios.get(`${baseUrl}/projects/Zooscan_apero_pp_2023_wp2_sn002`);
    expect(nameResponse.status).to.equal(200);
    const projectById = nameResponse.data;
    
    // Then query by ID using the id from first response
    const idResponse = await axios.get(`${baseUrl}/projects/${projectById.id}`);
    expect(idResponse.status).to.equal(200);
    
    // Compare both responses
    expect(idResponse.data).to.deep.equal(projectById);
  });
});
