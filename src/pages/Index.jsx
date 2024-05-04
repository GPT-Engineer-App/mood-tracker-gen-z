import React, { useState } from "react";
import { Container, VStack, Button, Text, Input, Select, Textarea, IconButton, useToast, Box, Flex, Spacer, Heading } from "@chakra-ui/react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const Index = () => {
  const [moods, setMoods] = useState([]);
  const [mood, setMood] = useState("");
  const [description, setDescription] = useState("");
  const [editingIndex, setEditingIndex] = useState(-1);
  const toast = useToast();

  const handleAddMood = () => {
    if (editingIndex === -1) {
      setMoods([...moods, { datetime: new Date().toISOString(), mood, description }]);
      toast({
        title: "Mood added",
        description: "Your mood has been recorded.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } else {
      const updatedMoods = [...moods];
      updatedMoods[editingIndex] = { datetime: new Date().toISOString(), mood, description };
      setMoods(updatedMoods);
      setEditingIndex(-1);
      toast({
        title: "Mood updated",
        description: "Your mood has been updated.",
        status: "info",
        duration: 2000,
        isClosable: true,
      });
    }
    setMood("");
    setDescription("");
  };

  const handleEdit = (index) => {
    setMood(moods[index].mood);
    setDescription(moods[index].description);
    setEditingIndex(index);
  };

  const handleDelete = (index) => {
    const updatedMoods = [...moods];
    updatedMoods.splice(index, 1);
    setMoods(updatedMoods);
    toast({
      title: "Mood deleted",
      description: "Your mood has been deleted.",
      status: "error",
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <Container maxW="container.md" p={5}>
      <VStack spacing={4} align="stretch">
        <Heading as="h1" size="xl" textAlign="center">
          Mood Tracker
        </Heading>
        <Select placeholder="Select mood" value={mood} onChange={(e) => setMood(e.target.value)}>
          <option value="Happy">Happy</option>
          <option value="Sad">Sad</option>
          <option value="Lit">Lit</option>
          <option value="Salty">Salty</option>
          <option value="Woke">Woke</option>
        </Select>
        <Textarea placeholder="Describe your mood..." value={description} onChange={(e) => setDescription(e.target.value)} />
        <Button leftIcon={editingIndex === -1 ? <FaPlus /> : <FaEdit />} colorScheme="blue" onClick={handleAddMood}>
          {editingIndex === -1 ? "Add Mood" : "Update Mood"}
        </Button>
        {moods.map((entry, index) => (
          <Box key={index} p={3} shadow="md" borderWidth="1px">
            <Flex>
              <Box p="2">
                <Text fontWeight="bold">{entry.mood}</Text>
                <Text fontSize="sm">{entry.datetime}</Text>
                <Text mt={2}>{entry.description}</Text>
              </Box>
              <Spacer />
              <Box>
                <IconButton aria-label="Edit mood" icon={<FaEdit />} m={1} onClick={() => handleEdit(index)} />
                <IconButton aria-label="Delete mood" icon={<FaTrash />} m={1} onClick={() => handleDelete(index)} />
              </Box>
            </Flex>
          </Box>
        ))}
      </VStack>
    </Container>
  );
};

export default Index;
