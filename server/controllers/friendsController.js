import { getFriends } from "../models/friendsModel.js";

export const getAllFriends = async(req, res) => {
    const user_id = req.token.userId;

    try {
        const friends = await getFriends(user_id);
        res.status(201).json({friends});
    } catch (e) {
        console.log(e);
        res.status(500).json({message: 'Server error, try later'});
    }
};