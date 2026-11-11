
const mongoose = require("mongoose");
const validator = require("validator");

const customerSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email");
        }
      },
    },

    startDate: {
      type: Date,
      required: true,
    },

    durationMonths: {
      type: Number,
      required: true,
      enum: [3, 6, 12],
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Automatically calculate expiration date
customerSchema.pre("validate", function (next) {
  if (this.startDate && this.durationMonths) {
    const expiresAt = new Date(this.startDate);

    expiresAt.setMonth(
      expiresAt.getMonth() + this.durationMonths
    );

    this.expiresAt = expiresAt;
  }

  next();
});

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
