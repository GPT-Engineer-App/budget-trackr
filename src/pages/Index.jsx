import React, { useState } from "react";
import { Box, Button, Container, Flex, FormControl, FormLabel, Input, Select, Text, VStack, IconButton, Table, Thead, Tbody, Tr, Th, Td, useToast } from "@chakra-ui/react";
import { FaPlus, FaEdit, FaTrash, FaDownload } from "react-icons/fa";

const Index = () => {
  const [transactions, setTransactions] = useState([
    { id: 1, date: "2023-01-01", amount: 500, type: "income", category: "Salary" },
    { id: 2, date: "2023-01-05", amount: 100, type: "expense", category: "Groceries" },
  ]);
  const [newTransaction, setNewTransaction] = useState({
    date: "",
    amount: "",
    type: "income",
    category: "Salary",
  });
  const [editingId, setEditingId] = useState(null);
  const toast = useToast();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTransaction((prev) => ({ ...prev, [name]: value }));
  };

  const addTransaction = () => {
    if (editingId) {
      setTransactions((prev) => prev.map((t) => (t.id === editingId ? { ...t, ...newTransaction } : t)));
      setEditingId(null);
    } else {
      setTransactions((prev) => [...prev, { id: Date.now(), ...newTransaction }]);
    }
    setNewTransaction({ date: "", amount: "", type: "income", category: "Salary" });
  };

  const editTransaction = (transaction) => {
    setNewTransaction({ ...transaction });
    setEditingId(transaction.id);
  };

  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    toast({
      title: "Transaction deleted.",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  const calculateBalance = () => {
    return transactions.reduce((acc, transaction) => {
      return transaction.type === "income" ? acc + transaction.amount : acc - transaction.amount;
    }, 0);
  };

  const exportToJson = () => {
    const blob = new Blob([JSON.stringify(transactions)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "transactions.json";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <Container maxW="container.md" py={10}>
      <VStack spacing={5}>
        <Box w="100%">
          <Text fontSize="2xl" mb={4}>
            Wallet Balance: ${calculateBalance()}
          </Text>
          <Button leftIcon={<FaDownload />} onClick={exportToJson}>
            Export Transactions
          </Button>
        </Box>
        <FormControl>
          <FormLabel>Date</FormLabel>
          <Input type="date" name="date" value={newTransaction.date} onChange={handleInputChange} />
        </FormControl>
        <FormControl>
          <FormLabel>Amount</FormLabel>
          <Input type="number" name="amount" value={newTransaction.amount} onChange={handleInputChange} />
        </FormControl>
        <FormControl>
          <FormLabel>Type</FormLabel>
          <Select name="type" value={newTransaction.type} onChange={handleInputChange}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>Category</FormLabel>
          <Select name="category" value={newTransaction.category} onChange={handleInputChange}>
            <option value="Salary">Salary</option>
            <option value="Groceries">Groceries</option>
            <option value="Bills">Bills</option>
            {/* Add more categories as needed */}
          </Select>
        </FormControl>
        <Button leftIcon={<FaPlus />} colorScheme="blue" onClick={addTransaction} isDisabled={!newTransaction.date || !newTransaction.amount}>
          {editingId ? "Update Transaction" : "Add Transaction"}
        </Button>
      </VStack>
      <Table variant="simple" mt={10}>
        <Thead>
          <Tr>
            <Th>Date</Th>
            <Th>Amount</Th>
            <Th>Type</Th>
            <Th>Category</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {transactions.map((transaction) => (
            <Tr key={transaction.id}>
              <Td>{transaction.date}</Td>
              <Td>${transaction.amount}</Td>
              <Td>{transaction.type}</Td>
              <Td>{transaction.category}</Td>
              <Td>
                <IconButton aria-label="Edit" icon={<FaEdit />} onClick={() => editTransaction(transaction)} mr={2} />
                <IconButton aria-label="Delete" icon={<FaTrash />} onClick={() => deleteTransaction(transaction.id)} colorScheme="red" />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Container>
  );
};

export default Index;
