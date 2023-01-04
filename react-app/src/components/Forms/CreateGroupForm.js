import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { postGroupThunk } from "../../store/group";
import styles from "../cssModules/CreateGroupForm.module.css"

function CreateGroupForm({ setHasSubmitted, setShowModal }) {
    const dispatch = useDispatch();

    const [groupName, setGroupName] = useState("");
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
            setShowModal(false);
            const submitGroup = await dispatch(
                postGroupThunk({ name: groupName })
            ).then(() => setHasSubmitted((prevValue) => !prevValue));
            return submitGroup;
        }
    };

    return (
        <div className={styles.createGroupFormContainer}>
            <div className={styles.createGroupHeader}>Create your own group!</div>
            <form onSubmit={handleSubmit}>
                <input
                    className={styles.createGroupInput}
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="Group Name"
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
                <button className={styles.createGroupButton} type="submit">Create Group</button>
            </form>
        </div>
    );
}

export default CreateGroupForm;