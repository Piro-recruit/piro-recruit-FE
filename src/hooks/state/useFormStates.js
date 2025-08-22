import { useState } from 'react';

export const useFormStates = () => {
  const [editingField, setEditingField] = useState(null);
  const [editingValue, setEditingValue] = useState('');
  const [bulkChangeCount, setBulkChangeCount] = useState(10);
  const [subscriberCount, setSubscriberCount] = useState(247);
  
  const [emailContent, setEmailContent] = useState({
    subject: '',
    message: ''
  });

  const startEditing = (field, value) => {
    setEditingField(field);
    setEditingValue(value);
  };

  const cancelEditing = () => {
    setEditingField(null);
    setEditingValue('');
  };

  const updateEmailContent = (field, value) => {
    setEmailContent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return {
    editingField,
    editingValue,
    bulkChangeCount,
    subscriberCount,
    emailContent,
    setEditingField,
    setEditingValue,
    setBulkChangeCount,
    setSubscriberCount,
    setEmailContent,
    startEditing,
    cancelEditing,
    updateEmailContent
  };
};