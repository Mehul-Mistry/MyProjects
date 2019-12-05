const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/EmployeeDB",{ useUnifiedTopology: true ,useNewUrlParser: true });

var db = mongoose.connection;

db.on('error', console.error.bind(console, "Connection Error"));

db.once('open',()=>{
    console.log('Connected Successfully');
    var empSchema = new mongoose.Schema({
        empName: {
            type: String,
            required: true,
            uppercase: true,
            minlength: [6, '6oti'],
            maxlength: [40,'moti']
        },
        gender: {
            type: [String],
            required: true,
            enum: ["Male", "Female", "Optional"]
        },
        skill: {
            type: [String],
            required: true,
            enum: ["Developoment", "Testing", "Coding", "QA"]
        },
        salary: {
            type: Number,
            required: true,
            minlength: [5000, '6oti'],
            maxlength: [10000,'moti']
        }
    });

    var employee = mongoose.model('Emp', empSchema,'EmpTB');

    e1 = new employee({
        empName: "Messi348",
        gender: "Male",
        skill: ["Testing", "QA"],
        salary: 6000
    });

    e1.save((err,emp)=>{
        if(err)
            throw err;
        console.log(emp.empName + " Saved");
    });
});