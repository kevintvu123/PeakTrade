import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserGroupThunk } from "../../store/group";
import { deleteGroupMemberThunk } from "../../store/group";
import { deleteGroupThunk } from "../../store/group";

import { GroupModal } from "../../context/GroupModal";
import { EditGroupModal } from "../../context/EditGroupModal";

import CreateGroupForm from "../Forms/CreateGroupForm";
import JoinGroupForm from "../Forms/JoinGroupForm";
import EditGroupForm from "../Forms/EditGroupForm";

import styles from '../cssModules/Group.module.css'
import plusIcon from '../../assets/plus-icon.png'
import editIcon from '../../assets/edit-icon.png'


export default function Group() {
    const dispatch = useDispatch()

    const [showMore, setShowMore] = useState(false)
    const [groupId, setGroupId] = useState()
    const [editGroupId, setEditGroupId] = useState()
    const [showModal, setShowModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [hasSubmitted, setHasSubmitted] = useState(false)

    const group = useSelector((state) => state.group)
    const user = useSelector(state => state.session.user);

    useEffect(() => {
        dispatch(getUserGroupThunk())
    }, [dispatch, hasSubmitted])

    if (Object.keys(group).length === 0) return null

    const handleLeaveGroup = async (groupId) => {
        const leaveGroup = await dispatch(deleteGroupMemberThunk(groupId))
            .then(() => setHasSubmitted((prevValue) => !prevValue));
        return leaveGroup;
    }

    const handleDeleteGroup = async (groupId) => {
        const deleteGroup = await dispatch(deleteGroupThunk(groupId))
            .then(() => setHasSubmitted((prevValue) => !prevValue));
        return deleteGroup;
    }

    const groupsArr = group.groupsArr
    const groupBool = groupsArr.length

    return (
        <div>
            <div className={styles.groupHeader}>
                Groups
                <div className={styles.iconContainer} onClick={() => setShowModal(true)}>
                    <img src={plusIcon} />
                </div>
            </div>
            {showModal && (
                <GroupModal onClose={() => {
                    setShowModal(false)
                }}>
                    <div className={styles.groupModalContainer}>
                        <div className={styles.createServerContainer}>
                            <CreateGroupForm setShowModal={setShowModal} setHasSubmitted={setHasSubmitted} />
                        </div>
                        <div className={styles.joinServerContainer}>
                            <JoinGroupForm setShowModal={setShowModal} setHasSubmitted={setHasSubmitted} />
                        </div>
                    </div>
                </GroupModal>
            )}
            {!groupBool && (
                <div className={styles.noGroupDiv}>
                    You currently have no groups! Feel free to click the plus icon to create or join a group.
                </div>
            )}
            {!!groupBool && (
                groupsArr.map((group) => {
                    return (
                        <div className={styles.eachGroupContainer}>
                            {showEditModal && (
                                <EditGroupModal onClose={() => {
                                    setShowEditModal(false)
                                }}>
                                    <EditGroupForm setShowEditModal={setShowEditModal} setHasSubmitted={setHasSubmitted} groupId={editGroupId} />
                                </EditGroupModal>
                            )}
                            <div className={styles.nameContainer}>
                                <div className={styles.nameDiv}>
                                    <div>
                                        {group.name}
                                    </div>
                                    {(group.ownerId === user.id) &&
                                        <img src={editIcon} onClick={() => {
                                            setShowEditModal(true)
                                            setEditGroupId(group.id)
                                        }} />
                                    }
                                </div>
                                <div className={styles.showMoreDiv} onClick={() => {
                                    if ((showMore === true) && (group.id !== groupId)) {
                                        setGroupId(group.id)
                                    }
                                    if ((showMore === true) && (group.id === groupId)) {
                                        setShowMore(false)
                                        setGroupId()
                                    }
                                    if ((showMore === false)) {
                                        setShowMore((prevVal) => !prevVal)
                                        setGroupId(group.id)
                                    }
                                }}>
                                    Show More
                                </div>
                            </div>
                            {showMore && (groupId === group.id) && (
                                <div>
                                    <div className={styles.groupDetailMessage}>To invite more friends, share your group name and id ({group.id})</div>
                                    <div className={styles.groupDetailsContainer}>
                                        <div className={styles.headerMemberContainer}>
                                            <div className={styles.groupDetailHeader}>
                                                <div>Member Name:</div>
                                                <div>Buying Power:</div>
                                            </div>
                                            {
                                                group["members"].map((member) => {
                                                    return (
                                                        <div className={styles.eachMemberContainer}>
                                                            <div>
                                                                {`${member.firstName} ${member.lastName}`}
                                                            </div>
                                                            <div>
                                                                ${parseFloat(member.buyingPower).toFixed(2)}
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                    <div className={styles.groupSettingContainer}>
                                        {(group.ownerId !== user.id) &&
                                            <button onClick={() => handleLeaveGroup(group.id)}>Leave Group</button>
                                        }
                                        {(group.ownerId === user.id) &&
                                            <button onClick={() => handleDeleteGroup(group.id)}>Delete Group</button>
                                        }
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                })
            )}
        </div>
    )
}