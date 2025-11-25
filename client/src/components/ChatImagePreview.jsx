import { Box, Image, Flex, Spinner } from "@chakra-ui/react";

const ChatImagePreview = ({ localFile, imageUrl, isUploading }) => {
  const localPreview = localFile ? URL.createObjectURL(localFile) : null;

  return (
    <Box position="relative" mb={2}>
      {/* Image Preview */}
      <Image
        src={localPreview || imageUrl}
        fallbackSrc={imageUrl}
        alt="Preview"
        fit="contain"
        w="100%"
        maxH="250px"
        borderRadius="md"
        objectFit="contain"
        bg="gray.50"
      />

      {/* Overlay While Uploading */}
      {isUploading && (
        <Flex
          position="absolute"
          top={0}
          left={0}
          w="100%"
          h="100%"
          bg="blackAlpha.500"
          align="center"
          justify="center"
          borderRadius="md"
        >
          <Spinner size="lg" color="white" />
        </Flex>
      )}
    </Box>
  );
};

export default ChatImagePreview;
