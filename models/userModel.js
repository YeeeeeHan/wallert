const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, 'Please add a username'],
            unique: true,
        },
        walletAddress: {
            type: String,
            required: [true, 'Please add a WalletAddress'],
        },
        tgChatId: {
            type: String,
            required: [true, 'Please add a tgChatId'],
        },
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('User', userSchema)
