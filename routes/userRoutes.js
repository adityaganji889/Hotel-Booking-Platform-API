const router = require("express").Router();

const {register,login, updateUserRole, updateUserById, deleteUserById, getAllUsers, getUserById} = require("../controllers/userControllers");
const authMiddleware = require("../middlewares/authMiddleware");

/**
 * @swagger
 * components:
 *   schemas:
 *     Users:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           unique: true
 *           trim: true
 *           minlength: 3
 *           maxlength: 30
 *           description: The name of the user
 *         email:
 *           type: string
 *           unique: true
 *           trim: true
 *           lowercase: true
 *           match: /^\S+@\S+\.\S+$/
 *           description: The email id of the user
 *         password:
 *           type: string
 *           minlength: 6
 *           description: The password of the user
 *         age:
 *           type: number
 *           min: 15
 *           max: 99
 *           description: The age of the user
 *         gender:
 *           type: enum
 *           enum: ['M', 'F']
 *           maxlength: 1
 *           description: The gender of the user
 *         role: 
 *           type: string
 *           enum: ['admin','author']
 *           default: 'author'
 *           description: The role of the user
 * 
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: REST API For Managing Users
 * /api/users/getAllUsers:
 *   get:
 *     tags: [Users]
 *     description: All Users
 *     responses:
 *       200:
 *         description: Returns all the users
 */
router.get("/getAllUsers",authMiddleware,getAllUsers);

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: REST API For Managing Users
 * /api/users/getUserById/{id}:
 *   get:
 *     tags: [Users]
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: The Selected User ID.
 *     description: Selected User By Id
 *     responses:
 *       200:
 *         description: Returns the selected user by id
 */
router.get("/getUserById/:id",authMiddleware,getUserById);

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: REST API For Authentication
 * /api/users/register:
 *   post:
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Users'
 *     responses:
 *       200:
 *         description: Register User
 */
router.post("/register",register);

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: REST API For Authentication
 * /api/users/login:
 *   post:
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Users'
 *     responses:
 *       200:
 *         description: Login User
 */
router.post("/login",login);

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: REST API For Managing Users
 * /api/users/updateUserRole/{id}:
 *   put:
 *     tags: [Users]
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: The Selected User ID.
 *     responses:
 *       200:
 *         description: Updated the selected user by id role status
 */
router.put("/updateUserRole/:id",authMiddleware,updateUserRole);

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: REST API For Managing Users
 * /api/users/updateUserById/{id}:
 *   put:
 *     tags: [Users]
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: The Selected User ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Users'
 *     responses:
 *       200:
 *         description: Updated the selected user by id role status
 */
router.put("/updateUserById/:id",authMiddleware,updateUserById);

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: REST API For Managing Users
 * /api/users/deleteUserById/{id}:
 *   delete:
 *     tags: [Users]
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: The Selected User ID.
 *     responses:
 *       200:
 *         description: Deleted the selected user by id role status
 */
router.delete("/deleteUserById/:id",authMiddleware,deleteUserById);

module.exports = router;