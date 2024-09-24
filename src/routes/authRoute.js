const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const Admin = require('../models/Admin');
const Client = require('../models/Client');

// @route    POST /api/auth/admin/signup
// @desc     Register admin
// @access   Public
router.post('/admin/signup', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
        let admin = await Admin.findOne({ email });

        if (admin) {
            return res.status(400).json({ msg: 'Admin already exists' });
        }

        admin = new Admin({
            name,
            email,
            password
        });

        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(password, salt);

        await admin.save();

        const payload = {
            admin: {
                id: admin.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ msg: 'Admin registered successfully', token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route    POST /api/auth/client/signup
// @desc     Register client
// @access   Public
router.post('/client/signup', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
        let client = await Client.findOne({ email });

        if (client) {
            return res.status(400).json({ msg: 'Client already exists' });
        }

        client = new Client({
            name,
            email,
            password
        });

        const salt = await bcrypt.genSalt(10);
        client.password = await bcrypt.hash(password, salt);

        await client.save();

        const payload = {
            client: {
                id: client.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ msg: 'Client registered successfully', token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route    POST /api/auth/admin/signin
// @desc     Admin login
// @access   Public
router.post('/admin/signin', [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        // Find the admin by email
        let admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Generate and return JWT
        const payload = {
            admin: {
                id: admin.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },  // Token expires in 1 hour
            (err, token) => {
                if (err) throw err;
                res.json({ msg: "Admin signed in successfully", token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


// @route    POST /api/auth/client/signin
// @desc     Client login
// @access   Public
router.post('/client/signin', [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        // Find the client by email
        let client = await Client.findOne({ email });

        if (!client) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, client.password);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Generate and return JWT
        const payload = {
            client: {
                id: client.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },  // Token expires in 1 hour
            (err, token) => {
                if (err) throw err;
                res.json({ msg: "Client signed in successfully", token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
