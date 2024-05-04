import React, { useState, useEffect } from "react";
import { Container, VStack, Button, Text, Input, Select, Textarea, IconButton, useToast, Box, Flex, Spacer, Heading } from "@chakra-ui/react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const Index = () => {
  const [moods, setMoods] = useState([]);
  const supabaseUrl = "https://gxxjwzweauhzwudmnlqs.supabase.co/rest/v1/moods";
  const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4eGp3endlYXVoend1ZG1ubHFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQ4Mzg2NTksImV4cCI6MjAzMDQxNDY1OX0.OZKTyuAREJB8vUa1Nnd9z9hlO_UMZV44vqiKQsO8ttc";

  useEffect(() => {
    fetch(`${supabaseUrl}?select=*`, {
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setMoods(data))
      .catch((error) => console.error("Error fetching moods:", error));
  }, []);
  const [mood, setMood] = useState("");
  const [description, setDescription] = useState("");
  const [editingIndex, setEditingIndex] = useState(-1);
  const toast = useToast();

  const handleAddMood = () => {
    if (editingIndex === -1) {
      const moodData = { datetime: new Date().toISOString(), mood, description };
      fetch(supabaseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify(moodData),
      })
        .then((response) => response.json())
        .then(() => {
          setMoods([...moods, moodData]);
          toast({
            title: "Mood added",
            description: "Your mood has been recorded.",
            status: "success",
            duration: 2000,
            isClosable: true,
          });
        })
        .catch((error) => console.error("Error adding mood:", error));
      toast({
        title: "Mood added",
        description: "Your mood has been recorded.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } else {
      const updatedMoods = [...moods];
      const updatedMoodData = { datetime: new Date().toISOString(), mood, description };
      fetch(`${supabaseUrl}?id=eq.${moods[editingIndex].id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify(updatedMoodData),
      })
        .then((response) => response.json())
        .then(() => {
          updatedMoods[editingIndex] = updatedMoodData;
          setMoods(updatedMoods);
          setEditingIndex(-1);
          toast({
            title: "Mood updated",
            description: "Your mood has been updated.",
            status: "info",
            duration: 2000,
            isClosable: true,
          });
        })
        .catch((error) => console.error("Error updating mood:", error));
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
    fetch(`${supabaseUrl}?id=eq.${moods[index].id}`, {
      method: "DELETE",
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
      },
    })
      .then(() => {
        updatedMoods.splice(index, 1);
        setMoods(updatedMoods);
        toast({
          title: "Mood deleted",
          description: "Your mood has been deleted.",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      })
      .catch((error) => console.error("Error deleting mood:", error));
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
