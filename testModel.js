const axios = require('axios');
const fs = require("fs");

const jsonData = require("./initialData.json");
const patterns = jsonData.data.pattern;

Promise.all(patterns.map((pattern)=>{
  return axios.post('http://localhost:5000/parse', {
    "q":pattern.text
  });
})).then(response=>{
  // console.log(response[0].data);
  const odgovori = response.map(single=>single.data);
  const newOdg = patterns.map((pattern)=>{
    const parsed = odgovori.find(odgovor=>odgovor.text === pattern.text);
    return{
      ...pattern,
      parsed
    }
  });

  const newFiltered = newOdg.filter(odg=>odg.entities.length>0);

  fs.writeFileSync("./testTESA.json", JSON.stringify(newFiltered), "utf-8");

}).catch(err=>{
  console.log(err);
})

