const mongoose = require('mongoose')
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const validator = require('validator')

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Please add a username'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      validate: [validator.isEmail, 'Please provide a valid email!'],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: [8, 'Password must be at least 8 characters long'],
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    passwordChangedAt: Date,
    refreshTokens: {
      type: [String],
      default: [],
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

userSchema.pre('save', async function (next) {
  // Only run this password if password was actually modified
  if (!this.isModified('password')) {
    return next()
  }

  const salt = await bcrypt.genSalt(10)

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, salt)

  next()
})

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) {
    return next()
  }

  this.passwordChangedAt = Date.now() - 1000
  next()
})

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword)
}

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex')
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000
  return resetToken
}

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    )
    return JWTTimestamp < changedTimestamp
  }

  // False means NOT changed
  return false
}

module.exports = mongoose.model('User', userSchema)
