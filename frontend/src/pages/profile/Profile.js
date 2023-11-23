import React, { useEffect, useState } from 'react';
import './Profile.scss';
import PageMenu from '../../components/pageMenu/PageMenu';
import { useDispatch, useSelector } from 'react-redux';
import Card from '../../components/card/Card';
import {
  getUser,
  updatePhoto,
  updateUser,
} from '../../Redux/features/auth/authSlice';
import Loader from '../../components/loader/Loader';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { toast } from 'react-toastify';
import { shortenText } from '../../utils';

const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
const upload_preset = process.env.CLOUDINARY_PRESET;
const url = 'https://api.cloudinary.com/v1_1/deluxe-bluz/image/upload';

const Profile = () => {
  const dispatch = useDispatch();
  const { isLoading, user } = useSelector((state) => state.auth);
  const initialState = {
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    role: user?.role || '',
    photo: user?.photo || '',
    address: {
      address: user?.address?.address || '',
      state: user?.address?.state || '',
      country: user?.address?.country || '',
    },
  };
  const [profile, setProfile] = useState(initialState);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (user) {
      setProfile({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        role: user?.role || '',
        photo: user?.photo || '',
        address: {
          address: user?.address?.address || '',
          state: user?.address?.state || '',
          country: user?.address?.country || '',
        },
      });
    }
  }, [dispatch, user]);

  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
    setImagePreview(URL.createObjectURL(e.target.files[0]));
  };
  const savePhoto = async (e) => {
    e.preventDefault();

    let imageUrl;

    try {
      if (
        profile !== null &&
        (profileImage.type === 'image/jpeg' ||
          profileImage.type === 'image/jpg' ||
          profileImage.type === 'image/png')
      ) {
        const data = new FormData();
        data.append('file', profileImage);
        data.append('cloud_name', cloud_name);
        data.append('upload_preset', upload_preset);

        // Save image to cloudinary
        const response = await fetch(url, { method: 'post', body: data });

        const imgData = await response.json();
        console.log(imgData);
        imageUrl = imgData.url.toString();
      }
      // save image to mongodb
      const userData = {
        photo: profileImage ? imageUrl : profile.photo,
      };
      await dispatch(updatePhoto(userData));
      setImagePreview(null);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });

    // setProfile((prevProfile) => ({
    //   ...prevProfile,
    //   address: {
    //     ...prevProfile.address,
    //     [name]: value,
    //   },
    // }));
  };

  const saveProfile = async (e) => {
    e.preventDefault();

    const userData = {
      name: profile.name,
      phone: profile.phone,
      address: {
        address: profile.address.address,
        state: profile.address.state,
        country: profile.address.country,
      },
    };
    await dispatch(updateUser(userData));
    console.log(userData);
  };

  useEffect(() => {
    if (user === null) {
      dispatch(getUser());
    }
  }, [dispatch, user]);

  return (
    <>
      <section>
        {isLoading && <Loader />}
        <div className="container">
          <PageMenu />
          <h2>Profile</h2>
          <div className="--flex-start profile">
            <Card cardClass={'card'}>
              {!isLoading && (
                <>
                  <div className="profile-photo">
                    <div>
                      <img
                        src={imagePreview === null ? user?.photo : imagePreview}
                        alt="profile-image"
                      />
                      <h3>Role: {profile.role}</h3>
                      {imagePreview !== null && (
                        <div className="--center-all">
                          <button
                            className="--btn --btn-secondary"
                            onClick={savePhoto}
                          >
                            <AiOutlineCloudUpload size={18} /> Update Photo
                          </button>
                        </div>
                      )}
                    </div>{' '}
                  </div>
                  <form onSubmit={saveProfile}>
                    <p>
                      <label>Change photo</label>
                      <input
                        type="file"
                        accept="image/*"
                        name="image"
                        onChange={handleImageChange}
                      />
                    </p>
                    <p>
                      <label>Name:</label>
                      <input
                        type="text"
                        name="name"
                        value={profile?.name}
                        onChange={handleInputChange}
                        required
                      />
                    </p>
                    <p>
                      <label>Email:</label>
                      <input
                        type="email"
                        name="email"
                        value={profile?.email}
                        onChange={handleInputChange}
                        disabled
                      />
                    </p>
                    <p>
                      <label>Phone:</label>
                      <input
                        type="text"
                        name="phone"
                        value={profile?.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </p>
                    <p>
                      <label>address:</label>
                      <input
                        type="text"
                        name="address"
                        value={profile?.address?.address}
                        onChange={handleInputChange}
                        required
                      />
                    </p>
                    <p>
                      <label>State:</label>
                      <input
                        type="text"
                        name="state"
                        value={profile?.address?.state}
                        onChange={handleInputChange}
                        required
                      />
                    </p>
                    <p>
                      <label>Country:</label>
                      <input
                        type="text"
                        name="country"
                        value={profile?.address?.country}
                        onChange={handleInputChange}
                        required
                      />
                    </p>
                    <button className="--btn --btn-primary --btn-block">
                      Update Profile
                    </button>
                  </form>
                </>
              )}
            </Card>
          </div>
        </div>
      </section>
    </>
  );
};
export const UserName = () => {
  const { user } = useSelector((state) => state.auth);
  const userName = user?.name || '...';
  return (
    <span style={{ color: '#ff7722' }}>Hi, {shortenText(userName, 9)} |</span>
  );
};

export default Profile;
