import { addGroupWithMembers, deleteGroup, getExtendedGroups, getGroupById, deleteGroupMember } from "../models/groupsModel.js";
import { summarizeGroupExpensesAndRefunds } from '../helpers/summarizeGroupExpensesAndRefunds.js';

export const getAllGroups = async(req, res) => {
    const owner_id = req.token.userId;

    if (!owner_id) {
        return res.status(400).json({message: 'Owner id is missing or invalid.'});
    };

    try {
        const groups = await getExtendedGroups(owner_id);
        groups.forEach((g) => {
            g.financeSummary = summarizeGroupExpensesAndRefunds(g, owner_id);
        })
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

export const deleteFromGroups = async(req, res) => {
    const owner_id = req.token.userId;
    const group_id = req.params.id;
    const group = await getGroupById(group_id);

    if(!group) {
        res.status(404).json({ message: 'No groups found' });
        return;
    };

    group.financeSummary = summarizeGroupExpensesAndRefunds(group, owner_id);
    if (group.financeSummary.groupBalance != 0) {
        res.status(400).json({message: 'Cannot delete group until settled up'});
        return;
    }

    try {
        if (owner_id != group.owner_id) {
            return res.status(403).json({message: 'Only owner can delete group'});
        };

        const groupToDelete = await deleteGroup(group_id);
        res.sendStatus(200);
    } catch (e) {
        console.log(e);
        res.status(500).json({message: 'Server error, try later'});
    }
};

export const leaveGroup = async (req, res) => {
    const userId = req.token.userId;
    const group_id = req.params.id;
    const group = await getGroupById(group_id);

    if(!group) {
        res.status(404).json({ message: 'No groups found' });
        return;
    };
    const memberInGroup = group.members.find(m => m.id == userId);
    if (!memberInGroup) {
        res.status(400).json({message: 'Current user is not part of the group'});
        return;
    };

    group.financeSummary = summarizeGroupExpensesAndRefunds(group, userId);
    if (group.financeSummary.currentUserBalance != 0) {
        res.status(400).json({message: 'Cannot leave group until settled up'});
        return;
    };

    try {
        await deleteGroupMember(group_id, userId);
        res.sendStatus(200);
    } catch (e) {
        console.log(e);
        res.status(500).json({message: 'Server error, try later'});
    }
};