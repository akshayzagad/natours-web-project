const { log } = require("console");
const express = require("express");
const fs = require("fs");

const app = express();

const port = 3000;

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`),
);

app.use(express.json());

 const getAllTours = (req, res) => {
  res.status(200).json({
    status: "succses",
    results: tours.length,
    data: {
      tours: tours,
    },
  });
};

const getTour = (req, res) => {
  console.log(req.params);
  const id =req.params.id * 1 ;

  const tour = tours.find(el => el.id === id);

  if (!tour) {
    return  res.status(404).json({
    status: "faild",
    message:'Invali id'
  });
  }

  res.status(200).json({
    status: "succses",
    results: tours.length,
    data: {
      tour
    },
  });
};



const createTour = (req, res) => {
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
};

const updateTour = (req,res) =>{
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
}

const deleteTour = (req,res)=>{
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status:'fail',
      message:'Invalid id'
    })
  }

  res.status(204).json({
    status:'succses',
    data:null
  })
}

const getAllUsers = (req,res) => {
  res.status(500).json({
    status:"error",
    message:"this rote is not defined!"
  })
}

const getUser = (req,res) => {
  res.status(500).json({
    status:"error",
    message:"this rote is not defined!"
  })
}

const createUsers = (req,res) => {
  res.status(500).json({
    status:"error",
    message:"this rote is not defined!"
  })
}

const updateUser = (req,res) => {
  res.status(500).json({
    status:"error",
    message:"this rote is not defined!"
  })
}

const deleteUsers = (req,res) => {
  res.status(500).json({
    status:"error",
    message:"this rote is not defined!"
  })
}

// Mouting the router

const tourRouter = express.Router();
const userRouter = express.Router();

app.use('/api/v1/tours', tourRouter);

app.use('/api/v1/users', userRouter)

tourRouter.route('/').get(getAllTours).post(createTour);

tourRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

userRouter.route('/').get(getAllUsers).post(createUsers);

userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUsers);

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
