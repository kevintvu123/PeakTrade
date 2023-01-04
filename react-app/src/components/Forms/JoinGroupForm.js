import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { postGroupMemberThunk } from "../../store/group";
import styles from "../cssModules/JoinGroupForm.module.css"

function JoinGroupForm({ setHasSubmitted, setShowModal }) {
    const dispatch = useDispatch();

    const [groupName, setGroupName] = useState("");
    const [groupId, setGroupId] = useState()
    const [errors, setErrors] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = [];

        setErrors(errors);

        if (!errors.length) {
            setShowModal(false);
            const submitGroupMember = await dispatch(
                postGroupMemberThunk({ name: groupName }, groupId)
            ).then(() => setHasSubmitted((prevValue) => !prevValue));
            return submitGroupMember;
        }
    };

    return (
        <div className={styles.createGroupFormContainer}>
            <div className={styles.createGroupHeader}>Join a group!</div>
            <form onSubmit={handleSubmit}>
                <input
                    className={styles.createGroupInput}
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="Group Name"
                    required
                />
                <input
                    className={styles.createGroupInput}
                    type="number"
                    value={groupId}
                    onChange={(e) => setGroupId(e.target.value)}
                    placeholder="Group Id"
                    required
                />
                {/* <div className={styles.errorMap}>
                    {errors.length > 0 && (
                        <div>
                            {errors.map((error) => (
                                <div key={error}>{error}</div>
                            ))}
                        </div>
                    )}
                </div> */}
                <button className={styles.createGroupButton} type="submit">Join Group</button>
            </form>
        </div>
    );
}

export default JoinGroupForm;