import React from "react";
import './ProfileCircle.css';

const ProfileCircle = ({userInitials}) => {
    const circleBackgroudnColor = '#34a853';

    return (
        <div className="profile-circle" style={{backgroundColor: circleBackgroudnColor}}>
            {userInitials}
        </div>
    );
};

export default ProfileCircle;