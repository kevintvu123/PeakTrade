import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateGroupThunk } from "../../store/group";
import styles from "../cssModules/CreateGroupForm.module.css"

function EditGroupForm({ setHasSubmitted, setShowEditModal, groupId }) {
    const dispatch = useDispatch();

    const group = useSelector((state) => state.group)
    let prevName = (group.groups[groupId].name)

    const [groupName, setGroupName] = useState(prevName);
    const [errors, setErrors] = useState([]);


    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = [];

        if (groupName.length > 25) {
            errors.push(
                "Please enter a group name that is less than 25 characters"
            );
        }

        setErrors(errors);

        if (!errors.length) {
            setShowEditModal(false);
            const editGroup = await dispatch(
                updateGroupThunk({ name: groupName }, groupId)
            ).then(() => setHasSubmitted((prevValue) => !prevValue));
            return editGroup;
        }
    };


    return (
        <div className={styles.createGroupFormContainer}>
            <div className={styles.createGroupHeader}>Change your group name</div>
            <form onSubmit={handleSubmit}>
                <input
                    className={styles.createGroupInput}
                    type="text"
                    value={groupName}
                    onChange={(e) => {
                        setGroupName(e.target.value)
                        setErrors([])
                    }}
                    placeholder="Group Name"
                    required
                />
                <div className={styles.errorMap}>
                    {errors.length > 0 && (
                        <div>
                            {errors.map((error) => (
                                <div key={error}>{error}</div>
                            ))}
                        </div>
                    )}
                </div>
                <button className={styles.createGroupButton} type="submit">Change Name</button>
            </form>
        </div>
    );
}

export default EditGroupForm;