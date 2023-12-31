const router = require("express").Router();

const { getAllHotels, getHotelById, editHotelById, deleteHotelById, addHotel } = require("../controllers/hotelControllers");
const authMiddleware = require("../middlewares/authMiddleware");

/**
 * @swagger
 * components:
 *   schemas:
 *     Hotels:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           trim: true
 *           description: The name of the hotel
 *         city:
 *           type: string
 *           trim: true
 *           description: The name of city in which hotel is situated
 *         availableRooms:
 *           type: number
 *           min: 0
 *           description: The numbers of rooms available in a hotel
 * 
 */



/**
 * @swagger
 * tags:
 *   name: Hotels
 *   description: REST API For Managing Hotels
 * /api/hotels/getAllHotels:
 *   get:
 *     tags: [Hotels]
 *     description: All Hotels
 *     responses:
 *       200:
 *         description: Returns all the hotels
 */
router.get("/getAllHotels",authMiddleware,getAllHotels);

/**
 * @swagger
 * tags:
 *   name: Hotels
 *   description: REST API For Managing Hotels
 * /api/hotels/getHotelById/{id}:
 *   get:
 *     tags: [Hotels]
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: The Selected Hotel ID.
 *     description: Selected Hotel By Id
 *     responses:
 *       200:
 *         description: Returns the selected hotel by id
 */
router.get("/getHotelById/:id",authMiddleware,getHotelById);

/**
 * @swagger
 * tags:
 *   name: Hotels
 *   description: REST API For Managing Hotels
 * /api/hotels/addHotel:
 *   post:
 *     tags: [Hotels]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Hotels'
 *     responses:
 *       201:
 *         description: Created
 */
router.post("/addHotel",authMiddleware,addHotel);

/**
 * @swagger
 * tags:
 *   name: Hotels
 *   description: REST API For Managing Hotels
 * /api/hotels/editHotelById/{id}:
 *   put:
 *     tags: [Hotels]
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: The Selected Hotel ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Hotels'
 *     responses:
 *       200:
 *         description: Updated the selected hotel by id details
 */
router.put("/editHotelById/:id",authMiddleware,editHotelById);

/**
 * @swagger
 * tags:
 *   name: Hotels
 *   description: REST API For Managing Hotels
 * /api/hotels/deleteHotelById/{id}:
 *   delete:
 *     tags: [Hotels]
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: The Selected Hotel ID.
 *     responses:
 *       200:
 *         description: Deleted the selected hotel by id details
 */
router.delete("/deleteHotelById/:id",authMiddleware,deleteHotelById);

module.exports = router;