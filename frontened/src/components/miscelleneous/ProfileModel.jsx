import { Text, Image, Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import { IoEye } from "react-icons/io5";
import PropTypes from 'prop-types';

function ProfileModel({ user, children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div>
      {children ? (
        <span onClick={onOpen} style={{ cursor: 'pointer' }}>
          {children}
        </span>
      ) : (
        <Button onClick={onOpen} aria-label="View Profile">
          <IoEye />
        </Button>
      )}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent display="flex" flexDirection="column" alignItems="center">
          <ModalHeader>{user.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" alignItems="center" flexDirection="column">
            <Image
              borderRadius='full'
              boxSize='150px'
              src={user.pic}
              alt={`${user.name}'s photo`}
            />
            <Text fontSize="2xl">
              Email: {user.email}
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

ProfileModel.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    pic: PropTypes.string.isRequired,
  }).isRequired,
  children: PropTypes.node,
};

export default ProfileModel;
