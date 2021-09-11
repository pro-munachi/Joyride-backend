const router = require('express').Router();
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');

const generateToken = require('../utils/generatetoken');
const User = require('../models/userModel');
const Role = require('../models/roleModel');

//Register users

router.post('/register', async (req, res) => {
  try {
    let { email, password, passwordCheck, displayName, roles } = req.body;

    // validate

    if (!email || !password || !passwordCheck) {
      res.status(400).json({ msg: 'Not all fields have been filled' });
    }

    if (password.length < 5) {
      res
        .status(400)
        .json({ msg: 'Password should be 5 characters and above ' });
    }

    if (password !== passwordCheck) {
      res.status(400).json({ msg: 'Enter the same password twice ' });
    }

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      res.status(400).json({ msg: 'An account with this user already exist ' });
    }

    if (!displayName) {
      displayName = email;
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: passwordHash,
      displayName,
      roles,
    });
    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login users

/*router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // validate

    if (!email || !password) {
      res.status(400).json({ msg: 'An account with this user already exist ' })
    }

    const user = await User.findOne({ email: email })
    if (!user) {
      res.status(400).json({ msg: 'invalid email ' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      res.status(400).json({ msg: 'invalid credentials' })
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET)
    res.json({
      token,
      user: {
        id: user._id,
        displayName: user.displayName,
        email: user.email,
        hasError: false,
        message: 'login successful',
      },
    })
  } catch (err) {
    res.json({ error: err, hasError: true })
  }
})*/

router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        displayName: user.displayName,
        email: user.email,
        roles: user.roles,
        token: generateToken(user._id),
        hasError: false,
      });
    } else {
      res.json({
        error: 'Invalid email or password',
        hasError: true,
      });
    }
  })
);

//fetch users

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const allUsers = await User.find({});
    res.json(allUsers);
  })
);

// get user by id

router.get('/:userId', async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// Post roles

router.post('/roles', async (req, res) => {
  try {
    const { name } = req.body;

    // validate roles as not to post the same role twice

    const existingRole = await User.findOne({ name: name });
    if (existingRole) {
      res.status(400).json({ msg: 'Role already exist ' });
    }

    const newRole = new Role({
      name,
      hasError: false,
      message: 'role posted',
    });
    const savedRole = await newRole.save();
    res.json(savedRole);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//fetch roles

router.get('/getRoles', async (req, res) => {
  const allRoles = await Role.find({});
  res.json(allRoles);
});

module.exports = router;
