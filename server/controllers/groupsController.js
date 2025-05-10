import { addGroupWithMembers, getGroups } from "../models/groupsModel.js";

export const getAllGroups = async(req, res) => {
    const owner_id = req.token.userId;

    if (!owner_id) {
        return res.status(400).json({message: 'Owner id is missing or invalid.'});
    };

    try {
        const groups = await getGroups(owner_id);
        res.status(200).json({groups});
    } catch (e) {
        console.log(e);
        res.status(500).json({message: 'Server error, try later'});
    }
};

export const createGroupAddMembers = async(req,res) => {
    const owner_id = req.token.userId;
    const {name, description, members_ids} = req.body;

    if (!owner_id) {
        return res.status(400).json({message: 'Owner id is missing or invalid.'});
    };

    if (!name || !description || !members_ids){
        return res.status(400).json({message: 'Name, description and members ids required'});
    };

    try {
        const group = await addGroupWithMembers(owner_id, name, description, members_ids);
        res.status(200).json({group});
    } catch (e) {
        console.log(e);
        res.status(500).json({message: 'Server error, try later'});
    }
};