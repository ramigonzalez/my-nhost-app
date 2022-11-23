import styles from "../styles/pages/Profile.module.css";

import { useState } from "react";
import { Helmet } from "react-helmet";
import { useOutletContext } from "react-router-dom";
import Input from "../components/Input";

import { gql, useMutation } from "@apollo/client";
import { toast } from "react-hot-toast";

import { nhost } from "../utils/nhost";

const UPDATE_USER_MUTATION = gql`
  mutation ($id: uuid!, $displayName: String!, $metadata: jsonb) {
    updateUser(
      pk_columns: { id: $id }
      _set: { displayName: $displayName, metadata: $metadata }
    ) {
      id
      displayName
      metadata
    }
  }
`;


const Profile = () => {
  const [mutateUser, { loading: updatingProfile }] =
    useMutation(UPDATE_USER_MUTATION);

  const { user } = useOutletContext();

  const [firstName, setFirstName] = useState(user?.metadata?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.metadata?.lastName ?? "");
  const [functionResponse, setFunctionResponse] = useState("<EMPTY>");

  const [imageUrl, setAvatarUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  const isFirstNameDirty = firstName !== user?.metadata?.firstName;
  const isLastNameDirty = lastName !== user?.metadata?.lastName;
  const isProfileFormDirty = isFirstNameDirty || isLastNameDirty;

  const updateUserProfile = async (e) => {
    e.preventDefault();

    try {
      await mutateUser({
        variables: {
          id: user.id,
          displayName: `${firstName} ${lastName}`.trim(),
          metadata: {
            firstName,
            lastName,
          },
        },
      });
      toast.success("Updated successfully", { id: "updateProfile" });
    } catch (error) {
      toast.error("Unable to update profile", { id: "updateProfile" });
    }
  };

  const callFunction = async (e) => {
    const { res, error } = await nhost.functions.call(`test?name=${firstName}`);
    console.log("FunctionResponse", res.data.data);
    setFunctionResponse(res.data.data);
  };

  const uploadImage = async (e) => {
    setUploading(true);

    if (!e.target.files || e.target.files.length === 0) {
      throw new Error("You must select an image to upload.");
    }
    const file = e.target.files[0];
    const { fileMetadata, error } = await nhost.storage.upload({ file });
    console.log("fileMetadata", fileMetadata);
  };

  return (
    <>
      <Helmet>
        <title>Profile - Nhost</title>
      </Helmet>

      <div className={styles.container}>
        <div className={styles.info}>
          <h2>Profile</h2>
          <p>Update your personal information.</p>
        </div>
        <div>
          <button
            type="submit"
            className={styles.button}
            onClick={callFunction}
          >
            Test Cloud Function
          </button>
          <p>{functionResponse}</p>
        </div>
        <div className={styles.card}>
          <form onSubmit={updateUserProfile} className={styles.form}>
            <div className={styles["form-fields"]}>
              <div className={styles["input-group"]}>
                <Input
                  type="text"
                  label="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
                <Input
                  type="text"
                  label="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
              <div className={styles["input-email-wrapper"]}>
                <Input
                  type="email"
                  label="Email address"
                  value={user?.email}
                  readOnly
                />
              </div>
              <div className={styles["input-email-wrapper"]}>
                <Input
                  type="file"
                  id="single"
                  accept="image/*"
                  onChange={uploadImage}
                  disabled={uploading}
                />
              </div>
            </div>

            <div className={styles["form-footer"]}>
              <button
                type="submit"
                disabled={!isProfileFormDirty}
                className={styles.button}
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Profile;
