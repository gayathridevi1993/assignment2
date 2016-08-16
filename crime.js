const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
 input: fs.createReadStream('crime.csv')
});

var l=0;
var year_in;
var value_in;
var row;
var result=[];
var i;

rl.on('line', function (line) {
  row=line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
  if(l==0)
  {
    l=1;
    year_in=row.indexOf("Year");
    value_in=row.indexOf("Description");
  }
  else
  {
    if(row[value_in]=="$500 AND UNDER" || row[value_in]=="OVER $500")
    {
      if(result.length==0)
      {
        var obj={};
        obj["year"]=row[year_in];
        if(row[value_in]=="$500 AND UNDER")
        {
          obj["under500"]=1;
          obj["over500"]=0;
        }
        else {
          obj["under500"]=0;
          obj["over500"]=1;
        }
        result.push(obj);
      }
      else {
        for(i=0;i<result.length;i++)
        {
          if(result[i].year==row[year_in])
          {
            if(row[value_in]=="$500 AND UNDER")
            {
              result[i]["under500"]+=1;
            }
            else
            {
              result[i]["over500"]+=1;
            }
            break;
          }
        }
        if(i==result.length)
        {
          var obj={};
          obj["year"]=row[year_in];
          if(row[value_in]=="$500 AND UNDER")
          {
            obj["under500"]=1;
            obj["over500"]=0;
          }
          else {
            obj["under500"]=0;
            obj["over500"]=1;
          }
          result.push(obj);
        }
      }
    }
  }
});



rl.on('close',function(){

  result.sort(function(a,b){
    return(a.year - b.year)
  });
  var str=JSON.stringify(result);
  fs.writeFile('crime.json',str);
});
