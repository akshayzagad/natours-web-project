const { log } = require("console");
const express = require("express");
const fs = require("fs");

const app = express();

const port = 3000;

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`),
);

app.use(express.json());

app.get("/api/v1/tours", (req, res) => {
  res.status(200).json({
    status: "succses",
    results: tours.length,
    data: {
      tours: tours,
    },
  });
});

app.post("/api/v1/tours", (req, res) => {
  console.log(req.body);
  
const newId = tours[tours.length-1].id+1;

  const newTour = Object.assign({id:newId},req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    err => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour
        }
      });
    }
  );
});

app.patch("/app/v1/tours/:id",(req,res)=>{
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status:'fail',
      message:'Invalid id'
    })
  }

  res.status(200).json({
    status:'succses',
    data:{
      tour:'<Updated tour here>'
    }
  })
})

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
