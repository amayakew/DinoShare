import { Avatar } from "@mui/material";

type FirstLetterAvatarProps = {
    text: string | undefined
};

const FirstLetterAvatar = ({text}: FirstLetterAvatarProps) => {
    return <Avatar sx={{ bgcolor: 'primary.light', width: 32, height: 32 }}>{text && text[0]}</Avatar>;
};

export default FirstLetterAvatar;
