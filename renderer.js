const fs = require("fs");

const mergeValues = (values, content) => {
  for(let key in values) { //Cycle over the keys
    content = content.replace("{{" + key + "}}", values[key]);  //To show only the values, without the keys
  }
  return content;
}

const view = (templateName, values, res) => {
  let fileContents = fs.readFileSync(`./views/${templateName}.html`, {encoding: "utf8"});
  fileContents = mergeValues(values, fileContents); //Insert values into the content
  res.write(fileContents);  //Write out the contents to the response
}

module.exports.view = view;

/*
console.log(values[key]);
Rio de Janeiro
RJ
Botafogo
Rua da Passagem
1200,179
22290030

console.log(key);
cidade
estado
bairro
logradouro
area_cidade
cep

console.log(values);
{ cidade: 'Rio de Janeiro',
  estado: 'RJ',
  bairro: 'Botafogo',
  logradouro: 'Rua da Passagem',
  area_cidade: '1200,179',
  cep: '22290030' }


*/