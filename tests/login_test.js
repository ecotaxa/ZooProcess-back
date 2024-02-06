
it('login a user', async () => {

    let headersList = {
    "Accept": "*/*",
    "User-Agent": "Thunder Client (https://www.thunderclient.com)",
    "Content-Type": "application/json"
    }
    
    let bodyContent = JSON.stringify({
        "email":"seb@seb.com",
        "password":"seb1234"
    });
    
    let response = await fetch("http://zooprocess.imev-mer.fr:8081/v1/login", { 
        method: "POST",
        body: bodyContent,
        headers: headersList
    });
    
    let data = await response.text();
    console.log("bearer: ", data);
       
    expect(response.statusCode).toEqual(200);
  
  });
  
  