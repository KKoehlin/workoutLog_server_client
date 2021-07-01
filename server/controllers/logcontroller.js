const Express = require("express");
//const { JsonWebTokenError } = require("jsonwebtoken");
const router = Express.Router();
const validateJWT = require("../middleware/validate-jwt");
const { LogModel } = require("../models");

// router.get('/practice', (req, res) => {
//     res.send('Hey!! This is a practice route!')
// });

/*
============================
LOG CREATE
============================
*/

router.post("/create", validateJWT, (req, res) => {
    //const { description, definition, result, } = req.body.log; 
    //const { id } = req.user; 

    const logEntry = {
        // description: "Test",
        // definition: "test",
        // result: "test",
        // owner_id: id
         description: req.body.description,
         definition: req.body.definition,
         result: req.body.result,
         owner_id: req.user.id
    }
    LogModel.create(logEntry)
     .then(logs => res.status(200).json(logs))
     .catch(err => res.status(500).json({ error: err }))
});

//router.get("/about", (req, res) => {
   // res.send("This is the about route!")
//});

/*
============================
GET ALL LOGS
============================
*/

router.get("/", async (req, res) => {
    try {
        const entries = await LogModel.findAll();
        res.status(200).json(entries);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

/*
============================
GET LOG BY USER
============================
*/

router.get("/mine", validateJWT, async (req, res) => {
    const { id } = req.user;
    try {
        const userLogs = await LogModel.findAll({
            where: {
                owner_id: id 
            }
        });
        res.status(200).json(userLogs);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

/*
============================
UPDATE A LOG
============================
*/

router.put("/update/:entryId", validateJWT, async (req, res) => { 
    const { description, definition, result } = req.body;
    const logId = req.params.entryId;
    const userId = req.user.id;

    const query = {
        where: {
            id: logId,
            owner_id: userId
        }
    };

    const updatedLog = {
        description: description,
        definition: definition,
        result: result
    };

    try {
        const update = await LogModel.update(updatedLog, query);
        res.status(200).json(update);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

/*
============================
DELETE A LOG ENTRY
============================
*/

router.delete("/delete/:id", validateJWT, async (req, res) => {
    const ownerId = req.user.id;
    const logId = req.params.id;

    try {
        const query = {
            where: {
                id: logId,
                owner_id: ownerId
            }
        };

        await LogModel.destroy(query);
        res.status(200).json({ message: "Log Entry Removed"});
    } catch (err) {
        res.status(500).json({ error: err });
    }
});


module.exports = router; 
