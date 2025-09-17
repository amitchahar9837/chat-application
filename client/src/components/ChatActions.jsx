import { Text, VStack } from "@chakra-ui/react";
import { useRef } from "react";

const ChatActions = ({onFileSelect}) => {
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const docInputRef = useRef(null);

  const handleFileClick = (type) => {
    if (type === "photos") fileInputRef.current.click();
    if (type === "videos") videoInputRef.current.click();
    if (type === "documents") docInputRef.current.click();
  };
  function togglePreview(){
    setShowPreview(prev=>!prev)
  }

  const handleFileChange = (e, type) => {
    const files = Array.from(e.target.files);
    onFileSelect(files, type);
  };
  

  return (
    <>
      <VStack
        position="absolute"
        bottom="130%"
        left="0"
        spacing={2}
        bg="white"
        p={2}
        borderRadius="md"
        boxShadow="md"
        align="start"
        w="150px"
        zIndex={10}
      >
        <Text _hover={{ color: "blue.500", cursor: "pointer" }} onClick={() => handleFileClick("documents")}>Document</Text>
        <Text _hover={{ color: "blue.500", cursor: "pointer" }} onClick={() => handleFileClick("camera")}>Camera</Text>
        <Text _hover={{ color: "blue.500", cursor: "pointer" }} onClick={() => handleFileClick("photos")}>Photos</Text>
        <Text _hover={{ color: "blue.500", cursor: "pointer" }} onClick={() => handleFileClick("videos")}>Videos</Text>
      </VStack>

      {/* Hidden inputs */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        multiple
        hidden
        onChange={(e) => handleFileChange(e, "photos")}
      />
      <input
        type="file"
        ref={videoInputRef}
        accept="video/*"
        multiple
        hidden
        onChange={(e) => handleFileChange(e, "videos")}
      />
      <input
        type="file"
        ref={docInputRef}
        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
        multiple
        hidden
        onChange={(e) => handleFileChange(e, "documents")}
      />      
    </>
  );
};

export default ChatActions;
