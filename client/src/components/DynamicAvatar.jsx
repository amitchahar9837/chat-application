import { Avatar } from '@chakra-ui/react';
import { useSelector } from 'react-redux';

export default function DynamicAvatar (){
  const authUser = useSelector((state) => state.auth.authUser);

  return (
    <Avatar
      size="sm"
      name={authUser?.fullName}
      src=""
      cursor="pointer"
    />
  );
};
