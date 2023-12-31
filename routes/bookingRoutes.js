const router = require("express").Router();

const { getAllBookings, getAllBookingsOfUser, getBookingById, makeBooking, cancelBookingById, manageBookingById } = require("../controllers/bookingControllers");
const authMiddleware = require("../middlewares/authMiddleware");

/**
 * @swagger
 * components:
 *   schemas:
 *     Bookings:
 *       type: object
 *       properties:
 *         userId:
 *           type: object
 *           description: The user id
 *         hotelId:
 *           type: object
 *           description: The hotel id
 *         checkin:
 *           type: Date
 *           description: checkin date
 *         checkout:
 *           type: Date
 *           description: checkout date
 *         numberOfGuests:
 *           type: number
 *           description: number of guests
 * 
 */

/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: REST API For Managing Bookings
 * /api/bookings/getAllBookings:
 *   get:
 *     tags: [Bookings]
 *     description: All Bookings
 *     responses:
 *       200:
 *         description: Returns all the bookings
 */
router.get("/getAllBookings",authMiddleware,getAllBookings);

/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: REST API For Managing Bookings
 * /api/bookings/getAllBookingsOfUser:
 *   get:
 *     tags: [Bookings]
 *     description: All Bookings Of Logged In User
 *     responses:
 *       200:
 *         description: Returns all the bookings of logged in user
 */
router.get("/getAllBookingsOfUser",authMiddleware,getAllBookingsOfUser);

/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: REST API For Managing Bookings
 * /api/bookings/getBookingById/{id}:
 *   get:
 *     tags: [Bookings]
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: The Selected Booking ID.
 *     description: Selected Booking By Id
 *     responses:
 *       200:
 *         description: Returns the selected booking details by id
 */
router.get("/getBookingById/:id",authMiddleware,getBookingById);

/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: REST API For Managing Bookings
 * /api/bookings/makeBooking:
 *   post:
 *     tags: [Bookings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Bookings'
 *     responses:
 *       201:
 *         description: Created
 */
router.post("/makeBooking",authMiddleware,makeBooking);

/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: REST API For Managing Bookings
 * /api/bookings/manageBookingById/{id}:
 *   put:
 *     tags: [Bookings]
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: The Selected Booking ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Bookings'
 *     responses:
 *       200:
 *         description: Managed the selected booking by id details
 */
router.put("/manageBookingById/:id",authMiddleware,manageBookingById);

/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: REST API For Managing Bookings
 * /api/bookings/cancelBookingById/{id}:
 *   delete:
 *     tags: [Bookings]
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: The Selected Booking ID.
 *     responses:
 *       200:
 *         description: Cancelled the selected booking by id details
 */
router.delete("/cancelBookingById/:id",authMiddleware,cancelBookingById);

module.exports = router;