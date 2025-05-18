import { addFriend, deleteFriend, getFriends } from "../models/friendsModel.js";

export const getAllFriends = async(req, res) => {
    const user_id = req.token.userId;

    if (!user_id) {
        return res.status(400).json({message: 'User id is missing or invalid.'})
    };

    try {
        const friends = await getFriends(user_id);
        res.status(200).json({friends});
    } catch (e) {
        console.log(e);
        res.status(500).json({message: 'Server error, try later'});
    }
};

export const addNewFriend = async(req,res) => {
    const user_id = req.token.userId;
    const friend_id = req.body.friend_id;

    if (!user_id) {
        return res.status(400).json({message: 'User id is missing or invalid.'});
    };

    if (!friend_id) {
        return res.status(400).json({ message: 'Friend id is required.' });
    };

    try {
        const newFriend = await addFriend(user_id, friend_id);
        res.status(201).json({newFriend});
    } catch (e) {
        console.log(e);
        res.status(500).json({message: 'Server error, try later'});
    }
};

export const deleteFromFriends = async(req, res) => {
    const user_id = req.token.userId;
    const friend_id = req.params.id;;

    try {
        const friendToDelete = await deleteFriend(user_id, friend_id);
        res.status(200).json({friendToDelete});
    } catch (e) {
        console.log(e);
        res.status(500).json({message: 'Server error, try later'});
    }
};